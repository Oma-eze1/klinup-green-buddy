import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { KlinUpLogo } from "@/components/icons/KlinUpLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Camera,
  Coins,
  Gift,
  LogOut,
  FileText,
  Package,
  Heart,
  TrendingUp,
  Users,
  Building2,
  Factory,
  Loader2,
} from "lucide-react";
import type { UserRole } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const userRole = (user?.user_metadata?.role as UserRole) || "user";
  const userName = user?.user_metadata?.full_name || "User";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !session) {
      navigate("/auth");
    }
  }, [loading, session, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <KlinUpLogo size="sm" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {userName}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-primary">{userName.split(" ")[0]}</span>!
          </h1>
          <p className="text-muted-foreground">
            {getRoleMessage(userRole)}
          </p>
        </div>

        {/* Role-based dashboard content */}
        {userRole === "user" && <UserDashboard />}
        {userRole === "wmc" && <WMCDashboard />}
        {userRole === "ngo" && <NGODashboard />}
        {userRole === "recycler" && <RecyclerDashboard />}
      </main>
    </div>
  );
};

const getRoleMessage = (role: UserRole): string => {
  switch (role) {
    case "wmc":
      return "Manage waste reports and keep the city clean.";
    case "ngo":
      return "View and request donated items from citizens.";
    case "recycler":
      return "Browse and purchase recyclable materials.";
    default:
      return "Report waste, sell recyclables, and donate items.";
  }
};

const UserDashboard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Report Waste",
      description: "Snap a photo or video of waste in your area",
      icon: Camera,
      color: "primary",
      href: "/report-waste",
    },
    {
      title: "Cash Out",
      description: "Sell your recyclables and earn cash",
      icon: Coins,
      color: "recycler",
      href: "/cash-out",
    },
    {
      title: "Gift Out",
      description: "Donate items you no longer need",
      icon: Gift,
      color: "ngo",
      href: "/gift-out",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Card
            key={action.title}
            variant="interactive"
            className="cursor-pointer"
            onClick={() => navigate(action.href)}
          >
            <CardContent className="p-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                action.color === "primary" ? "bg-primary/10 text-primary" :
                action.color === "recycler" ? "bg-role-recycler/10 text-role-recycler" :
                "bg-role-ngo/10 text-role-ngo"
              }`}>
                <action.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
              <p className="text-muted-foreground text-sm">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Impact
          </CardTitle>
          <CardDescription>Track your contributions to a cleaner environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="text-sm text-muted-foreground">Reports</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-3xl font-bold text-role-recycler">₦0</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-3xl font-bold text-role-ngo">0</p>
              <p className="text-sm text-muted-foreground">Items Donated</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WMCDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard icon={FileText} title="New Reports" value="0" color="wmc" />
        <StatCard icon={Package} title="In Progress" value="0" color="primary" />
        <StatCard icon={TrendingUp} title="Resolved" value="0" color="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-role-wmc" />
            Recent Waste Reports
          </CardTitle>
          <CardDescription>Review and manage incoming waste reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No waste reports yet</p>
            <p className="text-sm">New reports will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NGODashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard icon={Gift} title="Available Items" value="0" color="ngo" />
        <StatCard icon={Heart} title="Requested" value="0" color="primary" />
        <StatCard icon={Package} title="Received" value="0" color="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-role-ngo" />
            Available Donations
          </CardTitle>
          <CardDescription>Browse items available for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No items available yet</p>
            <p className="text-sm">Donated items will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RecyclerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard icon={Package} title="Available" value="0" color="recycler" />
        <StatCard icon={Coins} title="Pending" value="0" color="primary" />
        <StatCard icon={TrendingUp} title="Purchased" value="0" color="accent" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-role-recycler" />
            Recyclables Marketplace
          </CardTitle>
          <CardDescription>Browse and purchase recyclable materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recyclables listed yet</p>
            <p className="text-sm">Available materials will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: "primary" | "wmc" | "ngo" | "recycler" | "accent";
}

const StatCard = ({ icon: Icon, title, value, color }: StatCardProps) => {
  const colorClasses = {
    primary: "text-primary",
    wmc: "text-role-wmc",
    ngo: "text-role-ngo",
    recycler: "text-role-recycler",
    accent: "text-accent",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-secondary ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
