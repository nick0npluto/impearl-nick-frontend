import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ContractItem {
  _id: string;
  title: string;
  description?: string;
  status: "active" | "completed";
  paymentStatus?: "unpaid" | "held" | "released" | "disputed" | "refunded";
  targetType: "freelancer" | "service_provider";
  targetFreelancer?: { name?: string };
  targetProvider?: { companyName?: string };
  createdAt?: string;
}

const Hires = () => {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<ContractItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getContracts();
        setContracts(response.contracts || []);
      } catch (error: any) {
        toast({
          title: "Unable to load hires",
          description: error.message || "Please try again shortly.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [toast]);

  const freelancerHires = useMemo(
    () => contracts.filter((c) => c.targetType === "freelancer"),
    [contracts]
  );
  const providerHires = useMemo(
    () => contracts.filter((c) => c.targetType === "service_provider"),
    [contracts]
  );

  const renderList = (items: ContractItem[], label: string) => {
    if (!items.length) {
      return (
        <Card className="p-6 text-center text-muted-foreground">
          No {label.toLowerCase()} yet. Once you sign contracts, they’ll appear here.
        </Card>
      );
    }
    return (
      <div className="grid gap-4">
        {items.map((contract) => (
          <Card key={contract._id} className="p-6 space-y-3 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold text-foreground">{contract.title}</h3>
                <Badge variant={contract.status === "completed" ? "secondary" : "default"}>{contract.status}</Badge>
                {contract.paymentStatus && (
                  <Badge variant="outline">{contract.paymentStatus}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Partner: {contract.targetType === "freelancer"
                  ? contract.targetFreelancer?.name || "Freelancer"
                  : contract.targetProvider?.companyName || "Service Provider"}
              </p>
              <p className="text-sm text-muted-foreground">
                {contract.description || "No description provided."}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild variant="secondary">
                <Link to={`/contracts/${contract._id}`}>
                  View Contract <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Your Hires</h1>
            <p className="text-muted-foreground">
              Track every freelancer and service provider you’ve partnered with on IMPEARL.
            </p>
          </div>

          {loading ? (
            <Card className="p-10 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading contracts...
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Freelancers</h2>
                {renderList(freelancerHires, "freelancers")}
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Service Providers</h2>
                {renderList(providerHires, "service providers")}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hires;
