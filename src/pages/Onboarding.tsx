import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SmartKlinLogo } from "@/components/icons/SmartKlinLogo";
import { Camera, Coins, Gift, Recycle, ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    icon: Camera,
    title: "Report Waste",
    description: "Snap photos of waste in your area and help keep your city clean",
    color: "primary",
  },
  {
    icon: Coins,
    title: "Earn Rewards",
    description: "Sell your recyclables and earn cash instantly",
    color: "recycler",
  },
  {
    icon: Gift,
    title: "Gift Items",
    description: "Donate reusable items to NGOs and help those in need",
    color: "ngo",
  },
  {
    icon: Recycle,
    title: "Save the Planet",
    description: "Track your impact and contribute to a cleaner environment",
    color: "primary",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/home");
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" };
      case "recycler":
        return { bg: "bg-role-recycler/10", text: "text-role-recycler", border: "border-role-recycler/20" };
      case "ngo":
        return { bg: "bg-role-ngo/10", text: "text-role-ngo", border: "border-role-ngo/20" };
      default:
        return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" };
    }
  };

  const slide = slides[currentSlide];
  const colors = getColorClasses(slide.color);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="container py-6 flex items-center justify-between">
        <SmartKlinLogo size="md" />
        <button
          onClick={() => navigate("/home")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 container flex flex-col items-center justify-center px-6 py-8">
        {/* Tagline */}
        <p className="text-muted-foreground text-center mb-12 animate-fade-in">
          Making cities cleaner, together
        </p>

        {/* Slide content */}
        <div className="w-full max-w-sm animate-fade-in" key={currentSlide}>
          {/* Icon */}
          <div className={`w-24 h-24 mx-auto rounded-3xl ${colors.bg} ${colors.border} border-2 flex items-center justify-center mb-8 transition-all duration-300`}>
            <slide.icon className={`w-12 h-12 ${colors.text}`} />
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {slide.title}
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-center text-lg mb-8">
            {slide.description}
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 w-full max-w-sm">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          )}
          <Button
            variant="hero"
            size="lg"
            onClick={nextSlide}
            className={currentSlide === 0 ? "w-full" : "flex-1"}
          >
            {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SmartKlin. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Onboarding;
