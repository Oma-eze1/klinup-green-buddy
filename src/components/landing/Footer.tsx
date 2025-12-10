import { KlinUpLogo } from "@/components/icons/KlinUpLogo";
import { TranslatableText } from "@/components/TranslatableText";

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <KlinUpLogo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KlinUp. <TranslatableText>Building cleaner cities together.</TranslatableText>
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <TranslatableText>Privacy</TranslatableText>
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <TranslatableText>Terms</TranslatableText>
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              <TranslatableText>Contact</TranslatableText>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
