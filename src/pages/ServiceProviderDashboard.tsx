import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DashboardCard from "@/components/DashboardCard";
import ChatInterface from "@/components/ChatInterface";
import PayoutStatusBanner from "@/components/PayoutStatusBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/services/api";
import {
  Building2,
  Rocket,
  Store,
  Briefcase,
  MessageSquare,
  Users,
  ClipboardList,
  HelpCircle,
  Loader2,
  Bell,
  CheckCircle2,
  ChartBarStacked,
} from "lucide-react";

interface Engagement {
  _id: string;
  title: string;
  status: string;
  fromBusiness?: { businessName?: string };
  updatedAt?: string;
}

interface ContractItem {
  _id: string;
  title: string;
  status: string;
  agreedPrice?: number;
}

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  read?: boolean;
  createdAt?: string;
}

const ServiceProviderDashboard = () => {
  const { toast } = useToast();
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [recommendedBusinesses, setRecommendedBusinesses] = useState<any[]>([]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoadingSummary(true);
        const [engagementRes, contractRes, notificationRes, profileRes, recoBusinesses] = await Promise.all([
          ApiService.getEngagements().catch(() => ({ engagements: [] })),
          ApiService.getContracts().catch(() => ({ contracts: [] })),
          ApiService.getNotifications().catch(() => ({ notifications: [] })),
          ApiService.getProfile().catch(() => null),
          ApiService.getRecommendedBusinesses().catch(() => ({ recommendations: [] })),
        ]);

        setEngagements(engagementRes?.engagements || []);
        setContracts(contractRes?.contracts || []);
        setNotifications(notificationRes?.notifications || []);
        setProfile(profileRes?.user || null);
        setRecommendedBusinesses(recoBusinesses?.recommendations || []);
      } catch (error: any) {
        toast({
          title: "Unable to load dashboard data",
          description: error.message || "Please try again shortly.",
          variant: "destructive",
        });
      } finally {
        setLoadingSummary(false);
      }
    };

    loadSummary();
  }, [toast]);

  const pendingEngagements = useMemo(
    () => engagements.filter((eng) => eng.status === "pending").length,
    [engagements]
  );
  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );
  const activeContracts = useMemo(
    () => contracts.filter((contract) => contract.status === "active").length,
    [contracts]
  );

  const providerProfile = profile?.serviceProviderProfile;
  const profileStats = {
    rating: providerProfile?.rating ?? 0,
    reviewCount: providerProfile?.reviewCount ?? 0,
  };
  const featuredOfferings = providerProfile?.offerings || [];

  const sendRequest = async (businessId: string) => {
    try {
      await ApiService.sendCollaborationRequest(businessId);
      toast({ title: "Request sent", description: "The business has been notified." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Unable to send request", variant: "destructive" });
    }
  };

const formatDate = (value?: string) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch (err) {
    return value;
  }
};

  const dashboardItems = [
    {
      icon: Building2,
      title: "Company Profile",
      description: "Polish your positioning & proof",
      link: "/profile",
    },
    {
      icon: ClipboardList,
      title: "Engagement Requests",
      description: "Review new proposals from businesses",
      link: "/engagements",
    },
    {
      icon: Users,
      title: "My Proposals",
      description: "Track outreach you’ve sent",
      link: "/proposals",
    },
    {
      icon: Briefcase,
      title: "Active Projects",
      description: "Manage ongoing engagements",
      link: "/projects",
    },
    {
      icon: Store,
      title: "Business Opportunities",
      description: "Browse companies & send interest",
      link: "/businesses",
    },
    {
      icon: Rocket,
      title: "Marketplace Listing",
      description: "Publish or edit your offerings",
      link: "/listings",
    },
    {
      icon: MessageSquare,
      title: "Messages",
      description: "Chat with clients on active contracts",
      link: "/messages",
    },
    {
      icon: Users,
      title: "Reviews & Ratings",
      description: "See feedback and respond",
      link: "/reviews",
    },
    {
      icon: HelpCircle,
      title: "Support",
      description: "Reach out to IMPEARL support",
      link: "/support",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Service Provider Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your offerings, respond to opportunities, and grow with IMPEARL businesses
            </p>
          </div>

          <PayoutStatusBanner
            initialStatus={{
              payoutsEnabled: profile?.serviceProviderProfile?.payoutsEnabled,
              stripeStatus: profile?.serviceProviderProfile?.stripeStatus,
            }}
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12 animate-slide-up">
            {[
              {
                title: "Pending Requests",
                value: pendingEngagements.toString(),
                description: "Businesses awaiting your reply",
                href: "/engagements",
                action: "Review",
              },
              {
                title: "Active Contracts",
                value: activeContracts.toString(),
                description: "Deliverables in flight",
                href: "/projects",
                action: "Open",
              },
              {
                title: "Unread Alerts",
                value: unreadNotifications.toString(),
                description: "Notifications from clients",
                href: "/notifications",
                action: "Open",
              },
              {
                title: "Rating",
                value: loadingSummary ? "--" : profileStats.rating.toFixed(1),
                description: `${profileStats.reviewCount} review${profileStats.reviewCount === 1 ? "" : "s"}`,
                href: "/reviews",
                action: "See",
              },
            ].map((card) => (
              <Card key={card.title} className="p-6 flex flex-col justify-between shadow-card">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{loadingSummary ? "--" : card.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                </div>
                <Button asChild variant="secondary" size="sm" className="mt-4 w-fit">
                  <Link to={card.href}>{card.action}</Link>
                </Button>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Recent Engagement Requests</h3>
              </div>
              {loadingSummary ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading engagements...
                </div>
              ) : engagements.length === 0 ? (
                <p className="text-muted-foreground">No engagement requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {engagements.slice(0, 4).map((engagement) => (
                    <div key={engagement._id} className="flex items-start justify-between border-b border-border/60 pb-3">
                      <div>
                        <p className="font-semibold text-foreground">{engagement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {engagement.fromBusiness?.businessName || "Business"}
                        </p>
                        <p className="text-xs text-muted-foreground">Updated {formatDate(engagement.updatedAt)}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {engagement.status}
                      </Badge>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/engagements">View all engagements</Link>
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Latest Alerts</h3>
              </div>
              {loadingSummary ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-muted-foreground">No notifications yet.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.slice(0, 4).map((notification) => (
                    <div key={notification._id} className="border-b border-border/60 pb-3">
                      <p className="font-semibold text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/notifications">Go to notifications</Link>
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {recommendedBusinesses.length ? (
            <Card className="p-6 mb-12">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Suggested Businesses</h3>
              </div>
              <div className="space-y-4">
                {recommendedBusinesses.map((business) => (
                  <div key={business.id} className="border-b border-border/60 pb-3">
                    <p className="font-semibold text-foreground">{business.businessName}</p>
                    <p className="text-sm text-muted-foreground">Industry: {business.industry || "General"}</p>
                    <p className="text-xs text-muted-foreground">
                      Needs: {business.requiredSkills || business.goals || "Automation support"}
                    </p>
                    {business.reason && (
                      <p className="text-xs text-muted-foreground mt-1">{business.reason}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button variant="secondary" size="sm" onClick={() => sendRequest(business.id)}>
                        Send Request
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/businesses">View all</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ChartBarStacked className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Active Contracts</h3>
              </div>
              {loadingSummary ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading contracts...
                </div>
              ) : contracts.length === 0 ? (
                <p className="text-muted-foreground">No active contracts yet.</p>
              ) : (
                <div className="space-y-4">
                  {contracts.slice(0, 4).map((contract) => (
                    <div key={contract._id} className="flex items-start justify-between border-b border-border/60 pb-3">
                      <div>
                        <p className="font-semibold text-foreground">{contract.title}</p>
                        <p className="text-sm text-muted-foreground">{contract.status}</p>
                      </div>
                      <Badge variant="outline">
                        {contract.agreedPrice ? `$${contract.agreedPrice.toLocaleString()}` : "Custom"}
                      </Badge>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/engagements">Manage contracts</Link>
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Profile Snapshot</h3>
              </div>
              {providerProfile ? (
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Company:</span> {providerProfile.companyName}</p>
                  <p><span className="font-semibold text-foreground">Headline:</span> {providerProfile.headline || "Not set"}</p>
                  <p><span className="font-semibold text-foreground">Value prop:</span> {providerProfile.valueProposition || "Not set"}</p>
                  <p><span className="font-semibold text-foreground">Industries:</span> {(providerProfile.industryFocus || []).join(", ") || "Not set"}</p>
                  <p><span className="font-semibold text-foreground">Support:</span> {(providerProfile.supportChannels || []).join(", ") || "Not set"}</p>
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/profile">Edit profile</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  {loadingSummary ? (
                    <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading profile...</div>
                  ) : (
                    <>
                      <p>Complete your service provider profile so businesses can find you.</p>
                      <Button asChild variant="secondary" size="sm" className="mt-3">
                        <Link to="/profile">Complete profile</Link>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Store className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Featured Offerings</h3>
              </div>
              {featuredOfferings.length ? (
                <div className="space-y-3">
                  {featuredOfferings.slice(0, 3).map((offering, idx) => (
                    <div key={`${offering.name}-${idx}`} className="border border-border/60 rounded-md p-3">
                      <p className="font-semibold text-foreground">{offering.name}</p>
                      <p className="text-sm text-muted-foreground">{offering.promise || "Outcome not provided"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {offering.priceRange && `Price: ${offering.priceRange}`}{" "}
                        {offering.timeline && `• Timeline: ${offering.timeline}`}
                      </p>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/profile">Update offerings</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Add at least one offering so businesses can quickly understand your packages.
                  <Button asChild variant="secondary" size="sm" className="mt-3">
                    <Link to="/profile">Add offering</Link>
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-slide-up">
            {dashboardItems.map((item, index) => (
              <DashboardCard
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                link={item.link}
              />
            ))}
          </div>

          <div className="animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
              Chat with IMPEARL AI
            </h2>
            <ChatInterface
              context={{
                role: "service_provider",
                companyName: providerProfile?.companyName,
                headline: providerProfile?.headline,
                industryFocus: providerProfile?.industryFocus,
                keyOfferings: (providerProfile?.offerings || []).map((offering: any) => offering.name),
                suggestedBusinesses: recommendedBusinesses.map((biz: any) => biz.businessName),
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceProviderDashboard;
