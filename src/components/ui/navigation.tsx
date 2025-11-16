'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📈' },
    { href: '/programs', label: 'Programs', icon: '📋' },
    { href: '/history', label: 'History', icon: '📊' },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      console.log('🚪 Logging out...');
      await signOut();
      console.log('✅ Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      setLoggingOut(false);
    }
  };

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

            {/* Logout Button - Only show if user is logged in */}
            {user && (
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saindo...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </>
                )}
              </button>
            )}
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
                <Link href={item.href}>{item.icon}</Link>
              </Button>
            ))}

            {/* Mobile Logout Button */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-red-600 hover:text-red-700"
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
