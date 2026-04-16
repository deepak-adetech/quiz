/**
 * Fallback result generator when Claude API is unavailable.
 */

export function generateFallback(code, archetype) {
  const isManual = code[0] === 'M';
  const isCentralized = code[1] === 'C';
  const isSiloed = code[2] === 'S';
  const isProactive = code[3] === 'P';

  // Specific fallback for The Foundation (demo archetype)
  if (code === 'MCSP') {
    return {
      execution_style:
        'Manual workflows dominate, but execution is methodical. Processes are well-documented and followed consistently. Humans drive everything, but they follow clear procedures.',
      data_approach:
        'Centralized data with excellent quality. Single source of truth exists for critical information. Data is clean, organized, and accessible to leadership. Reporting and dashboards are accurate.',
      connection_pattern:
        "Teams work in departmental bubbles despite shared data. Each department has its own processes and tools. Data flows to leadership, but teams don't collaborate across boundaries.",
      control_posture:
        "Proactive planning at the strategic level. Leadership has excellent visibility into what's happening. You can see problems clearly and plan solutions, but execution lags behind strategy.",
      cultural_dna:
        "Strategic vision without tactical execution. You know exactly what needs to be done, but translating that vision into coordinated action across departments is the challenge. Data gives you clarity, but teams don't work together.",
      superpowers: [
        'Accurate reporting and dashboards',
        'Clear priorities based on real data',
        'Strong leadership and planning',
        'Data quality is excellent',
      ],
      superpower_emojis: ['\uD83D\uDCCA', '\uD83C\uDFAF', '\uD83D\uDCCB', '\uD83D\uDC8E'],
      kryptonite: [
        "Teams don't collaborate across departments",
        'Manual handoffs cause delays',
        "Execution doesn't match strategy",
        "Can see the problems but can't fix them fast enough",
      ],
      kryptonite_emojis: ['\uD83D\uDC65', '\uD83D\uDD04', '\uD83D\uDE13', '\uD83D\uDCC9'],
      ideal_starting_points: [
        'Automate cross-functional workflows',
        'Break down departmental silos',
        'Integrate communication channels',
      ],
      famous_last_words: '"We have the data, we just need someone to execute."',
      real_world_example:
        "Professional services firm, 75 people, beautiful CRM and dashboards, but project delivery still a mess because teams don't talk.",
      why_animal:
        "Like an owl, you see everything clearly from above — you have excellent vision and can spot problems from a distance. You're wise and strategic, but you watch rather than act. Your data gives you perfect clarity, but you're still figuring out how to translate that vision into coordinated action across your organization.",
    };
  }

  // Generic fallback built from the code letters
  return {
    execution_style: isManual
      ? 'Your organization relies heavily on human-driven processes. While this means deep institutional knowledge, it also creates bottlenecks and key-person dependencies. Workflows are followed consistently, but they depend on people rather than systems.'
      : 'Your organization has embraced automation in its workflows. Systems handle routine work efficiently, freeing people to focus on higher-value tasks. Technology amplifies your team\'s capacity.',
    data_approach: isCentralized
      ? 'Data is well-organized and centralized. Leadership can access reliable information quickly, and reporting is generally trustworthy. You have a solid foundation of data quality to build upon.'
      : 'Data is scattered across multiple systems and tools. Getting a single, reliable view of the business requires significant effort. Different teams often work from conflicting numbers.',
    connection_pattern: isSiloed
      ? "Teams tend to work in departmental bubbles. Cross-functional collaboration happens but requires deliberate effort and often goes through leadership. Each department has its own rhythm and tools."
      : 'Teams are well-connected and collaborate naturally. Information flows across departments, and shared tools keep everyone aligned on priorities and progress.',
    control_posture: isProactive
      ? "Your organization plans ahead and spots problems early. Strategic thinking is strong, with clear roadmaps and regular review cycles. You're forward-looking in how you manage operations."
      : 'Your organization tends to operate in reactive mode. Issues are addressed as they arise, and planning horizons are typically short-term. The team is responsive but often overwhelmed.',
    cultural_dna: `Your ${archetype.name} archetype reflects an organization where ${
      isManual ? 'human expertise drives the work' : 'technology amplifies the work'
    }, ${
      isCentralized ? 'data provides clarity' : 'data needs consolidation'
    }, ${
      isSiloed ? 'but teams need better bridges between departments' : 'and teams collaborate effectively'
    }, ${
      isProactive ? 'with leadership always looking ahead.' : 'though more proactive planning would help.'
    }`,
    superpowers: [
      isManual ? 'Deep institutional knowledge and expertise' : 'Efficient automated workflows',
      isCentralized ? 'Reliable data and clear reporting' : 'Flexibility and team autonomy',
      isSiloed ? 'Strong departmental focus and specialization' : 'Cross-functional collaboration',
      isProactive ? 'Strategic thinking and forward planning' : 'Agility and quick response times',
    ],
    superpower_emojis: ['\uD83D\uDCCA', '\uD83C\uDFAF', '\uD83D\uDCCB', '\uD83D\uDC8E'],
    kryptonite: [
      isManual ? 'Manual processes create bottlenecks' : 'Over-reliance on automation can miss nuance',
      isCentralized ? 'Centralized systems can become single points of failure' : 'Fragmented data causes conflicting reports',
      isSiloed ? 'Teams miss opportunities to collaborate' : 'Too many meetings and coordination overhead',
      isProactive ? 'Analysis paralysis can slow down execution' : 'Constantly fighting fires drains the team',
    ],
    kryptonite_emojis: ['\uD83D\uDC65', '\uD83D\uDD04', '\uD83D\uDE13', '\uD83D\uDCC9'],
    ideal_starting_points: [
      isManual ? 'Identify the top 3 manual processes to automate first' : 'Audit automations for gaps and inefficiencies',
      isCentralized ? 'Extend data access to frontline teams' : 'Consolidate data into a single source of truth',
      isSiloed ? 'Create cross-functional project teams' : 'Streamline collaboration tools to reduce noise',
    ],
    famous_last_words: isManual
      ? '"We\'ve always done it this way and it works... mostly."'
      : '"The system handles it — I think."',
    real_world_example: `A mid-sized company with ${
      isManual ? 'dedicated teams following established procedures' : 'modern tools and automation'
    }, ${
      isCentralized ? 'solid data infrastructure' : 'data spread across many tools'
    }, but struggling with ${
      isSiloed ? 'getting departments to work together' : 'information overload'
    } and ${
      isProactive ? 'turning plans into action fast enough' : 'staying ahead of problems instead of reacting to them'
    }.`,
    why_animal: `Like the ${archetype.animal}, your organization embodies ${
      isProactive ? 'watchfulness and foresight' : 'adaptability and quick reflexes'
    }. ${
      isCentralized ? 'You gather information effectively' : "You're resourceful across many environments"
    }, ${
      isSiloed ? 'but tend to operate in your own territory' : 'and thrive through group dynamics'
    }.`,
  };
}
