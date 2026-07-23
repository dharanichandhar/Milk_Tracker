import { Outlet, useLoaderData, useRevalidator, Link, NavLink } from 'react-router';
import { Toaster, toast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Milk, User, LogOut } from 'lucide-react';
import { API_BASE_URL } from "~/config";

export async function clientLoader() {
  try {
    const [customerRes, vendorRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/customers/me`, { credentials: 'include' }),
      fetch(`${API_BASE_URL}/api/vendors/me`, { credentials: 'include' }),
    ]);

    const customer = await customerRes.json();
    const vendor = await vendorRes.json();

    if (customer.logged_in) {
      return {
        logged_in: true,
        userType: 'customer',
        name: customer.name,
        id: customer.customer_id,
      };
    } else if (vendor.logged_in) {
      return {
        logged_in: true,
        userType: 'vendor',
        name: vendor.name,
        id: vendor.vendor_id,
      };
    }
  } catch (err) {
    console.error('Auth check failed', err);
  }

  return {
    logged_in: false,
    userType: null,
    name: null,
    id: null,
  };
}

clientLoader.hydrate = true;

export function shouldRevalidate() {
  return true;
}

export default function NavbarLayout() {
  const loaderData = useLoaderData();
  const revalidator = useRevalidator();

  const handleLogout = async () => {
    try {
      if (loaderData.userType === 'customer') {
        await fetch(`${API_BASE_URL}/api/customers/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } else if (loaderData.userType === 'vendor') {
        await fetch(`${API_BASE_URL}/api/vendors/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      }

      revalidator.revalidate();
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout failed', err);
      toast.error('Logout failed');
    }
  };

  const getDashboardRoute = () => {
    return loaderData.userType === 'customer'
      ? '/customers/dashboard'
      : '/vendors/dashboard';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Milk className="h-6 w-6 text-primary" />
            <span className="font-bold">Milk Tracker</span>
          </Link>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {loaderData.logged_in && (
                <NavLink
                  to={getDashboardRoute()}
                  className={({ isActive }) =>
                    `mr-4 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </div>

            <nav className="flex items-center space-x-2">
              {!loaderData.logged_in ? (
                <>
                  <Button variant="ghost" asChild>
                    <NavLink to="/customers/login">Customer</NavLink>
                  </Button>
                  <Button variant="ghost" asChild>
                    <NavLink to="/vendors/login">Vendor</NavLink>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {loaderData.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {loaderData.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {loaderData.userType}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardRoute()} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </div>
        </div>
      </nav>

      <Toaster />
      <Outlet />
    </>
  );
}
