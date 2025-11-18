import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star, DollarSign, Clock, Trash2, Building2 } from "lucide-react";
import ApiService from "@/services/api";

interface Freelancer {
  _id: string;
  email: string;
  freelancerProfile: {
    name: string;
    expertise: string;
    yearsExperience: string;
    bio: string;
    hourlyRate?: number;
    availability: string;
    rating: number;
    reviewCount: number;
    profilePicture?: string;
  };
}

interface Provider {
  _id: string;
  email: string;
  serviceProviderProfile: {
    companyName: string;
    description: string;
    industryFocus?: string[];
    ratingAvg?: number;
    ratingCount?: number;
    websiteUrl?: string;
  };
}

const Bookmarks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"freelancers" | "providers">("freelancers");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [freelancerIds, setFreelancerIds] = useState<string[]>([]);
  const [providerIds, setProviderIds] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [freelancerRes, providerRes] = await Promise.all([
          ApiService.getFreelancers().catch(() => ({ success: false, freelancers: [] })),
          ApiService.getServiceProviders().catch(() => ({ success: false, providers: [] })),
        ]);
        const savedFreelancers = ApiService.getFavoritesFromStorage();
        const savedProviders = ApiService.getProviderBookmarks();
        setFreelancerIds(savedFreelancers);
        setProviderIds(savedProviders);
        if (freelancerRes.success) {
          setFreelancers((freelancerRes.freelancers || []).filter((f: Freelancer) => savedFreelancers.includes(f._id)));
        }
        if (providerRes.success) {
          setProviders((providerRes.providers || []).filter((p: Provider) => savedProviders.includes(p._id)));
        }
      } catch (error: any) {
        toast({ title: "Error", description: error.message || "Unable to load bookmarks", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const clearFreelancers = () => {
    ApiService.clearAllFavorites();
    setFreelancerIds([]);
    setFreelancers([]);
    toast({ title: "Cleared", description: "All freelancer bookmarks removed." });
  };

  const clearProviders = () => {
    ApiService.clearProviderBookmarks();
    setProviderIds([]);
    setProviders([]);
    toast({ title: "Cleared", description: "All provider bookmarks removed." });
  };

  const removeFreelancer = (id: string) => {
    const updated = ApiService.removeFavorite(id);
    setFreelancerIds(updated);
    setFreelancers((prev) => prev.filter((f) => f._id !== id));
  };

  const removeProvider = (id: string) => {
    const updated = ApiService.removeProviderBookmark(id);
    setProviderIds(updated);
    setProviders((prev) => prev.filter((p) => p._id !== id));
  };

  const freelancerCount = freelancerIds.length;
  const providerCount = providerIds.length;

  const getInitials = (name?: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "IM";

  const experienceLabel = (value?: string) => {
    const map: Record<string, string> = {
      "0-1": "Entry Level",
      "1-3": "Intermediate",
      "3-5": "Experienced",
      "5-10": "Expert",
      "10+": "Master",
    };
    return (value && map[value]) || value || "Flexible";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderFreelancers = () => {
    if (!freelancers.length) {
      return <p className="text-muted-foreground text-sm">No bookmarked freelancers yet.</p>;
    }

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{freelancers.length} saved freelancer{freelancers.length !== 1 ? "s" : ""}</p>
          <Button variant="outline" onClick={clearFreelancers} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> Clear All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <Card key={freelancer._id} className="p-6 relative hover:shadow-lg transition">
              <button
                className="absolute top-4 right-4 text-destructive"
                onClick={() => removeFreelancer(freelancer._id)}
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </button>
              <div className="flex flex-col items-center text-center mb-4">
                {freelancer.freelancerProfile.profilePicture ? (
                  <img
                    src={freelancer.freelancerProfile.profilePicture}
                    alt={freelancer.freelancerProfile.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold text-primary border-4 border-primary/20">
                    {getInitials(freelancer.freelancerProfile.name)}
                  </div>
                )}
                <h3 className="text-lg font-semibold mt-3 text-foreground">
                  {freelancer.freelancerProfile.name}
                </h3>
                <p className="text-sm text-muted-foreground">{freelancer.freelancerProfile.expertise}</p>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {freelancer.freelancerProfile.rating.toFixed(1)} ({freelancer.freelancerProfile.reviewCount} reviews)
                </div>
                {freelancer.freelancerProfile.hourlyRate && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                    ${freelancer.freelancerProfile.hourlyRate}/hr
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  {experienceLabel(freelancer.freelancerProfile.yearsExperience)}
                </div>
              </div>
              <Button className="w-full mt-4" variant="secondary" onClick={() => navigate(`/freelancer/${freelancer._id}`)}>
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </>
    );
  };

  const renderProviders = () => {
    if (!providers.length) {
      return <p className="text-muted-foreground text-sm">No bookmarked service providers yet.</p>;
    }

    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{providers.length} saved provider{providers.length !== 1 ? "s" : ""}</p>
          <Button variant="outline" onClick={clearProviders} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" /> Clear All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <Card key={provider._id} className="p-6 relative hover:shadow-lg transition">
              <button
                className="absolute top-4 right-4 text-destructive"
                onClick={() => removeProvider(provider._id)}
              >
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {provider.serviceProviderProfile.companyName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {provider.serviceProviderProfile.websiteUrl || provider.email}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {provider.serviceProviderProfile.description || "No description provided."}
              </p>
              <div className="flex flex-wrap gap-2">
                {(provider.serviceProviderProfile.industryFocus || []).slice(0, 3).map((focus) => (
                  <Badge key={focus} variant="secondary">
                    {focus}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-4" variant="secondary" onClick={() => navigate("/engagements", { state: { highlightProvider: provider._id } })}>
                Invite to Project
              </Button>
            </Card>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Heart className="h-10 w-10 text-primary fill-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Bookmarks</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Keep track of your favorite freelancers and service providers in one place.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(value: "freelancers" | "providers") => setActiveTab(value)}>
            <TabsList className="mb-6">
              <TabsTrigger value="freelancers">
                Freelancers {freelancerCount ? `(${freelancerCount})` : ""}
              </TabsTrigger>
              <TabsTrigger value="providers">
                Service Providers {providerCount ? `(${providerCount})` : ""}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="freelancers">{renderFreelancers()}</TabsContent>
            <TabsContent value="providers">{renderProviders()}</TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Bookmarks;
