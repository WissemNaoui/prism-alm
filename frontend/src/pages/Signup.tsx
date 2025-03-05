import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { useAuthStore } from "../utils/auth";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      await signup(
        formData.name,
        formData.email,
        formData.institution,
        formData.password
      );
      // Redirect to dashboard after successful signup
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <Form className="mt-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <Form.Section>
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
            
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            
            <Input
              label="Institution"
              id="institution"
              name="institution"
              type="text"
              required
              value={formData.institution}
              onChange={handleChange}
            />
            
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Section>
          
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
