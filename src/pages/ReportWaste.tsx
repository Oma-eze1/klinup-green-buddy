import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { KlinUpLogo } from "@/components/icons/KlinUpLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Camera, Video, MapPin, Upload, X, Loader2, CheckCircle } from "lucide-react";

const ReportWaste = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Request location on mount
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          toast.error("Could not get your location. Please enable location services.");
          setLocationLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setLocationLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      toast.error("Please select an image or video file");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setMediaFile(file);
    setMediaType(isVideo ? "video" : "photo");
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mediaFile) {
      toast.error("Please upload a photo or video");
      return;
    }

    if (!location) {
      toast.error("Location is required. Please enable location services.");
      return;
    }

    setSubmitting(true);

    try {
      // For now, simulate submission since we don't have the backend tables yet
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      toast.success("Waste report submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
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
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Report Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for helping keep your community clean. We'll review your report shortly.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => {
                  setSubmitted(false);
                  setMediaFile(null);
                  setMediaPreview(null);
                  setDescription("");
                }}>
                  Submit Another Report
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
          <KlinUpLogo size="sm" />
          <div className="w-16" />
        </div>
      </header>

      <main className="container py-8 max-w-lg mx-auto">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Report Waste
            </CardTitle>
            <CardDescription>
              Upload a photo or video of the waste incident and we'll dispatch a cleanup crew.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media upload */}
              <div className="space-y-2">
                <Label>Photo or Video *</Label>
                
                {!mediaPreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-secondary/50 transition-all"
                  >
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Video className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="font-medium mb-1">Click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Photo or video (max 50MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-secondary">
                    {mediaType === "video" ? (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full max-h-64 object-contain"
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-full max-h-64 object-contain"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:opacity-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    location ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {locationLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    {location ? (
                      <>
                        <p className="font-medium text-sm">Location captured</p>
                        <p className="text-xs text-muted-foreground">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-sm">Getting location...</p>
                        <p className="text-xs text-muted-foreground">
                          Please enable location services
                        </p>
                      </>
                    )}
                  </div>
                  {!location && !locationLoading && (
                    <Button type="button" variant="outline" size="sm" onClick={getLocation}>
                      Retry
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the waste incident..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!mediaFile || !location || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Submit Report
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

export default ReportWaste;
