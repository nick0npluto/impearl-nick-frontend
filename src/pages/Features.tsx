import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";
import {
  User,
  MessageSquare,
  Store,
  CreditCard,
  FileText,
  Star,
  Bot,
  Bookmark,
  LifeBuoy,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: User,
      title: "Role-Based Onboarding",
      description:
        "Purpose-built flows for businesses, freelancers, and service providers with Stripe payout gating and detailed profiles.",
    },
    {
      icon: Bot,
      title: "AI Intake & Insights",
      description:
        "Guided Q&A captures company data and generates actionable automation insights, tool suggestions, and next steps.",
    },
    {
      icon: Store,
      title: "Smart Marketplace Matching",
      description:
        "Browse vetted talent and services, bookmark favorites, and let IMPEARL recommend the best fits for every project.",
    },
    {
      icon: FileText,
      title: "Engagements & Contracts",
      description:
        "Negotiate proposals, counter offers, and manage contract terms with built-in status tracking for both sides.",
    },
    {
      icon: CreditCard,
      title: "Stripe Escrow Payments",
      description:
        "Businesses pay via Stripe Checkout, funds stay in escrow, and releases/disputes/refunds are handled with Connect payouts.",
    },
    {
      icon: Bookmark,
      title: "Collaboration Interests",
      description:
        "Freelancers and providers can send outreach, track interested businesses, and manage their marketplace listings.",
    },
    {
      icon: MessageSquare,
      title: "Messaging & Notifications",
      description:
        "Centralized threads with push-style notifications keep everyone aligned on deliverables, changes, and approvals.",
    },
    {
      icon: Star,
      title: "Reviews & Reputation",
      description:
        "Collect ratings from engagements, respond to feedback, and showcase proof directly on talent profiles.",
    },
    {
      icon: LifeBuoy,
      title: "Support & Guidance",
      description:
        "Always-on AI assistant plus Calendly access to human support for contract help, onboarding, or growth questions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Powerful Features for Modern Business
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to discover, implement, and scale automation solutions for your
              business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
