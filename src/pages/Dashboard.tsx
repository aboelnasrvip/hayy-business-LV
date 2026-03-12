import { motion } from "framer-motion";
import { TrendingUp, Eye, MessageSquare, Star, Plus, ArrowUpRight, Users, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Eye, labelKey: "dashboard.totalViews", value: "12,543", change: "+14%", positive: true },
    { icon: MessageSquare, labelKey: "dashboard.comments", value: "342", change: "+8%", positive: true },
    { icon: Star, labelKey: "dashboard.avgRating", value: "4.8", change: "+0.3", positive: true },
    { icon: Users, labelKey: "dashboard.followers", value: "2,891", change: "+24%", positive: true },
  ];

  const recentPosts = [
    { id: 1, title: "New Summer Menu Launch!", views: 1234, comments: 45, date: "2 hours ago" },
    { id: 2, title: "Weekend Special Offer", views: 892, comments: 23, date: "1 day ago" },
    { id: 3, title: "Behind the Scenes", views: 567, comments: 12, date: "3 days ago" },
  ];

  const recentComments = [
    { id: 1, user: "Ahmed K.", comment: "Amazing food and great atmosphere!", rating: 5, time: "10 min ago" },
    { id: 2, user: "Sara M.", comment: "Love the new menu items", rating: 4, time: "1 hour ago" },
    { id: 3, user: "Khalid R.", comment: "Best coffee in town!", rating: 5, time: "3 hours ago" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        {/* Welcome */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {t("dashboard.welcome")} <span className="text-gradient">{t("dashboard.businessName")}</span>!
            </h1>
            <p className="text-muted-foreground mt-1">{t("dashboard.overview")}</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Plus className="w-5 h-5 me-2" />
              {t("dashboard.createPost")}
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.positive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">{t("dashboard.recentPosts")}</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                {t("dashboard.viewAll")}
                <ArrowUpRight className="w-4 h-4 ms-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.views} {t("dashboard.views")} · {post.comments} {t("dashboard.comments")}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{post.date}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Comments */}
          <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">{t("dashboard.recentComments")}</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                {t("dashboard.viewAll")}
                <ArrowUpRight className="w-4 h-4 ms-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium text-sm">{comment.user.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground">{comment.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(comment.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">{comment.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-gradient-primary rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-xl lg:text-2xl font-bold mb-2">{t("dashboard.growTitle")}</h2>
              <p className="text-white/80">{t("dashboard.growSubtitle")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="bg-white text-foreground hover:bg-white/90">
                <TrendingUp className="w-5 h-5 me-2" />
                {t("dashboard.viewAnalytics")}
              </Button>
              <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Plus className="w-5 h-5 me-2" />
                {t("dashboard.createCampaign")}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
