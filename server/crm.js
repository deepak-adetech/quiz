/**
 * Twenty CRM integration — auto-creates Company, Person, and Opportunity.
 */

import 'dotenv/config';

const TWENTY_API_URL = process.env.TWENTY_API_URL || 'http://localhost:3000';
const TWENTY_API_KEY = process.env.TWENTY_API_KEY || '';

async function gql(query, variables = {}) {
  if (!TWENTY_API_KEY) return null;
  const res = await fetch(`${TWENTY_API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TWENTY_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error('[CRM] GraphQL errors:', JSON.stringify(json.errors));
    return null;
  }
  return json.data;
}

async function findOrCreateCompany(companyName, website) {
  if (!companyName) return null;
  const searchData = await gql(`
    query SearchCompany($filter: CompanyFilterInput) {
      companies(filter: $filter) { edges { node { id name } } }
    }
  `, { filter: { name: { like: `%${companyName}%` } } });

  const existing = searchData?.companies?.edges?.[0]?.node;
  if (existing) {
    console.log(`[CRM] Found existing company: ${existing.name} (${existing.id})`);
    return existing.id;
  }

  const domainName = website
    ? website.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    : '';

  const createData = await gql(`
    mutation CreateCompany($data: CompanyCreateInput!) {
      createCompany(data: $data) { id name }
    }
  `, {
    data: {
      name: companyName,
      ...(domainName ? { domainName: { primaryLinkUrl: website || '', primaryLinkLabel: domainName } } : {}),
    },
  });

  const created = createData?.createCompany;
  if (created) {
    console.log(`[CRM] Created company: ${created.name} (${created.id})`);
    return created.id;
  }
  return null;
}

async function findOrCreatePerson(lead, companyId) {
  const searchData = await gql(`
    query SearchPerson($filter: PersonFilterInput) {
      people(filter: $filter) { edges { node { id name { firstName lastName } } } }
    }
  `, { filter: { emails: { primaryEmail: { eq: lead.email } } } });

  const existing = searchData?.people?.edges?.[0]?.node;
  if (existing) {
    console.log(`[CRM] Found existing person: ${lead.email} (${existing.id})`);
    return existing.id;
  }

  const rawPhone = (lead.phone || '').replace(/\D/g, '');
  const createData = await gql(`
    mutation CreatePerson($data: PersonCreateInput!) {
      createPerson(data: $data) { id name { firstName lastName } }
    }
  `, {
    data: {
      name: { firstName: lead.first_name || '', lastName: lead.last_name || '' },
      emails: { primaryEmail: lead.email },
      ...(lead.role ? { jobTitle: lead.role } : {}),
      ...(rawPhone ? { phones: { primaryPhoneNumber: rawPhone, primaryPhoneCallingCode: '+91' } } : {}),
      ...(companyId ? { companyId } : {}),
    },
  });

  const created = createData?.createPerson;
  if (created) {
    console.log(`[CRM] Created person: ${lead.email} (${created.id})`);
    return created.id;
  }
  return null;
}

async function createOpportunity(lead, companyId, personId) {
  const name = [
    lead.opportunity_name || 'Lead',
    lead.company ? `— ${lead.company}` : '',
  ].filter(Boolean).join(' ');

  const createData = await gql(`
    mutation CreateOpportunity($data: OpportunityCreateInput!) {
      createOpportunity(data: $data) { id name }
    }
  `, {
    data: {
      name,
      stage: 'NEW',
      ...(companyId ? { companyId } : {}),
      ...(personId ? { pointOfContactId: personId } : {}),
    },
  });

  const created = createData?.createOpportunity;
  if (created) {
    console.log(`[CRM] Created opportunity: ${created.name} (${created.id})`);
    if (lead.note_body && (personId || companyId)) {
      await gql(`
        mutation CreateNote($data: NoteCreateInput!) {
          createNote(data: $data) { id }
        }
      `, {
        data: {
          title: lead.note_title || 'Lead Details',
          body: lead.note_body,
          noteTargets: { create: [{ opportunityId: created.id }] },
        },
      });
    }
    return created.id;
  }
  return null;
}

export async function syncNewsletterToCRM(name, email) {
  if (!TWENTY_API_KEY) {
    console.warn('[CRM] TWENTY_API_KEY not set — skipping newsletter sync');
    return null;
  }
  try {
    const data = await gql(`
      mutation CreateNewsletter($data: NewsletterCreateInput!) {
        createNewsletter(data: $data) { id name }
      }
    `, {
      data: {
        name: name || email,
        email: { primaryEmail: email },
      },
    });
    const created = data?.createNewsletter;
    if (created) {
      console.log(`[CRM] Newsletter subscriber added: ${email} (${created.id})`);
    }
    return created?.id || null;
  } catch (err) {
    console.error('[CRM] Newsletter sync failed:', err.message);
    return null;
  }
}

export async function syncLeadToCRM(lead) {
  if (!TWENTY_API_KEY) {
    console.warn('[CRM] TWENTY_API_KEY not set — skipping CRM sync');
    return { crm_person_id: null, crm_company_id: null, crm_opportunity_id: null };
  }
  try {
    const crm_company_id = await findOrCreateCompany(lead.company, lead.website);
    const crm_person_id = await findOrCreatePerson(lead, crm_company_id);
    const crm_opportunity_id = await createOpportunity(lead, crm_company_id, crm_person_id);
    return { crm_person_id, crm_company_id, crm_opportunity_id };
  } catch (err) {
    console.error('[CRM] Sync failed:', err.message);
    return { crm_person_id: null, crm_company_id: null, crm_opportunity_id: null };
  }
}
