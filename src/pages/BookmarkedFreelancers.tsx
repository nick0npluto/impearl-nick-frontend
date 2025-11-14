import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star, DollarSign, Clock, Trash2, Mail } from "lucide-react";
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

const BookmarkedFreelancers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      // Get favorite IDs from localStorage
      const savedFavorites = localStorage.getItem("favorites");
      const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
      setFavorites(favoriteIds);

      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all freelancers
      const response = await ApiService.getFreelancers();
      
      if (response.success) {
        // Filter to only show favorited freelancers
        const favoritedFreelancers = response.freelancers.filter((f: Freelancer) =>
          favoriteIds.includes(f._id)
        );
        setFreelancers(favoritedFreelancers);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (freelancerId: string) => {
    const newFavorites = favorites.filter((id) => id !== freelancerId);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
    setFreelancers(freelancers.filter((f) => f._id !== freelancerId));

    toast({
      title: "Removed from Bookmarks",
      description: "Freelancer removed from your bookmarks",
    });
  };

  const clearAllFavorites = () => {
    localStorage.setItem("favorites", JSON.stringify([]));
    setFavorites([]);
    setFreelancers([]);

    toast({
      title: "All Bookmarks Cleared",
      description: "All freelancers have been removed from your bookmarks",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getExperienceLabel = (exp: string) => {
    const labels: { [key: string]: string } = {
      "0-1": "Entry Level",
      "1-3": "Intermediate",
      "3-5": "Experienced",
      "5-10": "Expert",
      "10+": "Master",
    };
    return labels[exp] || exp;
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-10 w-10 text-primary fill-primary" />
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                    Bookmarked Freelancers
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Your saved freelancers for future projects
                </p>
              </div>

              {freelancers.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFavorites}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Bookmarks Count */}
          {freelancers.length > 0 && (
            <div className="mb-6">
              <p className="text-muted-foreground">
                {freelancers.length} bookmarked freelancer{freelancers.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Freelancer Grid */}
          {freelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
              {freelancers.map((freelancer) => (
                <Card
                  key={freelancer._id}
                  className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(freelancer._id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-destructive/10 transition-colors"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>

                  <div
                    onClick={() => navigate(`/freelancer/${freelancer._id}`)}
                    className="p-6 cursor-pointer"
                  >
                    {/* Profile Picture */}
                    <div className="mb-4 flex justify-center">
                      {freelancer.freelancerProfile.profilePicture ? (
                        <img
                          src={freelancer.freelancerProfile.profilePicture}
                          alt={freelancer.freelancerProfile.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                          <span className="text-2xl font-bold text-primary">
                            {getInitials(freelancer.freelancerProfile.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-center mb-2 text-foreground">
                      {freelancer.freelancerProfile.name}
                    </h3>

                    {/* Experience Badge */}
                    <div className="flex justify-center mb-3">
                      <Badge variant="secondary">
                        {getExperienceLabel(freelancer.freelancerProfile.yearsExperience)}
                      </Badge>
                    </div>

                    {/* Expertise */}
                    <p className="text-sm text-primary font-medium text-center mb-3">
                      {freelancer.freelancerProfile.expertise}
                    </p>

                    {/* Bio */}
                    <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-3 min-h-[60px]">
                      {freelancer.freelancerProfile.bio || "No bio provided"}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      {/* Rating */}
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          {freelancer.freelancerProfile.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({freelancer.freelancerProfile.reviewCount})
                        </span>
                      </div>

                      {/* Hourly Rate */}
                      {freelancer.freelancerProfile.hourlyRate && (
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold">
                            ${freelancer.freelancerProfile.hourlyRate}/hr
                          </span>
                        </div>
                      )}

                      {/* Availability */}
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="capitalize">
                          {freelancer.freelancerProfile.availability.replace("-", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/freelancer/${freelancer._id}`);
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${freelancer.email}`;
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="p-12 text-center animate-fade-in">
              <div className="max-w-md mx-auto">
                <Heart className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold mb-3">No Bookmarked Freelancers</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't bookmarked any freelancers yet. Browse the marketplace and click
                  the heart icon on freelancers you'd like to save for later.
                </p>
                <Button onClick={() => navigate("/marketplace")} size="lg">
                  Browse Freelancers
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookmarkedFreelancers;
