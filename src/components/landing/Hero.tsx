import { Button } from "@/components/ui/button";
import { KlinUpLogo } from "@/components/icons/KlinUpLogo";
import { ArrowRight, Recycle, Camera, Gift, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <KlinUpLogo />
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button variant="hero" onClick={() => navigate("/auth?mode=signup")}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero content */}
      <div className="container pt-16 pb-24 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <Recycle className="w-4 h-4 text-primary" />
              Making cities cleaner, together
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Report Waste.{" "}
              <span className="text-primary">Earn Rewards.</span>{" "}
              Save the Planet.
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              KlinUp empowers citizens to report waste incidents, sell recyclables for cash, 
              and donate reusable items to those in need. Join the movement for a cleaner environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" variant="hero" onClick={() => navigate("/auth?mode=signup")}>
                Join KlinUp Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="xl" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <FeatureCard
              icon={<Camera className="w-6 h-6" />}
              title="Report Waste"
              description="Snap a photo or video of waste and help keep your city clean"
              color="primary"
            />
            <FeatureCard
              icon={<Coins className="w-6 h-6" />}
              title="Cash Out"
              description="Sell your recyclables and earn cash instantly"
              color="recycler"
              className="mt-8"
            />
            <FeatureCard
              icon={<Gift className="w-6 h-6" />}
              title="Gift Out"
              description="Donate reusable items to NGOs and help those in need"
              color="ngo"
            />
            <FeatureCard
              icon={<Recycle className="w-6 h-6" />}
              title="Track Impact"
              description="See how your actions contribute to a cleaner environment"
              color="wmc"
              className="mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "primary" | "wmc" | "ngo" | "recycler";
  className?: string;
}

const FeatureCard = ({ icon, title, description, color, className }: FeatureCardProps) => {
  const colorClasses = {
    primary: "border-primary/20 bg-primary/5",
    wmc: "border-role-wmc/20 bg-role-wmc/5",
    ngo: "border-role-ngo/20 bg-role-ngo/5",
    recycler: "border-role-recycler/20 bg-role-recycler/5",
  };

  const iconColors = {
    primary: "text-primary",
    wmc: "text-role-wmc",
    ngo: "text-role-ngo",
    recycler: "text-role-recycler",
  };

  return (
    <div
      className={`p-5 rounded-2xl border-2 ${colorClasses[color]} transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-card mb-4 ${iconColors[color]}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
