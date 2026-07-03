import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Logo(): JSX.Element {
  const logoSrc = useBaseUrl('/img/favicon.svg');

  return (
    <Link to="/" aria-label="Ductape Docs home" className="navbar__brand navbar-ductape-brand">
      <img
        src={logoSrc}
        alt=""
        width={28}
        height={28}
        className="navbar__logo"
        aria-hidden="true"
      />
      <span className="navbar-ductape-brand__title">Ductape</span>
      <span className="navbar-ductape-brand__badge">Beta</span>
      <span className="navbar-ductape-brand__label">Docs</span>
    </Link>
  );
}
