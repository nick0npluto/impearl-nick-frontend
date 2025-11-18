import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import ApiService from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const FreelancerProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    pastProjects: "",
    yearsExperience: "",
    portfolioLinks: "",
    hourlyRate: "",
    availability: "",
    resumeUrl: "",
  });
  const [resumeConfirmed, setResumeConfirmed] = useState(false);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertiseTags, setExpertiseTags] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<Array<{ role: string; company: string; timeframe: string; skillsUsed: string; summary: string }>>([]);
  const [experienceForm, setExperienceForm] = useState({ role: "", company: "", timeframe: "", skillsUsed: "", summary: "" });
  const [education, setEducation] = useState<Array<{ school: string; degree: string; graduationYear: string }>>([]);
  const [educationForm, setEducationForm] = useState({ school: "", degree: "", graduationYear: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !expertiseTags.length || !formData.yearsExperience) {
      toast({
        title: "Missing Required Fields",
        description: "Please add your first name, at least one expertise, and years of experience.",
        variant: "destructive",
      });
      return;
    }

    if (!resumeConfirmed) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume via Dropbox and confirm before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Validate hourly rate is numeric if provided
    if (formData.hourlyRate && isNaN(Number(formData.hourlyRate))) {
      toast({
        title: "Invalid Rate",
        description: "Hourly rate must be a number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await ApiService.createFreelancerProfile({
        ...formData,
        expertiseTags,
        expertise: expertiseTags.join(", "),
        experiences,
        education,
      });

      try {
        await refresh();
      } catch (err) {
        console.error("Failed to sync auth state after freelancer profile", err);
      }

      toast({
        title: "Profile Created",
        description: "Your freelancer profile has been saved successfully.",
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Create Freelancer Profile
            </h1>
            <p className="text-xl text-muted-foreground">
              Showcase your expertise and get discovered by businesses
            </p>
          </div>

          <Card className="p-8 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="firstName" className="text-foreground">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter your first name"
                  className="mt-2"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter your last name"
                  className="mt-2"
                  disabled={loading}
                />
              </div>

              <div>
                <Label className="text-foreground">
                  Expertise & Skills <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="Add a specialty (e.g., Zapier)"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (!expertiseInput.trim()) return;
                      if (!expertiseTags.includes(expertiseInput.trim())) {
                        setExpertiseTags([...expertiseTags, expertiseInput.trim()]);
                      }
                      setExpertiseInput("");
                    }}
                    disabled={loading}
                  >
                    Add
                  </Button>
                </div>
                {!expertiseTags.length && (
                  <p className="text-sm text-destructive mt-1">Add at least one skill.</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {expertiseTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => setExpertiseTags(expertiseTags.filter((item) => item !== tag))}>
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="yearsExperience" className="text-foreground">
                  Years of Experience <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.yearsExperience}
                  onValueChange={(value) => setFormData({ ...formData, yearsExperience: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pastProjects" className="text-foreground">
                  Past Projects
                </Label>
                <Textarea
                  id="pastProjects"
                  value={formData.pastProjects}
                  onChange={(e) => setFormData({ ...formData, pastProjects: e.target.value })}
                  placeholder="Describe your notable past projects and achievements..."
                  className="mt-2 min-h-[120px]"
                  disabled={loading}
                />
              </div>

              <div>
                <Label className="text-foreground">Resume Upload</Label>
                <div className="flex flex-col gap-3 mt-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="whitespace-nowrap"
                    onClick={() =>
                      window.open("https://www.dropbox.com/request/1Ppv7LuYqjCQvrM1VbGj", "_blank", "noopener,noreferrer")
                    }
                  >
                    Upload via Dropbox
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Use the Dropbox link above to send us your resume. No need to paste a link—our team will handle the rest.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Checkbox
                    id="resume-confirm"
                    checked={resumeConfirmed}
                    onCheckedChange={(checked) => setResumeConfirmed(Boolean(checked))}
                    disabled={loading}
                  />
                  <Label htmlFor="resume-confirm" className="text-sm text-muted-foreground">
                    I uploaded my resume via Dropbox
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Work Experience</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!experienceForm.role || !experienceForm.company) return;
                      setExperiences((prev) => [...prev, experienceForm]);
                      setExperienceForm({ role: "", company: "", timeframe: "", skillsUsed: "", summary: "" });
                    }}
                    disabled={loading}
                  >
                    Add Experience
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Role"
                    value={experienceForm.role}
                    onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                  />
                  <Input
                    placeholder="Company"
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                  />
                  <Input
                    placeholder="Timeframe (e.g., 2022 - Present)"
                    value={experienceForm.timeframe}
                    onChange={(e) => setExperienceForm({ ...experienceForm, timeframe: e.target.value })}
                  />
                  <Input
                    placeholder="Skills used"
                    value={experienceForm.skillsUsed}
                    onChange={(e) => setExperienceForm({ ...experienceForm, skillsUsed: e.target.value })}
                  />
                </div>
                <Textarea
                  placeholder="Summary of your impact"
                  value={experienceForm.summary}
                  onChange={(e) => setExperienceForm({ ...experienceForm, summary: e.target.value })}
                  className="min-h-[80px]"
                />
                {experiences.length > 0 && (
                  <div className="space-y-2">
                    {experiences.map((exp, idx) => (
                      <Card key={`${exp.role}-${idx}`} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{exp.role} @ {exp.company}</p>
                          <p className="text-sm text-muted-foreground">{exp.timeframe || "Timeframe not specified"}</p>
                          {exp.skillsUsed && <p className="text-xs text-muted-foreground">Skills: {exp.skillsUsed}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}>
                          Remove
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Education</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!educationForm.school) return;
                      setEducation((prev) => [...prev, educationForm]);
                      setEducationForm({ school: "", degree: "", graduationYear: "" });
                    }}
                    disabled={loading}
                  >
                    Add Education
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="School"
                    value={educationForm.school}
                    onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })}
                  />
                  <Input
                    placeholder="Degree / Program"
                    value={educationForm.degree}
                    onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  />
                  <Input
                    placeholder="Graduation Year"
                    value={educationForm.graduationYear}
                    onChange={(e) => setEducationForm({ ...educationForm, graduationYear: e.target.value })}
                  />
                </div>
                {education.length > 0 && (
                  <div className="space-y-2">
                    {education.map((item, idx) => (
                      <Card key={`${item.school}-${idx}`} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{item.school}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.degree || "Program"} {item.graduationYear && `• ${item.graduationYear}`}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setEducation(education.filter((_, i) => i !== idx))}>
                          Remove
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="portfolioLinks" className="text-foreground">
                  Portfolio Links
                </Label>
                <Input
                  id="portfolioLinks"
                  value={formData.portfolioLinks}
                  onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                  placeholder="https://portfolio.com, https://github.com/username"
                  className="mt-2"
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Separate multiple links with commas
                </p>
              </div>

              <div>
                <Label htmlFor="hourlyRate" className="text-foreground">
                  Hourly Rate (USD)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="50"
                  className="mt-2"
                  min="0"
                  step="0.01"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="availability" className="text-foreground">
                  Availability
                </Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time (40+ hrs/week)</SelectItem>
                    <SelectItem value="part-time">Part-time (20-40 hrs/week)</SelectItem>
                    <SelectItem value="contract">Contract basis</SelectItem>
                    <SelectItem value="hourly">Hourly projects</SelectItem>
                    <SelectItem value="not-available">Not currently available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                  {loading ? 'Creating Profile...' : 'Create Profile'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={() => navigate("/register")}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FreelancerProfile;
