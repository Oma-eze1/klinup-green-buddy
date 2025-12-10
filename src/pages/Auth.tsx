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
import { Users, Building2, Heart, Factory, ArrowLeft, Loader2, Upload, X } from "lucide-react";
import type { UserRole } from "@/types";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

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
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setCertificateFile(file);
      setCertificatePreview(URL.createObjectURL(file));
    }
  };

  const removeCertificate = () => {
    setCertificateFile(null);
    setCertificatePreview(null);
  };

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);

    try {
      const metadata: Record<string, string> = {
        full_name: fullName,
        phone,
        role: selectedRole,
      };

      if (selectedRole === "wmc") {
        metadata.company_name = companyName;
        metadata.address = address;
        metadata.registration_number = registrationNumber;
      } else if (selectedRole === "ngo") {
        metadata.organization_name = organizationName;
        metadata.registration_number = registrationNumber;
      } else if (selectedRole === "recycler") {
        metadata.business_name = businessName;
        metadata.material_type = materialType;
        metadata.address = address;
        metadata.registration_number = registrationNumber;
      } else if (selectedRole === "user") {
        metadata.address = address;
      }

      // Sign up the user first
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: metadata,
        },
      });

      if (error) throw error;

      // Upload certificate if provided and user was created
      if (certificateFile && signUpData.user) {
        const fileExt = certificateFile.name.split('.').pop();
        const filePath = `${signUpData.user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(filePath, certificateFile);

        if (uploadError) {
          console.error("Certificate upload error:", uploadError);
          toast.warning("Account created but certificate upload failed. You can upload it later.");
        } else {
          // Update profile with certificate URL
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ certificate_url: filePath })
            .eq('user_id', signUpData.user.id);

          if (updateError) {
            console.error("Profile update error:", updateError);
          }
        }
      }

      toast.success("Account created! Please check your email to verify.");
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
                  />
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
                  />
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 xxx xxx xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
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
                          <Label htmlFor="registrationNumber">Business Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="RC-XXXXXXXX"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certificate">Certificate Picture</Label>
                          {certificatePreview ? (
                            <div className="relative">
                              <img
                                src={certificatePreview}
                                alt="Certificate preview"
                                className="w-full h-32 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={removeCertificate}
                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="certificateUpload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                            >
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Click to upload certificate</span>
                              <span className="text-xs text-muted-foreground">(Max 5MB, JPG/PNG/PDF)</span>
                              <input
                                id="certificateUpload"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={handleCertificateChange}
                              />
                            </label>
                          )}
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
                      <>
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
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Business Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="RC-XXXXXXXX"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certificate">Certificate Picture</Label>
                          {certificatePreview ? (
                            <div className="relative">
                              <img
                                src={certificatePreview}
                                alt="Certificate preview"
                                className="w-full h-32 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={removeCertificate}
                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="certificateUploadNgo"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                            >
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Click to upload certificate</span>
                              <span className="text-xs text-muted-foreground">(Max 5MB, JPG/PNG/PDF)</span>
                              <input
                                id="certificateUploadNgo"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={handleCertificateChange}
                              />
                            </label>
                          )}
                        </div>
                      </>
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
                          <Label htmlFor="registrationNumber">Business Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="RC-XXXXXXXX"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certificate">Certificate Picture</Label>
                          {certificatePreview ? (
                            <div className="relative">
                              <img
                                src={certificatePreview}
                                alt="Certificate preview"
                                className="w-full h-32 object-cover rounded-lg border border-border"
                              />
                              <button
                                type="button"
                                onClick={removeCertificate}
                                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="certificateUploadRecycler"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                            >
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">Click to upload certificate</span>
                              <span className="text-xs text-muted-foreground">(Max 5MB, JPG/PNG/PDF)</span>
                              <input
                                id="certificateUploadRecycler"
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={handleCertificateChange}
                              />
                            </label>
                          )}
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
