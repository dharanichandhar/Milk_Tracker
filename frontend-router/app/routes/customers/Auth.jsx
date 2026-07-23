import { useLoaderData, Navigate } from 'react-router';
import AuthForm from '@/components/AuthForm/AuthForm';
import { API_BASE } from '~/config';

export async function clientLoader() {
  const res = await fetch(`${API_BASE}/api/customers/me`, { credentials: 'include' });
  const data = await res.json();

  if (data.logged_in) {
    return { shouldRedirect: true, redirectTo: '/customers/dashboard' };
  }

  return { shouldRedirect: false };
}

clientLoader.hydrate = true;

export default function CustomerAuth() {
  const loaderData = useLoaderData();

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  return <AuthForm mode="customer" />;
}
