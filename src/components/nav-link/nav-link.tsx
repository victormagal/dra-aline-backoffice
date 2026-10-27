'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  className?: string;
  activeClassName?: string;
  children: ReactNode;
};

// Marks the link active when the current path is the href or a child of it (like routerLinkActive).
export default function NavLink({ href, className, activeClassName, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={[className, active && activeClassName].filter(Boolean).join(' ')}>
      {children}
    </Link>
  );
}
