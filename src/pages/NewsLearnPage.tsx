import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Search, BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { articles, getArticleIcon, Article } from "@/data/articles";
import { KlinUpLogo } from "@/components/icons/KlinUpLogo";

const ARTICLES_PER_PAGE = 6;

const categoryFilters = [
  { label: "All", value: "all", color: "bg-muted text-muted-foreground" },
  { label: "News", value: "news", color: "bg-primary/10 text-primary" },
  { label: "Learn", value: "learn", color: "bg-wmc/10 text-wmc" },
  { label: "Tips", value: "tips", color: "bg-ngo/10 text-ngo" },
  { label: "Guides", value: "guides", color: "bg-recycler/10 text-recycler" },
];

const NewsLearnPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<(Omit<Article, "icon"> & { icon: React.ReactNode }) | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || article.categoryType === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  
  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleArticleClick = (article: Omit<Article, "icon">) => {
    setSelectedArticle({
      ...article,
      icon: getArticleIcon(article.categoryType),
    });
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return { bg: "bg-primary/10", text: "text-primary", badge: "bg-primary/20 text-primary" };
      case "wmc":
        return { bg: "bg-wmc/10", text: "text-wmc", badge: "bg-wmc/20 text-wmc" };
      case "ngo":
        return { bg: "bg-ngo/10", text: "text-ngo", badge: "bg-ngo/20 text-ngo" };
      case "recycler":
        return { bg: "bg-recycler/10", text: "text-recycler", badge: "bg-recycler/20 text-recycler" };
      default:
        return { bg: "bg-primary/10", text: "text-primary", badge: "bg-primary/20 text-primary" };
    }
  };

  return (
    <>
      <Helmet>
        <title>News & Learn - KlinUp | Waste Management Insights</title>
        <meta
          name="description"
          content="Stay updated with the latest news, tips, and educational content about waste management and recycling."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <Link to="/">
              <KlinUpLogo className="h-8" />
            </Link>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              News & <span className="eco-text-gradient">Learn</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and educational content about waste management and sustainable living.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={selectedCategory === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(filter.value)}
                  className={selectedCategory === filter.value ? "" : filter.color}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-center text-muted-foreground mb-6">
            Showing {paginatedArticles.length} of {filteredArticles.length} articles
          </p>

          {/* Articles Grid */}
          {paginatedArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedArticles.map((article) => {
                const colors = getColorClasses(article.color);
                return (
                  <Card
                    key={article.id}
                    variant="interactive"
                    className="group cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <span className={colors.text}>{getArticleIcon(article.categoryType)}</span>
                      </div>
                      <Badge className={`${colors.badge} mb-3`}>{article.category}</Badge>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{article.description}</p>
                      <p className="text-primary text-sm font-medium mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more →
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>

      {/* Article Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedArticle && (
                <div className={`w-10 h-10 rounded-lg ${getColorClasses(selectedArticle.color).bg} flex items-center justify-center`}>
                  <span className={getColorClasses(selectedArticle.color).text}>
                    {selectedArticle.icon}
                  </span>
                </div>
              )}
              <Badge className={selectedArticle ? getColorClasses(selectedArticle.color).badge : ""}>
                {selectedArticle?.category}
              </Badge>
            </div>
            <DialogTitle className="text-xl">{selectedArticle?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedArticle?.fullContent.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {selectedArticle?.relatedMaterials && selectedArticle.relatedMaterials.length > 0 && (
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

export default NewsLearnPage;
