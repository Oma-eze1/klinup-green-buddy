import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SmartKlinLogo } from "@/components/icons/SmartKlinLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Coins, Camera, X, Loader2, CheckCircle } from "lucide-react";
import { RECYCLABLE_PRICES, type Recyclable } from "@/types";

const CashOut = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Recyclable["category"] | "">("");
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const priceRange = category ? RECYCLABLE_PRICES[category] : null;
  const estimatedPrice = priceRange && weight 
    ? {
        min: priceRange.min * parseFloat(weight),
        max: priceRange.max * parseFloat(weight),
      }
    : null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !category || !weight) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // Simulate submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      toast.success("Recyclable listed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to list recyclable");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="container py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </header>

        <main className="flex-1 container flex items-center justify-center">
          <Card className="max-w-md w-full animate-slide-up text-center">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-role-recycler/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-role-recycler" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Listed Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your recyclable has been listed. Recyclers will contact you with offers soon.
              </p>
              {estimatedPrice && (
                <div className="p-4 rounded-xl bg-secondary/50 mb-6">
                  <p className="text-sm text-muted-foreground">Estimated earnings</p>
                  <p className="text-2xl font-bold text-role-recycler">
                    ₦{estimatedPrice.min.toLocaleString()} - ₦{estimatedPrice.max.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button onClick={() => {
                  setSubmitted(false);
                  setImageFile(null);
                  setImagePreview(null);
                  setCategory("");
                  setWeight("");
                }}>
                  List Another Item
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <SmartKlinLogo size="sm" />
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-8 max-w-lg mx-auto">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-role-recycler" />
              Cash Out
            </CardTitle>
            <CardDescription>
              List your recyclables and earn cash when a recycler buys them.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image upload */}
              <div className="space-y-2">
                <Label>Photo *</Label>
                
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-role-recycler hover:bg-role-recycler/5 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-role-recycler/10 flex items-center justify-center text-role-recycler mx-auto mb-4">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="font-medium mb-1">Click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Add a photo of your recyclable
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-secondary">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as Recyclable["category"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="e-waste">E-Waste</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Estimated Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g., 5.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              {/* Price estimate */}
              {estimatedPrice && (
                <div className="p-4 rounded-xl bg-role-recycler/5 border border-role-recycler/20">
                  <p className="text-sm text-muted-foreground mb-1">Estimated earnings</p>
                  <p className="text-2xl font-bold text-role-recycler">
                    ₦{estimatedPrice.min.toLocaleString()} - ₦{estimatedPrice.max.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Final price depends on recycler offer
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!imageFile || !category || !weight || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Listing...
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    List for Sale
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CashOut;
