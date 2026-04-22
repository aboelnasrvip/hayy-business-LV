import { motion } from "framer-motion";
import { Star, ThumbsUp, Flag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardComments = () => {
  const comments = [
    { id: 1, user: "Ahmed K.", avatar: "AK", comment: "Amazing food and great atmosphere! Will definitely come back.", rating: 5, post: "Summer Menu Launch", time: "10 min ago", likes: 5 },
    { id: 2, user: "Sara M.", avatar: "SM", comment: "Love the new menu items, especially the desserts!", rating: 5, post: "Weekend Special", time: "1 hour ago", likes: 3 },
    { id: 3, user: "Khalid R.", avatar: "KR", comment: "Best coffee in town! Great service too.", rating: 5, post: "Behind Scenes", time: "3 hours ago", likes: 8 },
    { id: 4, user: "Layla H.", avatar: "LH", comment: "Good food but service was a bit slow today.", rating: 4, post: "New Dishes", time: "5 hours ago", likes: 2 },
    { id: 5, user: "Omar F.", avatar: "OF", comment: "Fantastic experience! Highly recommended.", rating: 5, post: "Summer Menu Launch", time: "1 day ago", likes: 12 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Comments</h1>
        <p className="text-muted-foreground mt-1">Manage customer feedback and reviews</p>
      </div>

      <div className="grid gap-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-bold text-sm">{comment.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{comment.user}</h4>
                    <p className="text-sm text-muted-foreground">{comment.time} • {comment.post}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: comment.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-foreground mb-3">{comment.comment}</p>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Flag className="w-4 h-4 me-1" />
                    Report
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 me-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardComments;