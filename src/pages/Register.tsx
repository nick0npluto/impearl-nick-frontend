import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Building2, User } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [selectedRole, setSelectedRole] = useState<"business" | "freelancer" | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Join IMPEARL
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose your account type to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                  onClick={() => setSelectedRole("business")}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Business</h3>
                <p className="text-muted-foreground mb-6">
                  Find automation tools, hire freelancers, and grow your business with AI-powered recommendations
                </p>
                <Button variant="default" size="lg" className="w-full" asChild>
                  <Link to="/register/business">Continue as Business</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                  onClick={() => setSelectedRole("freelancer")}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Freelancer</h3>
                <p className="text-muted-foreground mb-6">
                  Showcase your expertise, connect with businesses, and get hired for automation projects
                </p>
                <Button variant="default" size="lg" className="w-full" asChild>
                  <Link to="/register/freelancer">Continue as Freelancer</Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
