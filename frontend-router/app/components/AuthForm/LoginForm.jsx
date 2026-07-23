import { useNavigate } from 'react-router';
import { toast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { API_BASE } from "~/config";

const LoginForm = ({ mode }) => {
  const navigate = useNavigate();

  const dashboardRoute =
    mode === 'customer' ? '/customers/dashboard' : '/vendors/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch(`${API_BASE}/api/${mode}s/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error('Login failed', data.detail || 'Invalid credentials');
        return;
      }

      toast.success('Login successful!');
      navigate(dashboardRoute, { replace: true });
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
