'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/programs', label: 'Programs', icon: '📋' },
    { href: '/history', label: 'History', icon: '📊' },
  ];

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            🏋️ Built With Science
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
