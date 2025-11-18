import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/FeatureCard";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Brain,
  Users,
  Cog,
  CreditCard,
  FileText,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto text-center animate-fade-in">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              IMPEARL
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              One platform for businesses, freelancers, and providers
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Capture your needs with AI intake, match with vetted automation talent, negotiate contracts,
              and pay through secure Stripe escrow—all without leaving IMPEARL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
            <FeatureCard
              icon={Brain}
              title="AI Intake & Matching"
              description="Guided Q&A feeds our recommendation engine so businesses see the best talent, providers, and tooling instantly."
            />
            <FeatureCard
              icon={FileText}
              title="Contracts & Engagements"
              description="Send proposals, counter offers, and track deal stages with built-in dashboards for every role."
            />
            <FeatureCard
              icon={CreditCard}
              title="Stripe Escrow Payments"
              description="Businesses fund engagements via Stripe Checkout; payouts stay in escrow until work is approved."
            />
          </div>
        </div>
      </section>

      {/* Role Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Built for every role</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Businesses get automation clarity, freelancers get qualified leads, and service providers showcase packaged offerings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Users}
              title="Businesses"
              description="Create detailed profiles, run intake sessions, bookmark talent, and release funds when deliverables land."
            />
            <FeatureCard
              icon={Cog}
              title="Freelancers"
              description="Collect reviews, manage proposals, and discovery outreach with Stripe Connect payouts enforced."
            />
            <FeatureCard
              icon={Star}
              title="Service Providers"
              description="Highlight offerings, case studies, and support channels while syncing outreach and marketplace listings."
            />
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Everything You Need to Automate & Scale
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            From AI-powered recommendations to payment processing, we've got all the tools you need.
          </p>
          <Button variant="default" size="lg" asChild>
            <Link to="/features">
              Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            IMPEARL
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering businesses with AI-driven automation and expert connections
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
