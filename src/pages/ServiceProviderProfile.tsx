import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/services/api";
import { ArrowLeft, Rocket, Plus, Trash } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SUPPORT_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "Slack/Chat", value: "chat" },
  { label: "Dedicated Manager", value: "dedicated_mgr" },
  { label: "24/7", value: "24_7" },
];

const PRICING_MODELS = ["subscription", "fixed", "hourly", "usage-based"];
const ONBOARDING_OPTIONS = ["1-2 weeks", "3-4 weeks", "4-8 weeks", "Custom"];

const ServiceProviderProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    headline: "",
    valueProposition: "",
    websiteUrl: "",
    industryFocus: "",
    integrations: "",
    description: "",
    pricingModel: "",
    onboardingTime: "",
    teamSize: "",
    contactName: "",
    contactEmail: "",
    certifications: "",
    idealCustomerProfile: "",
    successMetrics: "",
    differentiators: "",
  });
  const [supportChannels, setSupportChannels] = useState<string[]>([]);
  const [offerings, setOfferings] = useState<Array<{ name: string; promise: string; priceRange: string; timeline: string }>>([]);
  const [offeringForm, setOfferingForm] = useState({ name: "", promise: "", priceRange: "", timeline: "" });
  const [caseStudies, setCaseStudies] = useState<Array<{ client: string; challenge: string; solution: string; impact: string }>>([]);
  const [caseStudyForm, setCaseStudyForm] = useState({ client: "", challenge: "", solution: "", impact: "" });

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSupportChannel = (value: string) => {
    setSupportChannels((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleAddOffering = () => {
    if (!offeringForm.name || !offeringForm.promise) {
      toast({ title: "Add details", description: "Give each offering a name and promise." });
      return;
    }
    setOfferings((prev) => [...prev, offeringForm]);
    setOfferingForm({ name: "", promise: "", priceRange: "", timeline: "" });
  };

  const handleAddCaseStudy = () => {
    if (!caseStudyForm.client || !caseStudyForm.challenge) {
      toast({ title: "Add details", description: "Add at least a client and challenge." });
      return;
    }
    setCaseStudies((prev) => [...prev, caseStudyForm]);
    setCaseStudyForm({ client: "", challenge: "", solution: "", impact: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.valueProposition || !formData.description) {
      toast({
        title: "Missing required fields",
        description: "Company name, value proposition, and description are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await ApiService.createServiceProviderProfile({
        ...formData,
        industryFocus: formData.industryFocus,
        integrations: formData.integrations,
        certifications: formData.certifications,
        offerings,
        caseStudies,
        supportChannels,
      });
      await refresh().catch((err) => console.error("Failed to sync auth state", err));
      toast({ title: "Profile Created", description: "Your service provider profile is now live." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="h-10 w-10 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Service Provider Profile</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Capture your offerings, proof, and onboarding details so businesses know exactly how you help.
              </p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/register")}> <ArrowLeft className="mr-2 h-4 w-4" /> Back </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Company Basics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} required disabled={loading} />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input type="url" value={formData.websiteUrl} onChange={(e) => updateField("websiteUrl", e.target.value)} disabled={loading} placeholder="https://" />
                </div>
                <div>
                  <Label>Headline / Tagline</Label>
                  <Input value={formData.headline} onChange={(e) => updateField("headline", e.target.value)} disabled={loading} placeholder="AI automations for revenue teams" />
                </div>
                <div>
                  <Label>Team Size</Label>
                  <Input value={formData.teamSize} onChange={(e) => updateField("teamSize", e.target.value)} disabled={loading} placeholder="e.g., 5-10" />
                </div>
              </div>
              <div>
                <Label>Value Proposition *</Label>
                <Textarea value={formData.valueProposition} onChange={(e) => updateField("valueProposition", e.target.value)} disabled={loading} className="mt-2" placeholder="Describe the outcome you consistently deliver." required />
              </div>
              <div>
                <Label>Company Description *</Label>
                <Textarea value={formData.description} onChange={(e) => updateField("description", e.target.value)} disabled={loading} className="mt-2 min-h-[140px]" placeholder="What makes your product or service unique?" required />
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Offerings & Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Offering Name</Label>
                  <Input value={offeringForm.name} onChange={(e) => setOfferingForm({ ...offeringForm, name: e.target.value })} disabled={loading} placeholder="Automation accelerator" />
                </div>
                <div>
                  <Label>Price Range</Label>
                  <Input value={offeringForm.priceRange} onChange={(e) => setOfferingForm({ ...offeringForm, priceRange: e.target.value })} disabled={loading} placeholder="$5k - $10k" />
                </div>
                <div>
                  <Label>Timeline</Label>
                  <Input value={offeringForm.timeline} onChange={(e) => setOfferingForm({ ...offeringForm, timeline: e.target.value })} disabled={loading} placeholder="3 weeks" />
                </div>
                <div className="md:col-span-2">
                  <Label>Promise / Outcome</Label>
                  <Textarea value={offeringForm.promise} onChange={(e) => setOfferingForm({ ...offeringForm, promise: e.target.value })} disabled={loading} className="mt-2" placeholder="Implement HubSpot + Zapier workflows that cut manual ops by 40%" />
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={handleAddOffering} disabled={loading}> <Plus className="h-4 w-4 mr-2" /> Add Offering </Button>
              {offerings.length > 0 && (
                <div className="space-y-3">
                  {offerings.map((offering, idx) => (
                    <Card key={`${offering.name}-${idx}`} className="p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{offering.name}</p>
                          <p className="text-sm text-muted-foreground">{offering.promise}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {offering.priceRange && `Budget: ${offering.priceRange}`} {offering.timeline && `• Timeline: ${offering.timeline}`}
                          </p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setOfferings(offerings.filter((_, i) => i !== idx))}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Case Studies & Proof</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <Input value={caseStudyForm.client} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, client: e.target.value })} disabled={loading} />
                </div>
                <div>
                  <Label>Impact</Label>
                  <Input value={caseStudyForm.impact} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, impact: e.target.value })} disabled={loading} placeholder="Saved 120 hrs/mo" />
                </div>
                <div className="md:col-span-2">
                  <Label>Challenge</Label>
                  <Textarea value={caseStudyForm.challenge} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, challenge: e.target.value })} disabled={loading} className="mt-2" />
                </div>
                <div className="md:col-span-2">
                  <Label>Solution</Label>
                  <Textarea value={caseStudyForm.solution} onChange={(e) => setCaseStudyForm({ ...caseStudyForm, solution: e.target.value })} disabled={loading} className="mt-2" />
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={handleAddCaseStudy} disabled={loading}> <Plus className="h-4 w-4 mr-2" /> Add Case Study </Button>
              {caseStudies.length > 0 && (
                <div className="space-y-3">
                  {caseStudies.map((study, idx) => (
                    <Card key={`${study.client}-${idx}`} className="p-4">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{study.client}</p>
                          <p className="text-sm text-muted-foreground">Challenge: {study.challenge}</p>
                          <p className="text-sm text-muted-foreground">Solution: {study.solution}</p>
                          {study.impact && <p className="text-xs text-muted-foreground mt-1">Impact: {study.impact}</p>}
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => setCaseStudies(caseStudies.filter((_, i) => i !== idx))}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Service Logistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Pricing Model</Label>
                  <select className="border-input bg-background rounded-md px-3 py-2 text-sm" value={formData.pricingModel} onChange={(e) => updateField("pricingModel", e.target.value)} disabled={loading}>
                    <option value="">Select pricing model</option>
                    {PRICING_MODELS.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Onboarding Timeline</Label>
                  <select className="border-input bg-background rounded-md px-3 py-2 text-sm" value={formData.onboardingTime} onChange={(e) => updateField("onboardingTime", e.target.value)} disabled={loading}>
                    <option value="">Select timeline</option>
                    {ONBOARDING_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Industry Focus</Label>
                  <Input value={formData.industryFocus} onChange={(e) => updateField("industryFocus", e.target.value)} disabled={loading} placeholder="commerce, logistics" />
                  <p className="text-xs text-muted-foreground mt-1">Separate industries with commas.</p>
                </div>
                <div>
                  <Label>Integrations</Label>
                  <Input value={formData.integrations} onChange={(e) => updateField("integrations", e.target.value)} disabled={loading} placeholder="Shopify, HubSpot" />
                  <p className="text-xs text-muted-foreground mt-1">Separate tools with commas.</p>
                </div>
              </div>
              <div>
                <Label>Support Channels</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {SUPPORT_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={supportChannels.includes(option.value)} onCheckedChange={() => toggleSupportChannel(option.value)} disabled={loading} />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Trust Signals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Certifications / Badges</Label>
                  <Input value={formData.certifications} onChange={(e) => updateField("certifications", e.target.value)} disabled={loading} placeholder="Zapier Expert, Make Partner" />
                </div>
                <div>
                  <Label>Ideal Customer Profile</Label>
                  <Input value={formData.idealCustomerProfile} onChange={(e) => updateField("idealCustomerProfile", e.target.value)} disabled={loading} placeholder="VC-backed SaaS, 20-200 employees" />
                </div>
                <div>
                  <Label>Success Metrics</Label>
                  <Input value={formData.successMetrics} onChange={(e) => updateField("successMetrics", e.target.value)} disabled={loading} placeholder="Reduced manual ops 40%" />
                </div>
                <div>
                  <Label>Key Differentiators</Label>
                  <Input value={formData.differentiators} onChange={(e) => updateField("differentiators", e.target.value)} disabled={loading} placeholder="Deep Make/HubSpot expertise" />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Primary Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Point of Contact</Label>
                  <Input value={formData.contactName} onChange={(e) => updateField("contactName", e.target.value)} disabled={loading} placeholder="Jane Doe" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input type="email" value={formData.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} disabled={loading} placeholder="jane@company.com" />
                </div>
              </div>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ServiceProviderProfile;
