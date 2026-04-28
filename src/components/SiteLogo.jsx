/**
 * Shared brand mark + wordmark used in every nav. Always points to the
 * marketing site (https://awf-alpha.vercel.app/) so the quiz reads as
 * a sub-experience of the main AutoWorkFlow.AI product. The href is
 * an absolute URL on purpose — react-router's <Link> would treat it
 * as an internal route.
 *
 * `gradId` keeps the inline gradient unique per render site so two
 * nav logos on the same page (impossible today, but cheap insurance)
 * don't share a defs id.
 */
export default function SiteLogo({ gradId = 'siteLogoGrad' }) {
  return (
    <a
      href="https://awf-alpha.vercel.app/"
      className="nav-logo"
      aria-label="AutoWorkFlow.AI — go to the main site"
    >
      <span className="nav-mark" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0A84FF" />
              <stop offset="55%" stopColor="#5E5CE6" />
              <stop offset="100%" stopColor="#BF5AF2" />
            </linearGradient>
          </defs>
          <path
            d="M 15 2 C 15 11, 15 11, 26 14 C 15 17, 15 17, 15 26 C 15 17, 15 17, 4 14 C 15 11, 15 11, 15 2 Z"
            fill={`url(#${gradId})`}
          />
        </svg>
      </span>
      <span className="nav-wordmark">AutoWorkFlow<span className="nav-logo-accent">.AI</span></span>
    </a>
  );
}
