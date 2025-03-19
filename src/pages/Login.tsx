
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    // Simulate login - in a real app, this would be an API call
    setTimeout(() => {
      console.log("Login attempt with:", { email });
      // Mock successful login
      setIsLoading(false);
      // Redirect to home page
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full py-12 flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 sm:px-6 space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Login</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        
        <div className="glass-card rounded-xl p-6 sm:p-8 shadow-xl shadow-primary/5 border border-primary/10">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner mr-2" />
                  Logging in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
