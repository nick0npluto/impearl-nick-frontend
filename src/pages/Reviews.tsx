import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ApiService from "@/services/api";
import { Loader2, Reply } from "lucide-react";

interface ReviewItem {
  _id: string;
  reviewerName?: string;
  reviewerType?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  response?: {
    body?: string;
    respondedAt?: string;
    responderName?: string;
  };
}

const getProfileRating = (user: any) => {
  if (!user) return { rating: 0, reviewCount: 0 };
  if (user.userType === "freelancer") {
    return {
      rating: user.freelancerProfile?.rating ?? 0,
      reviewCount: user.freelancerProfile?.reviewCount ?? 0,
    };
  }
  if (user.userType === "service_provider") {
    return {
      rating: user.serviceProviderProfile?.rating ?? 0,
      reviewCount: user.serviceProviderProfile?.reviewCount ?? 0,
    };
  }
  if (user.userType === "business") {
    return {
      rating: user.businessProfile?.rating ?? 0,
      reviewCount: user.businessProfile?.reviewCount ?? 0,
    };
  }
  return { rating: 0, reviewCount: 0 };
};

const ReviewsPage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [responseDrafts, setResponseDrafts] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const storedUser = ApiService.getUser();
  const identity = profile || storedUser;
  const targetType = identity?.userType;
  const targetUserId = identity?._id || identity?.id;

  const loadData = async () => {
    try {
      setLoading(true);
      const profileRes = await ApiService.getProfile();
      const activeUser = profileRes?.user || storedUser;
      setProfile(profileRes?.user || null);

      if (!activeUser?.userType || !(activeUser?._id || activeUser?.id)) {
        setReviews([]);
        return;
      }

      const reviewRes = await ApiService.getReviews(
        activeUser.userType,
        (activeUser._id || activeUser.id) as string
      );
      setReviews(reviewRes?.reviews || []);
    } catch (error: any) {
      toast({ title: "Unable to load reviews", description: error.message || "Try again shortly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => getProfileRating(profile), [profile]);

  const handleRespond = async (reviewId: string) => {
    const body = responseDrafts[reviewId];
    if (!body || !body.trim()) {
      toast({ title: "Response required", description: "Write a response before submitting.", variant: "destructive" });
      return;
    }
    try {
      setSubmittingId(reviewId);
      await ApiService.respondToReview(reviewId, body.trim());
      toast({ title: "Response posted" });
      setResponseDrafts((prev) => ({ ...prev, [reviewId]: "" }));
      await loadData();
    } catch (error: any) {
      toast({ title: "Unable to respond", description: error.message || "Please try again." , variant: "destructive" });
    } finally {
      setSubmittingId(null);
    }
  };

  if (!targetType || !targetUserId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-20 px-4">
          {loading ? (
            <Card className="max-w-2xl mx-auto p-8 text-center text-muted-foreground">
              <div className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading profile...
              </div>
            </Card>
          ) : (
            <Card className="max-w-2xl mx-auto p-8 text-center text-muted-foreground">
              Reviews are only available for signed-in marketplace users.
            </Card>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Reviews & Ratings</h1>
            <p className="text-muted-foreground">
              See what clients are saying about you and keep the conversation going by responding.
            </p>
          </div>

          <Card className="p-6 flex flex-wrap gap-8 items-center">
            <div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-4xl font-bold text-foreground">{stats.rating.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reviews</p>
              <p className="text-4xl font-bold text-foreground">{stats.reviewCount}</p>
            </div>
          </Card>

          {loading ? (
            <Card className="p-8 flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading reviews...
            </Card>
          ) : reviews.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No reviews yet.</Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review._id} className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-foreground">{review.reviewerName || "Client"}</h2>
                    <Badge variant="secondary">{review.rating.toFixed(1)} ★</Badge>
                    <span className="text-sm text-muted-foreground">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment || "No comment provided."}</p>

                  {review.response?.body ? (
                    <Card className="border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                        <Reply className="h-4 w-4" /> Response from {review.response.responderName || "you"}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.response.body}</p>
                      {review.response.respondedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Responded {new Date(review.response.respondedAt).toLocaleString()}
                        </p>
                      )}
                    </Card>
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write a response..."
                        value={responseDrafts[review._id] || ""}
                        onChange={(e) =>
                          setResponseDrafts((prev) => ({ ...prev, [review._id]: e.target.value }))
                        }
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleRespond(review._id)}
                          disabled={submittingId === review._id}
                        >
                          {submittingId === review._id ? "Sending..." : "Post Response"}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
