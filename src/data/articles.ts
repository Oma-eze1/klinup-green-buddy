import { Newspaper, BookOpen, Lightbulb, FileText } from "lucide-react";
import React from "react";

export interface Article {
  id: string;
  icon: React.ReactNode;
  category: string;
  categoryType: "news" | "learn" | "tips" | "guides";
  title: string;
  description: string;
  color: "primary" | "wmc" | "ngo" | "recycler";
  fullContent: string[];
  relatedMaterials: { title: string; content: string }[];
}

export const getArticleIcon = (categoryType: string) => {
  switch (categoryType) {
    case "news":
      return React.createElement(Newspaper, { className: "w-6 h-6" });
    case "learn":
      return React.createElement(BookOpen, { className: "w-6 h-6" });
    case "tips":
      return React.createElement(Lightbulb, { className: "w-6 h-6" });
    case "guides":
      return React.createElement(FileText, { className: "w-6 h-6" });
    default:
      return React.createElement(Newspaper, { className: "w-6 h-6" });
  }
};

export const articles: Omit<Article, "icon">[] = [
  // News Articles
  {
    id: "news-1",
    category: "News",
    categoryType: "news",
    title: "New Recycling Programs Launch Nationwide",
    description: "Government announces major expansion of recycling infrastructure across all states.",
    color: "primary",
    fullContent: [
      "The federal government has announced a landmark initiative to expand recycling infrastructure across all 36 states and the Federal Capital Territory. This comprehensive program aims to increase the national recycling rate from the current 12% to 40% by 2030.",
      "The program includes the establishment of 500 new recycling centers, partnerships with local governments, and incentive schemes for households and businesses that actively participate in waste separation and recycling.",
      "Key features of the program include mobile recycling units for rural areas, educational campaigns in schools, and tax incentives for companies that use recycled materials in their manufacturing processes."
    ],
    relatedMaterials: [
      { title: "Government Policy Document", content: "Full text of the National Recycling Enhancement Act 2024, outlining targets, funding allocation, and implementation timeline." },
      { title: "State-by-State Implementation Guide", content: "Detailed breakdown of how each state will implement the new recycling programs, including local contact information and collection schedules." },
      { title: "Business Incentives Overview", content: "Summary of tax breaks and grants available for businesses that invest in recycling infrastructure or use recycled materials." }
    ]
  },
  {
    id: "news-2",
    category: "News",
    categoryType: "news",
    title: "Plastic Waste Reduces by 30% in Major Cities",
    description: "Urban areas report significant decrease in plastic pollution following awareness campaigns.",
    color: "primary",
    fullContent: [
      "A comprehensive study by the Environmental Protection Agency reveals that plastic waste in major urban centers has decreased by 30% over the past year. This remarkable achievement is attributed to sustained awareness campaigns and policy interventions.",
      "Cities like Lagos, Abuja, and Port Harcourt have seen the most significant improvements, with residents increasingly adopting reusable alternatives to single-use plastics.",
      "The success has prompted calls for expanding these programs to smaller cities and rural areas, with environmental groups advocating for continued investment in public education."
    ],
    relatedMaterials: [
      { title: "EPA Full Report", content: "Complete statistical analysis of plastic waste reduction across 20 major cities, including methodology and data sources." },
      { title: "Best Practices from Lagos", content: "Case study of how Lagos achieved a 35% reduction through community engagement and enforcement." },
      { title: "Reusable Alternatives Guide", content: "Comprehensive list of eco-friendly alternatives to common single-use plastic items." }
    ]
  },
  {
    id: "news-3",
    category: "News",
    categoryType: "news",
    title: "Tech Companies Partner for E-Waste Solutions",
    description: "Major tech firms join forces to address growing electronic waste challenges.",
    color: "primary",
    fullContent: [
      "Leading technology companies have formed an unprecedented coalition to tackle the growing challenge of electronic waste. The partnership includes manufacturers, retailers, and recycling specialists.",
      "The initiative will establish e-waste collection points in 1,000 locations nationwide, offering consumers convenient drop-off options for old devices. Participants will receive credits toward future purchases.",
      "The program also includes a commitment to design more recyclable products and use recycled materials in new devices, creating a circular economy for electronics."
    ],
    relatedMaterials: [
      { title: "Coalition Member List", content: "Full list of participating companies and their specific commitments to the e-waste reduction initiative." },
      { title: "E-Waste Collection Locations", content: "Interactive map and directory of all e-waste collection points, including accepted items and operating hours." },
      { title: "Device Trade-In Guide", content: "Step-by-step instructions for trading in old electronics and maximizing credit value." }
    ]
  },
  // Learn Articles
  {
    id: "learn-1",
    category: "Learn",
    categoryType: "learn",
    title: "Understanding Waste Categories",
    description: "Learn how to properly sort different types of waste for effective recycling and disposal.",
    color: "wmc",
    fullContent: [
      "Proper waste sorting is the foundation of effective recycling. Understanding the different categories of waste helps ensure that recyclable materials actually get recycled, rather than ending up in landfills.",
      "The main categories include: Organic waste (food scraps, yard waste), Paper and cardboard, Plastics (check the recycling numbers 1-7), Glass, Metals (aluminum, steel), E-waste (electronics), and Hazardous waste (batteries, chemicals).",
      "Each category requires different handling and processing. By separating your waste at home, you make it possible for recycling facilities to process materials efficiently and recover valuable resources."
    ],
    relatedMaterials: [
      { title: "Recycling Symbols Guide", content: "Detailed explanation of recycling symbols (1-7) found on plastic products and what each number means for recyclability." },
      { title: "Home Sorting Setup", content: "Guide to setting up an efficient waste sorting system in your home, including recommended bin sizes and placement." },
      { title: "Common Sorting Mistakes", content: "List of frequently misplaced items and where they should actually go in your waste sorting system." }
    ]
  },
  {
    id: "learn-2",
    category: "Learn",
    categoryType: "learn",
    title: "The Science of Composting",
    description: "Discover how organic waste transforms into nutrient-rich soil for your garden.",
    color: "wmc",
    fullContent: [
      "Composting is nature's way of recycling organic matter. Through the action of microorganisms, fungi, and invertebrates, food scraps and yard waste break down into humus, a nutrient-rich material that improves soil health.",
      "The composting process requires four key elements: carbon-rich materials (browns like dry leaves), nitrogen-rich materials (greens like food scraps), moisture, and oxygen. The right balance creates optimal conditions for decomposition.",
      "A well-managed compost pile can transform kitchen and garden waste into usable compost in as little as 2-3 months. The resulting material can be used to enrich garden soil, reduce the need for chemical fertilizers, and improve plant health."
    ],
    relatedMaterials: [
      { title: "Composting Basics Guide", content: "Step-by-step instructions for starting your first compost pile, including what to include and what to avoid." },
      { title: "Troubleshooting Common Issues", content: "Solutions for common composting problems like odors, pests, and slow decomposition." },
      { title: "Using Finished Compost", content: "How to tell when compost is ready and best practices for applying it to gardens and houseplants." }
    ]
  },
  {
    id: "learn-3",
    category: "Learn",
    categoryType: "learn",
    title: "Circular Economy Principles",
    description: "Explore how the circular economy model aims to eliminate waste entirely.",
    color: "wmc",
    fullContent: [
      "The circular economy is an alternative to the traditional linear economy (take, make, dispose). It aims to keep resources in use for as long as possible, extract maximum value while in use, and recover and regenerate products at the end of their service life.",
      "Key principles include: designing out waste and pollution, keeping products and materials in use, and regenerating natural systems. This approach creates economic opportunities while reducing environmental impact.",
      "Businesses adopting circular economy principles are finding new revenue streams through product-as-a-service models, remanufacturing, and material recovery, while consumers benefit from more durable products and reduced costs."
    ],
    relatedMaterials: [
      { title: "Circular Economy Case Studies", content: "Real-world examples of companies successfully implementing circular economy principles and their results." },
      { title: "Consumer Guide to Circular Products", content: "How to identify and choose products designed for circularity, including certifications to look for." },
      { title: "Starting a Circular Business", content: "Framework for entrepreneurs looking to build businesses based on circular economy principles." }
    ]
  },
  // Tips Articles
  {
    id: "tips-1",
    category: "Tips",
    categoryType: "tips",
    title: "Reduce Your Plastic Footprint",
    description: "Simple changes you can make today to significantly cut down on plastic waste.",
    color: "ngo",
    fullContent: [
      "Reducing plastic consumption doesn't require major lifestyle changes. Small, consistent actions can add up to significant impact. Start by identifying the single-use plastics you use most frequently and find reusable alternatives.",
      "Key strategies include: carrying reusable shopping bags, using a refillable water bottle, choosing products with minimal packaging, buying in bulk when possible, and avoiding single-use cutlery and straws.",
      "When plastic is unavoidable, choose recyclable options (look for numbers 1 and 2) and ensure they're properly recycled. Remember that refusing unnecessary plastic is always better than recycling."
    ],
    relatedMaterials: [
      { title: "Plastic-Free Shopping Guide", content: "Store-by-store guide to finding package-free and low-plastic options for common household items." },
      { title: "Reusable Product Reviews", content: "Ratings and reviews of popular reusable alternatives to single-use plastics, from bags to containers." },
      { title: "30-Day Plastic Reduction Challenge", content: "Daily challenges and tips to progressively reduce your plastic consumption over one month." }
    ]
  },
  {
    id: "tips-2",
    category: "Tips",
    categoryType: "tips",
    title: "Kitchen Waste Reduction Hacks",
    description: "Creative ways to minimize food waste and make the most of your ingredients.",
    color: "ngo",
    fullContent: [
      "Food waste is one of the largest contributors to landfill content. By making small changes in how we shop, store, and cook, we can dramatically reduce the amount of food that goes to waste.",
      "Planning is key: make a weekly meal plan, create shopping lists based on what you need, and check your pantry before buying. Store food properly to maximize freshness, and learn which fruits and vegetables should be kept separate.",
      "Get creative with leftovers: yesterday's vegetables can become today's soup or stir-fry. Use vegetable scraps to make stock, and learn to use every part of ingredients, from broccoli stems to citrus zest."
    ],
    relatedMaterials: [
      { title: "Food Storage Guide", content: "Comprehensive guide to storing different foods for maximum freshness, including fridge organization tips." },
      { title: "Leftover Recipe Collection", content: "Creative recipes designed specifically for using up common leftover ingredients." },
      { title: "Meal Planning Templates", content: "Downloadable weekly meal planning templates with integrated shopping lists." }
    ]
  },
  {
    id: "tips-3",
    category: "Tips",
    categoryType: "tips",
    title: "Sustainable Shopping Habits",
    description: "Make environmentally conscious choices every time you shop.",
    color: "ngo",
    fullContent: [
      "Every purchase is a vote for the kind of world we want. By making informed shopping choices, consumers can drive demand for sustainable products and practices.",
      "Look for products with eco-certifications, choose items with recyclable or minimal packaging, and support brands that demonstrate genuine commitment to sustainability. Consider the full lifecycle of products, including durability and end-of-life disposal.",
      "Local and second-hand shopping reduces transportation emissions and keeps products in use longer. When buying new, invest in quality items that will last rather than cheap goods that need frequent replacement."
    ],
    relatedMaterials: [
      { title: "Eco-Certification Guide", content: "Explanation of common sustainability certifications and what they actually guarantee." },
      { title: "Sustainable Brands Directory", content: "Curated list of brands with verified sustainable practices across different product categories." },
      { title: "Second-Hand Shopping Tips", content: "Where to find quality second-hand items and how to evaluate them before purchase." }
    ]
  },
  // Guides Articles
  {
    id: "guides-1",
    category: "Guides",
    categoryType: "guides",
    title: "Starting a Community Recycling Program",
    description: "Step-by-step guide to launching a recycling initiative in your neighborhood.",
    color: "recycler",
    fullContent: [
      "Community recycling programs can transform neighborhoods while building social connections. With proper planning and community engagement, you can create a sustainable initiative that benefits everyone.",
      "Start by assessing your community's needs and existing infrastructure. Identify potential partners (local government, businesses, schools) and recruit dedicated volunteers. Choose a realistic starting point, whether it's a single material type or a comprehensive program.",
      "Success depends on clear communication, convenient collection points, and consistent education. Track your progress, celebrate milestones, and continuously improve based on feedback from participants."
    ],
    relatedMaterials: [
      { title: "Program Planning Checklist", content: "Comprehensive checklist covering all aspects of planning and launching a community recycling program." },
      { title: "Volunteer Recruitment Guide", content: "Strategies for finding and retaining volunteers for your recycling initiative." },
      { title: "Funding and Grants Directory", content: "List of available grants and funding sources for community environmental programs." }
    ]
  },
  {
    id: "guides-2",
    category: "Guides",
    categoryType: "guides",
    title: "Home Waste Audit Guide",
    description: "Learn how to analyze your household waste and identify reduction opportunities.",
    color: "recycler",
    fullContent: [
      "A home waste audit reveals exactly what you're throwing away and where you can make improvements. This eye-opening exercise helps prioritize your waste reduction efforts for maximum impact.",
      "Conduct your audit over a typical week. Sort your waste into categories (recyclables, compostables, landfill) and weigh each category. Document what you find, paying attention to items that appear frequently.",
      "Analyze your results to identify patterns. Which categories are largest? What single-use items appear most often? Use these insights to create a targeted action plan for reducing your household waste."
    ],
    relatedMaterials: [
      { title: "Waste Audit Worksheet", content: "Printable worksheet for recording and categorizing your household waste during a week-long audit." },
      { title: "Reduction Priority Matrix", content: "Framework for prioritizing which waste streams to address first based on volume and ease of change." },
      { title: "Progress Tracking Template", content: "Template for tracking waste reduction progress over time and celebrating improvements." }
    ]
  },
  {
    id: "guides-3",
    category: "Guides",
    categoryType: "guides",
    title: "Building a Zero-Waste Starter Kit",
    description: "Essential items and strategies for beginning your zero-waste journey.",
    color: "recycler",
    fullContent: [
      "Starting a zero-waste lifestyle can feel overwhelming, but the right tools make it much easier. A basic starter kit provides alternatives to the most common disposable items you encounter daily.",
      "Essential items include: reusable shopping bags, produce bags, water bottle, coffee cup, food containers, utensil set, cloth napkins, and beeswax wraps. Choose durable, quality items that will last for years.",
      "Remember that zero-waste is a journey, not a destination. Start with a few items and gradually expand as old habits change. Use what you already have before buying new, and don't aim for perfection immediately."
    ],
    relatedMaterials: [
      { title: "Starter Kit Shopping List", content: "Curated list of recommended zero-waste essentials with options at different price points." },
      { title: "DIY Alternatives", content: "Instructions for making your own reusable items from materials you already have at home." },
      { title: "90-Day Zero-Waste Plan", content: "Structured three-month program for gradually transitioning to a zero-waste lifestyle." }
    ]
  }
];
