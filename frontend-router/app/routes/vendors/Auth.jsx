import { useLoaderData, Navigate } from 'react-router';
import AuthForm from '@/components/AuthForm/AuthForm';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vendors/me`, { credentials: 'include' });
    const data = await res.json();

    if (data.logged_in) {
      return { shouldRedirect: true, redirectTo: '/vendors/dashboard' };
    }
  } catch (err) {
    console.error('Auth check failed', err);
  }

  return { shouldRedirect: false };
}

clientLoader.hydrate = true;

export default function VendorAuth() {
  const loaderData = useLoaderData();

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  return <AuthForm mode="vendor" />;
}
