import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { KlinUpLogo } from "@/components/icons/KlinUpLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Heart, Factory, ArrowLeft, Loader2 } from "lucide-react";
import { loginSchema, signupSchema } from "@/lib/validations";
import type { UserRole } from "@/types";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Role-specific fields
  const [companyName, setCompanyName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [materialType, setMaterialType] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const clearErrors = () => setErrors({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) throw error;
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    const result = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
      fullName,
      phone,
      companyName: companyName || undefined,
      organizationName: organizationName || undefined,
      businessName: businessName || undefined,
      address: address || undefined,
      materialType: materialType || undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error(result.error.errors[0]?.message || "Please fix the form errors");
      return;
    }

    setIsLoading(true);

    try {
      const metadata: Record<string, string> = {
        full_name: result.data.fullName,
        phone: result.data.phone,
        role: selectedRole, // Note: Trigger sets all signups to 'user' role - admin approval needed for elevated roles
      };

      if (selectedRole === "wmc") {
        metadata.company_name = companyName;
        metadata.address = address;
      } else if (selectedRole === "ngo") {
        metadata.organization_name = organizationName;
      } else if (selectedRole === "recycler") {
        metadata.business_name = businessName;
        metadata.material_type = materialType;
        metadata.address = address;
      } else if (selectedRole === "user") {
        metadata.address = address;
      }

      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: metadata,
        },
      });

      if (error) throw error;
      
      // Inform user about role approval process
      if (selectedRole !== "user") {
        toast.success("Account created! Note: Your role will start as 'Citizen' until approved by an admin.");
      } else {
        toast.success("Account created! Please check your email to verify.");
      }
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Please sign in.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderError = (field: string) => {
    if (errors[field]) {
      return <p className="text-sm text-destructive mt-1">{errors[field]}</p>;
    }
    return null;
  };

  const roles = [
    { value: "user", label: "Citizen", icon: Users, description: "Report waste & earn rewards" },
    { value: "wmc", label: "Waste Management", icon: Building2, description: "Manage waste reports" },
    { value: "ngo", label: "NGO", icon: Heart, description: "Receive donated items" },
    { value: "recycler", label: "Recycler", icon: Factory, description: "Buy recyclables" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 container flex items-center justify-center py-8">
        <Card className="w-full max-w-lg animate-slide-up">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <KlinUpLogo />
            </div>
            <CardTitle className="text-2xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isSignup
                ? "Join KlinUp and start making a difference"
                : "Sign in to continue to KlinUp"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSignup && !selectedRole ? (
              // Role selection step
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Choose how you want to use KlinUp
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value as UserRole)}
                      className="p-4 rounded-xl border-2 border-border hover:border-primary bg-card hover:bg-secondary/50 transition-all text-left group"
                    >
                      <role.icon className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <p className="font-semibold">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Note: WMC, NGO, and Recycler roles require admin approval after signup.
                </p>
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Already have an account? <span className="text-primary font-medium">Sign in</span>
                  </button>
                </div>
              </div>
            ) : (
              // Form step
              <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
                {isSignup && selectedRole && (
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Change role
                  </button>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {renderError("email")}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {renderError("password")}
                </div>

                {isSignup && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {renderError("confirmPassword")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {renderError("fullName")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234xxxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {renderError("phone")}
                    </div>

                    {/* Role-specific fields */}
                    {selectedRole === "wmc" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            placeholder="Your waste management company"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Office Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main Street, City"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}

                    {selectedRole === "ngo" && (
                      <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          placeholder="Your NGO name"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    {selectedRole === "recycler" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            placeholder="Your recycling business"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="materialType">Material Types</Label>
                          <Select value={materialType} onValueChange={setMaterialType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select material type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="plastic">Plastic</SelectItem>
                              <SelectItem value="metal">Metal</SelectItem>
                              <SelectItem value="glass">Glass</SelectItem>
                              <SelectItem value="e-waste">E-Waste</SelectItem>
                              <SelectItem value="paper">Paper</SelectItem>
                              <SelectItem value="all">All Materials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Business Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main Street, City"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}

                    {selectedRole === "user" && (
                      <div className="space-y-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input
                          id="address"
                          placeholder="Your home address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isSignup ? "Creating account..." : "Signing in..."}
                    </>
                  ) : isSignup ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(!isSignup);
                      setSelectedRole(null);
                      clearErrors();
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {isSignup ? (
                      <>
                        Already have an account?{" "}
                        <span className="text-primary font-medium">Sign in</span>
                      </>
                    ) : (
                      <>
                        Don't have an account?{" "}
                        <span className="text-primary font-medium">Sign up</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Auth;
