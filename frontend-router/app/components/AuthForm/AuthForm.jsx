import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const AuthForm = ({ mode }) => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'customer' ? 'Customer' : 'Vendor'} Portal
          </CardTitle>
          <CardDescription>
            {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === 'login' ? (
            <LoginForm mode={mode} />
          ) : (
            <SignupForm mode={mode} />
          )}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {activeTab === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-primary font-medium hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
