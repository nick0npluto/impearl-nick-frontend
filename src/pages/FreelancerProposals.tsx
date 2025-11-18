import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ApiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Engagement {
  _id: string;
  title: string;
  description?: string;
  status: string;
  latestOffer?: { price?: number; terms?: string };
  updatedAt?: string;
  fromBusiness?: { businessName?: string };
}

const FreelancerProposals = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [engagements, setEngagements] = useState<Engagement[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getEngagements();
        setEngagements(response.engagements || []);
      } catch (error: any) {
        toast({ title: "Unable to load proposals", description: error.message || "Try again shortly.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const proposals = engagements.filter((eng) => eng.status === "pending" || eng.status === "countered");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Proposals</h1>
            <p className="text-muted-foreground">Every engagement request and counter offer that still needs attention.</p>
          </div>

          {loading ? (
            <Card className="p-8 flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading proposals...</Card>
          ) : proposals.length === 0 ? (
            <Card className="p-8 text-muted-foreground">No pending proposals. Head to the marketplace to find new opportunities.</Card>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card key={proposal._id} className="p-6 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-foreground">{proposal.title}</h3>
                    <Badge variant={proposal.status === "countered" ? "secondary" : "default"}>{proposal.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    From: {proposal.fromBusiness?.businessName || "Business"} • Last updated{" "}
                    {proposal.updatedAt ? new Date(proposal.updatedAt).toLocaleDateString() : "recently"}
                  </p>
                  <p className="text-sm text-muted-foreground">{proposal.description || "No description provided."}</p>
                  {proposal.latestOffer?.price && (
                    <p className="text-sm text-muted-foreground">Latest offer: ${proposal.latestOffer.price.toLocaleString()}</p>
                  )}
                  <div className="pt-3">
                    <Button variant="outline" asChild>
                      <Link to="/engagements">Review in Engagements</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FreelancerProposals;
