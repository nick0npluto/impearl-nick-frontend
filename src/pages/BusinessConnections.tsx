import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/services/api";
import { Loader2, Send } from "lucide-react";

interface BusinessRecommendation {
  id: string;
  businessName?: string;
  industry?: string;
  goals?: string;
  description?: string;
  websiteUrl?: string;
  reason?: string;
}

interface InterestItem {
  _id: string;
  note?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  business?: {
    id: string;
    name?: string;
    industry?: string;
    goals?: string;
  } | null;
}

const BusinessConnections = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<BusinessRecommendation[]>([]);
  const [interests, setInterests] = useState<InterestItem[]>([]);
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recoRes, interestRes] = await Promise.all([
        ApiService.getRecommendedBusinesses().catch(() => ({ recommendations: [] })),
        ApiService.getSentInterests().catch(() => ({ interests: [] })),
      ]);
      setRecommendations(recoRes?.recommendations || []);
      setInterests(interestRes?.interests || []);
    } catch (error: any) {
      toast({ title: "Unable to load opportunities", description: error.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const optimisticAdd = (business: BusinessRecommendation, note?: string) => {
    const optimistic: InterestItem = {
      _id: `temp-${business.id}-${Date.now()}`,
      note,
      status: "sent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      business: {
        id: business.id,
        name: business.businessName || business.id,
        industry: business.industry,
        goals: business.goals,
      },
    };
    setInterests((prev) => [optimistic, ...prev.filter((item) => !item._id?.startsWith("temp-"))]);
  };

  const handleSendInterest = async (business: BusinessRecommendation) => {
    const note = noteDraft[business.id];
    try {
      setSendingId(business.id);
      optimisticAdd(business, note);
      await ApiService.sendCollaborationRequest(business.id, note);
      toast({ title: "Interest sent" });
      setNoteDraft((prev) => ({ ...prev, [business.id]: "" }));
      await loadData();
    } catch (error: any) {
      toast({ title: "Unable to send", description: error.message || "Try again shortly.", variant: "destructive" });
      // remove optimistic entry on failure
      setInterests((prev) => prev.filter((item) => !item._id?.startsWith("temp-")));
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl space-y-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Business Opportunities</h1>
            <p className="text-muted-foreground">
              Discover businesses looking for automation expertise and keep tabs on the outreach you’ve already sent.
            </p>
          </div>

          {loading ? (
            <Card className="p-8 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading businesses...
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Suggested Businesses</h2>
                  <p className="text-sm text-muted-foreground">
                    Tailored to your skills, Stripe-ready freelancers only.
                  </p>
                </div>
                {recommendations.length === 0 ? (
                  <p className="text-muted-foreground text-sm">We don’t have any matches right now. Check back soon!</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((business) => (
                      <Card key={business.id} className="p-4 space-y-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-foreground">{business.businessName || business.id}</h3>
                            {business.industry && <Badge variant="outline">{business.industry}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{business.description || business.goals}</p>
                          {business.reason && (
                            <p className="text-xs text-primary mt-1">Why match: {business.reason}</p>
                          )}
                        </div>
                        <Textarea
                          placeholder="Add a short message (optional)"
                          value={noteDraft[business.id] || ""}
                          onChange={(e) => setNoteDraft((prev) => ({ ...prev, [business.id]: e.target.value }))}
                        />
                        <div className="flex justify-end">
                          <Button onClick={() => handleSendInterest(business)} disabled={sendingId === business.id}>
                            {sendingId === business.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" /> Send Interest
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Interests You’ve Sent</h2>
                  <p className="text-sm text-muted-foreground">Track outreach and follow up when they respond.</p>
                </div>
                {interests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No interests sent yet.</p>
                ) : (
                  <div className="space-y-3">
                    {interests.map((interest) => (
                      <Card key={interest._id} className="p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="text-lg font-semibold text-foreground">
                              {interest.business?.name || "Business"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {interest.business?.industry ? `${interest.business?.industry} • ` : ""}
                              Sent {interest.updatedAt ? new Date(interest.updatedAt).toLocaleDateString() : "recently"}
                            </p>
                          </div>
                          <Badge variant="secondary" className="capitalize">{interest.status}</Badge>
                        </div>
                        {interest.note && (
                          <p className="text-sm text-muted-foreground mt-2">Message: {interest.note}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BusinessConnections;
