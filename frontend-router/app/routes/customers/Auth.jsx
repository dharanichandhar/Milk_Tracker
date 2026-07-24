import { useLoaderData, Navigate } from 'react-router';
import AuthForm from '@/components/AuthForm/AuthForm';
import { API_BASE_URL } from '~/config';

export async function clientLoader() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customers/me`, { credentials: 'include' });
    const data = await res.json();

    if (data.logged_in) {
      return { shouldRedirect: true, redirectTo: '/customers/dashboard' };
    }
  } catch (err) {
    console.error('Auth check failed', err);
  }

  return { shouldRedirect: false };
}

export default function CustomerAuth() {
  const loaderData = useLoaderData();

  if (loaderData.shouldRedirect) {
    return <Navigate to={loaderData.redirectTo} replace />;
  }

  return <AuthForm mode="customer" />;
}
