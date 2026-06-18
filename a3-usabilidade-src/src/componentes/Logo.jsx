import { logoNexus } from '../assets/index.js';

export default function Logo({ className = '', title = 'Nexus' }) {
  return (
    <span
      role="img"
      aria-label={title}
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        aspectRatio: '97 / 141',
        WebkitMask: `url(${logoNexus}) center / contain no-repeat`,
        mask: `url(${logoNexus}) center / contain no-repeat`,
      }}
    />
  );
}
