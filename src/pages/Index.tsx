import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>KlinUp - Report Waste, Earn Rewards, Save the Planet</title>
        <meta
          name="description"
          content="KlinUp empowers citizens to report waste incidents, sell recyclables for cash, and donate reusable items. Join the movement for a cleaner environment."
        />
      </Helmet>
      <main className="min-h-screen bg-background">
        <Hero />
        <HowItWorks />
        <Footer />
      </main>
    </>
  );
};

export default Index;
