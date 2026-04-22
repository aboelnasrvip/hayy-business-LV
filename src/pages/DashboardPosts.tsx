import { motion } from "framer-motion";
import { Plus, Eye, MessageSquare, Heart, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPosts = () => {
  const posts = [
    { id: 1, title: "Summer Menu Launch", views: 1234, comments: 45, likes: 89, date: "2026-04-15", status: "Published" },
    { id: 2, title: "Weekend Special Offer", views: 892, comments: 32, likes: 63, date: "2026-04-18", status: "Published" },
    { id: 3, title: "Behind the Scenes", views: 567, comments: 18, likes: 44, date: "2026-04-19", status: "Draft" },
    { id: 4, title: "New Dishes Preview", views: 2100, comments: 76, likes: 130, date: "2026-04-17", status: "Published" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your social media content</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
          <Plus className="w-5 h-5 me-2" />
          Create Post
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.status === "Published" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {post.comments}
              </span>
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {post.likes}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPosts;