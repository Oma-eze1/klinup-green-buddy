import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { NewsLearn } from "@/components/landing/NewsLearn";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SmartKlin - Report Waste, Earn Rewards, Save the Planet</title>
        <meta
          name="description"
          content="SmartKlin empowers citizens to report waste incidents, sell recyclables for cash, and donate reusable items. Join the movement for a cleaner environment."
        />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Hero />
        <HowItWorks />
        <NewsLearn />
        <Footer />
      </main>
    </>
  );
};

export default Index;
