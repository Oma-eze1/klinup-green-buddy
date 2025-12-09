import { Newspaper, BookOpen, Lightbulb, ArrowRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

interface ArticleCardProps {
  icon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  color: "primary" | "wmc" | "ngo" | "recycler";
  fullContent: string[];
  relatedMaterials: { title: string; content: string }[];
}

export const NewsLearn = () => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleCardProps | null>(null);

  const articles: ArticleCardProps[] = [
    {
      icon: <Newspaper className="w-6 h-6" />,
      category: "News",
      title: "New Recycling Guidelines for 2025",
      description: "Learn about the latest updates to recycling standards and how they affect your community.",
      color: "primary" as const,
      fullContent: [
        "The year 2025 brings significant changes to recycling guidelines across Nigeria and Africa. These updates aim to streamline waste management processes and increase recycling rates in urban and rural communities.",
        "Key changes include: mandatory separation of organic waste from recyclables, new labeling requirements for plastic containers, and expanded collection programs for electronic waste.",
        "Communities are encouraged to participate in local education programs to understand these changes. Waste Management Companies (WMCs) will provide collection bins and educational materials to households.",
        "The goal is to achieve a 40% reduction in landfill waste by the end of 2025 through improved recycling practices and community engagement."
      ],
      relatedMaterials: [
        { title: "Recycling Symbols Guide", content: "Learn to identify the 7 plastic recycling symbols and what each means for proper disposal. Symbol 1 (PET) and Symbol 2 (HDPE) are the most commonly recycled plastics." },
        { title: "Local Collection Schedule", content: "Find your local recycling collection days. Most areas have bi-weekly collections for recyclables and weekly collections for organic waste." },
        { title: "Contamination Prevention", content: "Keep recyclables clean and dry. Rinse food containers before recycling. One contaminated item can spoil an entire batch of recyclables." }
      ]
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      category: "Learn",
      title: "Understanding Plastic Types",
      description: "A comprehensive guide to different plastic types and which ones can be recycled.",
      color: "wmc" as const,
      fullContent: [
        "Plastics are categorized into 7 types, each with different properties and recycling capabilities. Understanding these types helps you make informed decisions about waste disposal.",
        "PET (Type 1): Found in water bottles and food containers. Highly recyclable and commonly collected. HDPE (Type 2): Used in milk jugs and detergent bottles. Also widely recycled.",
        "PVC (Type 3), LDPE (Type 4), and PP (Type 5) have varying recyclability depending on local facilities. PS (Type 6) and Other (Type 7) are generally harder to recycle.",
        "When in doubt, check with your local recycling center about which plastics they accept. Clean plastics before recycling to avoid contamination."
      ],
      relatedMaterials: [
        { title: "Plastic Identification Chart", content: "Type 1 (PET): Clear bottles, food packaging. Type 2 (HDPE): Colored bottles, containers. Type 3 (PVC): Pipes, vinyl. Type 4 (LDPE): Bags, squeeze bottles. Type 5 (PP): Caps, yogurt containers." },
        { title: "Ocean Plastic Crisis", content: "Over 8 million tons of plastic enter our oceans annually. By properly recycling, you help prevent marine pollution and protect wildlife." },
        { title: "Plastic Alternatives", content: "Consider switching to reusable bags, metal water bottles, and glass containers. These simple changes significantly reduce plastic consumption." }
      ]
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      category: "Tips",
      title: "5 Ways to Reduce Household Waste",
      description: "Simple everyday habits that can significantly reduce your environmental footprint.",
      color: "ngo" as const,
      fullContent: [
        "Reducing household waste starts with small, consistent changes in daily habits. Here are five effective strategies anyone can implement:",
        "1. Composting: Turn food scraps into nutrient-rich soil. Start with a small bin for vegetable peels, coffee grounds, and eggshells. This can reduce household waste by up to 30%.",
        "2. Smart Shopping: Buy in bulk, choose products with minimal packaging, and bring reusable bags. Plan meals to reduce food waste.",
        "3. Repair and Reuse: Before discarding items, consider if they can be repaired or repurposed. Donate usable items to NGOs through platforms like KlinUp.",
        "4. Digital Transition: Switch to e-bills, digital receipts, and online documents to reduce paper waste. 5. Proper Segregation: Separate recyclables from organic waste for efficient processing."
      ],
      relatedMaterials: [
        { title: "Home Composting 101", content: "Start with a small bin in your kitchen for scraps. Add brown materials (dry leaves, cardboard) and green materials (food scraps) in layers. Turn regularly for best results." },
        { title: "Zero Waste Kitchen", content: "Store food properly to extend freshness. Use clear containers to see what you have. Practice FIFO (First In, First Out) to reduce spoilage." },
        { title: "DIY Cleaning Products", content: "Make effective cleaners with vinegar, baking soda, and lemon. Reduces plastic bottle waste and chemical exposure in your home." }
      ]
    },
  ];

  return (
    <>
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
              <ArticleCard 
                key={index} 
                {...article} 
                onClick={() => setSelectedArticle(article)}
              />
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

      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedArticle && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  selectedArticle.color === "primary" ? "bg-primary/10 text-primary" :
                  selectedArticle.color === "wmc" ? "bg-role-wmc/10 text-role-wmc" :
                  selectedArticle.color === "ngo" ? "bg-role-ngo/10 text-role-ngo" :
                  "bg-role-recycler/10 text-role-recycler"
                }`}>
                  {selectedArticle.category}
                </span>
              )}
            </div>
            <DialogTitle className="text-xl font-bold">
              {selectedArticle?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {selectedArticle?.fullContent.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {selectedArticle?.relatedMaterials && (
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Related Materials
              </h3>
              <div className="space-y-4">
                {selectedArticle.relatedMaterials.map((material, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-2">{material.title}</h4>
                    <p className="text-muted-foreground text-sm">{material.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ArticleCardClickProps extends ArticleCardProps {
  onClick: () => void;
}

const ArticleCard = ({ icon, category, title, description, color, onClick }: ArticleCardClickProps) => {
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
    <Card 
      variant="interactive" 
      className="group cursor-pointer" 
      onClick={onClick}
    >
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
        <p className="text-primary text-sm mt-3 font-medium group-hover:underline">
          Read more →
        </p>
      </CardContent>
    </Card>
  );
};
