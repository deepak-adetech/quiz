/**
 * SiteLogo — uses the real CometLab SVG logo.
 *
 * variant="dark"  → black/grey logo  (for light backgrounds: quiz, results)
 * variant="light" → white/grey logo  (for dark backgrounds: /start)
 */
export default function SiteLogo({ variant = 'dark' }) {
  const src = variant === 'light' ? '/logo-light.svg' : '/logo-dark.svg';

  return (
    <a
      href="https://www.cometlab.in"
      className="nav-logo"
      aria-label="CometLab — go to the main site"
    >
      <img
        src={src}
        alt="CometLab"
        className="nav-logo-img"
        height="28"
      />
    </a>
  );
}
