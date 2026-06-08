'use client';

import { Link } from '@payloadcms/ui';
import { usePathname } from 'next/navigation.js';

type NavLinkClientProps = {
  href: string;
};

const NavLink = ({ href }: NavLinkClientProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link className={`nav__link ${isActive ? 'active' : ''}`} href={href}>
      <span className="nav__link-label">Cache control</span>
    </Link>
  );
};

export default NavLink;
