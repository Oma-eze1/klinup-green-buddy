import { Newspaper, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const NewsLearn = () => {
  const articles: Omit<ArticleCardProps, never>[] = [
    {
      icon: <Newspaper className="w-6 h-6" />,
      category: "News",
      title: "New Recycling Guidelines for 2025",
      description: "Learn about the latest updates to recycling standards and how they affect your community.",
      color: "primary" as const,
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      category: "Learn",
      title: "Understanding Plastic Types",
      description: "A comprehensive guide to different plastic types and which ones can be recycled.",
      color: "wmc" as const,
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      category: "Tips",
      title: "5 Ways to Reduce Household Waste",
      description: "Simple everyday habits that can significantly reduce your environmental footprint.",
      color: "ngo" as const,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <Newspaper className="w-4 h-4 text-primary" />
            Stay Informed
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            News & <span className="text-primary">Learn</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest waste management news, tips, and educational 
            resources to help you make a bigger impact.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

interface ArticleCardProps {
  icon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  color: "primary" | "wmc" | "ngo" | "recycler";
}

const ArticleCard = ({ icon, category, title, description, color }: ArticleCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    wmc: "bg-role-wmc/10 text-role-wmc",
    ngo: "bg-role-ngo/10 text-role-ngo",
    recycler: "bg-role-recycler/10 text-role-recycler",
  };

  const badgeClasses = {
    primary: "bg-primary/10 text-primary",
    wmc: "bg-role-wmc/10 text-role-wmc",
    ngo: "bg-role-ngo/10 text-role-ngo",
    recycler: "bg-role-recycler/10 text-role-recycler",
  };

  return (
    <Card variant="interactive" className="group">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeClasses[color]}`}>
            {category}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};
