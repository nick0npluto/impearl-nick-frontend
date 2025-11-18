import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ApiService from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ContractItem {
  _id: string;
  title: string;
  status: string;
  agreedPrice?: number;
  payee?: { name?: string };
  business?: { businessName?: string };
  updatedAt?: string;
}

const ActiveProjects = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ContractItem[]>([]);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getContracts();
        setContracts(response.contracts || []);
      } catch (error: any) {
        toast({
          title: "Unable to load projects",
          description: error.message || "Please try again shortly.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, [toast]);

  const activeProjects = useMemo(
    () => contracts.filter((contract) => ["active", "in_progress", "held"].includes(contract.status)),
    [contracts]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Active Projects</h1>
            <p className="text-muted-foreground">
              Track every live engagement, see payout status, and jump into each contract’s workspace.
            </p>
          </div>

          {loading ? (
            <Card className="p-8 flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading your projects...
            </Card>
          ) : activeProjects.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No active projects yet. Respond to new engagement requests to get started.
            </Card>
          ) : (
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Card key={project._id} className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-foreground">{project.title || "Untitled Contract"}</h2>
                    <Badge>{project.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Client: {project.business?.businessName || "Business"}
                  </p>
                  {project.agreedPrice ? (
                    <p className="text-sm text-muted-foreground">
                      Agreed price: ${project.agreedPrice.toLocaleString()}
                    </p>
                  ) : null}
                  {project.updatedAt && (
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap pt-2">
                    <Button asChild variant="secondary">
                      <Link to={`/contracts/${project._id}`}>Open Contract</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/messages">Open Messages</Link>
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

export default ActiveProjects;
