import { useNavigate } from 'react-router';
import { toast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE } from "~/config";

const SignupForm = ({ mode }) => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const image = formData.get('image');

    try {
      if (mode === 'vendor' && !image.name) {
        toast.error('Image is required for vendor signup');
        return;
      }

      let response;

      if (mode === 'customer') {
        response = await fetch(`${API_BASE}/api/${mode}s/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password }),
        });
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append('name', name);
        formDataToSend.append('email', email);
        formDataToSend.append('password', password);
        formDataToSend.append('image', image);

        response = await fetch(`${API_BASE}/api/${mode}s/create`, {
          method: 'POST',
          credentials: 'include',
          body: formDataToSend,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error('Signup failed', data.detail || 'Please try again');
        return;
      }

      toast.success('Signup successful!');
      navigate(`/${mode}s/dashboard`, { replace: true });
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Create a password"
          required
        />
      </div>

      {mode === 'vendor' && (
        <div className="space-y-2">
          <Label htmlFor="image">Profile Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full">
        Sign Up
      </Button>
    </form>
  );
};

export default SignupForm;
