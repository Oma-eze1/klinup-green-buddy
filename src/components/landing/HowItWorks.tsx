import { Users, Building2, Heart, Factory } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TranslatableText } from "@/components/TranslatableText";

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <TranslatableText>One Platform,</TranslatableText>{" "}
            <span className="text-primary"><TranslatableText>Four Roles</TranslatableText></span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <TranslatableText>
              KlinUp connects citizens, waste management companies, NGOs, and recyclers 
              to create a sustainable ecosystem for waste management.
            </TranslatableText>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RoleCard
            icon={<Users className="w-8 h-8" />}
            title="Citizens"
            description="Report waste incidents, sell recyclables, and donate items you no longer need"
            color="user"
          />
          <RoleCard
            icon={<Building2 className="w-8 h-8" />}
            title="WMC"
            description="Receive and manage waste reports, dispatch cleanup crews efficiently"
            color="wmc"
          />
          <RoleCard
            icon={<Heart className="w-8 h-8" />}
            title="NGOs"
            description="Receive donated items and distribute them to communities in need"
            color="ngo"
          />
          <RoleCard
            icon={<Factory className="w-8 h-8" />}
            title="Recyclers"
            description="Connect with citizens selling recyclables and grow your business"
            color="recycler"
          />
        </div>
      </div>
    </section>
  );
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "user" | "wmc" | "ngo" | "recycler";
}

const RoleCard = ({ icon, title, description, color }: RoleCardProps) => {
  const gradients = {
    user: "from-primary to-primary/70",
    wmc: "from-role-wmc to-role-wmc/70",
    ngo: "from-role-ngo to-role-ngo/70",
    recycler: "from-role-recycler to-role-recycler/70",
  };

  return (
    <Card variant="interactive" className="group overflow-hidden">
      <CardContent className="p-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-primary-foreground mb-5 bg-gradient-to-br ${gradients[color]} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          <TranslatableText>{title}</TranslatableText>
        </h3>
        <p className="text-muted-foreground text-sm">
          <TranslatableText>{description}</TranslatableText>
        </p>
      </CardContent>
    </Card>
  );
};
