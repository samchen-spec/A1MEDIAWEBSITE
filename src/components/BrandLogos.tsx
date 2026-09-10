/* Brand marks for the tools we run partner accounts on, drawn as inline SVG in
   their own colours — these are the one place on the site that isn't gold.
   Nominative use: they identify the products, nothing more.

   Swap the roster in `TOOLS` (Infographics.tsx) if the stack changes. */

export function FigmaMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 57" className={className} role="img" aria-label="Figma">
      <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
      <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" />
      <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" />
      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
      <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" />
    </svg>
  );
}

export function SlackMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 122.8 122.8" className={className} role="img" aria-label="Slack">
      <path fill="#E01E5A" d="M25.8 77.6a12.9 12.9 0 1 1-12.9-12.9h12.9v12.9Zm6.5 0a12.9 12.9 0 0 1 25.8 0v32.3a12.9 12.9 0 0 1-25.8 0V77.6Z" />
      <path fill="#36C5F0" d="M45.2 25.8a12.9 12.9 0 1 1 12.9-12.9v12.9H45.2Zm0 6.5a12.9 12.9 0 0 1 0 25.8H12.9a12.9 12.9 0 0 1 0-25.8h32.3Z" />
      <path fill="#2EB67D" d="M97 45.2a12.9 12.9 0 1 1 12.9 12.9H97V45.2Zm-6.5 0a12.9 12.9 0 0 1-25.8 0V12.9a12.9 12.9 0 0 1 25.8 0v32.3Z" />
      <path fill="#ECB22E" d="M77.6 97a12.9 12.9 0 1 1-12.9 12.9V97h12.9Zm0-6.5a12.9 12.9 0 0 1 0-25.8h32.3a12.9 12.9 0 0 1 0 25.8H77.6Z" />
    </svg>
  );
}

export function NotionMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Notion">
      <rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#FFFFFF" />
      <path
        fill="#0D0D0D"
        d="M8 17V7.6l1.9-.3 4.4 6.3V7.3l1.6-.2v9.6l-1.8.3-4.5-6.6V17H8Z"
      />
    </svg>
  );
}

export function StripeMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Stripe">
      <rect width="24" height="24" rx="5" fill="#635BFF" />
      <path
        fill="#FFFFFF"
        d="M11.4 9.6c0-.5.4-.7 1.1-.7 1 0 2.2.3 3.2.8V6.9a8.5 8.5 0 0 0-3.2-.6c-2.6 0-4.3 1.4-4.3 3.6 0 3.5 4.7 3 4.7 4.5 0 .6-.5.8-1.2.8-1 0-2.4-.4-3.5-1v2.9c1.2.5 2.4.7 3.5.7 2.7 0 4.5-1.3 4.5-3.6 0-3.8-4.8-3.2-4.8-4.6Z"
      />
    </svg>
  );
}

export function ZapierMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Zapier">
      <g fill="#FF4F00">
        <rect x="10.1" y="1" width="3.8" height="22" rx="1.9" />
        <rect x="10.1" y="1" width="3.8" height="22" rx="1.9" transform="rotate(60 12 12)" />
        <rect x="10.1" y="1" width="3.8" height="22" rx="1.9" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function MetaMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 19" className={className} role="img" aria-label="Meta">
      <defs>
        <linearGradient id="metaBlue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0064E0" />
          <stop offset="100%" stopColor="#0082FB" />
        </linearGradient>
      </defs>
      <path
        d="M16 9.5C12.5 3.6 10 2.6 7.4 2.6 4 2.6 2 5.6 2 9.5c0 3.9 2 6.9 5.4 6.9 2.9 0 5.1-2.8 8.6-6.9 3.5-4.1 5.7-6.9 8.6-6.9 3.4 0 5.4 3 5.4 6.9 0 3.9-2 6.9-5.4 6.9-2.6 0-5.1-1-8.6-6.9Z"
        fill="none"
        stroke="url(#metaBlue)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
