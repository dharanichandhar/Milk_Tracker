import { Milk } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center px-4">
        <img 
          src="https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Fresh milk"
          className="w-64 h-64 object-cover rounded-full mx-auto mb-8 shadow-lg"
        />
        <div className="flex items-center justify-center gap-3 mb-4">
          <Milk className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Milk Tracker
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-md">
          Welcome to Milk Tracker - your simple solution for managing milk subscriptions and deliveries.
        </p>
      </div>
    </div>
  );
}
