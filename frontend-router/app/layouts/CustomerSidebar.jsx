import * as React from 'react';
import { NavLink, Outlet, useNavigate, useLoaderData, Navigate } from 'react-router';
import {
  Home,
  Users,
  Calendar,
  FileText,
  CreditCard,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { API_BASE_URL } from '~/config';
import { getCustomerAuth, clearAuthCache } from '~/lib/auth-cache';

export async function clientLoader() {
  const data = await getCustomerAuth();
  if (!data.logged_in) {
    return { logged_in: false };
  }
  return {
    logged_in: true,
    customer_name: data.name,
    customer_id: data.customer_id,
  };
}

export function shouldRevalidate() {
  return false;
}

const sidebarLinks = [
  { to: '/customers/dashboard', icon: Home, label: 'Dashboard' },
  { to: '/customers/vendors', icon: Users, label: 'Vendors' },
  { to: '/customers/subscriptions', icon: FileText, label: 'Subscriptions' },
  { to: '/customers/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/customers/payments', icon: CreditCard, label: 'Payments' },
  { to: '/customers/profile', icon: User, label: 'Profile' },
];

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary">Milk Tracker</h2>
        <p className="text-sm text-muted-foreground">Customer Portal</p>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-4">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Separator />
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function CustomerSidebar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const loaderData = useLoaderData();

  if (!loaderData.logged_in) {
    return <Navigate to="/customers/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/customers/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      clearAuthCache();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen">

      <aside className="hidden w-64 border-r bg-card lg:block">
        <SidebarContent onLogout={handleLogout} />
      </aside>


      <div className="flex flex-1 flex-col">

        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-card px-4 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent onNavigate={() => setOpen(false)} onLogout={handleLogout} />
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">Milk Tracker</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
