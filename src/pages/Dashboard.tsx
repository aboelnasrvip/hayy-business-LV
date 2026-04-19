import { motion } from "framer-motion";
import {
  TrendingUp, Eye, MessageSquare, Star, Plus, ArrowUpRight,
  Users, BarChart3, Activity, TrendingDown
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

// ─── Chart Data ────────────────────────────────────────────────────────────────

const viewsData = [
  { day: "Mon", views: 1200, comments: 40 },
  { day: "Tue", views: 1900, comments: 65 },
  { day: "Wed", views: 1500, comments: 52 },
  { day: "Thu", views: 2400, comments: 88 },
  { day: "Fri", views: 2100, comments: 74 },
  { day: "Sat", views: 2800, comments: 96 },
  { day: "Sun", views: 3100, comments: 110 },
];

const postsPerformance = [
  { name: "Summer Menu", views: 1234, likes: 89 },
  { name: "Weekend Offer", views: 892, likes: 63 },
  { name: "Behind Scenes", views: 567, likes: 44 },
  { name: "New Dishes", views: 2100, likes: 130 },
  { name: "Happy Hour", views: 760, likes: 55 },
];

const ratingsData = [
  { name: "5 Stars", value: 58, color: "#f97316" },
  { name: "4 Stars", value: 24, color: "#fb923c" },
  { name: "3 Stars", value: 12, color: "#fdba74" },
  { name: "2 Stars", value: 4,  color: "#fed7aa" },
  { name: "1 Star",  value: 2,  color: "#ffedd5" },
];

const followersGrowth = [
  { month: "Oct", followers: 1200 },
  { month: "Nov", followers: 1600 },
  { month: "Dec", followers: 1900 },
  { month: "Jan", followers: 2100 },
  { month: "Feb", followers: 2500 },
  { month: "Mar", followers: 2891 },
];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }} className="capitalize">
            {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Eye,
      labelKey: "dashboard.totalViews",
      value: "12,543",
      change: "+14%",
      positive: true,
      sparkColor: "#f97316",
    },
    {
      icon: MessageSquare,
      labelKey: "dashboard.comments",
      value: "342",
      change: "+8%",
      positive: true,
      sparkColor: "#fb923c",
    },
    {
      icon: Star,
      labelKey: "dashboard.avgRating",
      value: "4.8",
      change: "+0.3",
      positive: true,
      sparkColor: "#fdba74",
    },
    {
      icon: Users,
      labelKey: "dashboard.followers",
      value: "2,891",
      change: "+24%",
      positive: true,
      sparkColor: "#f97316",
    },
  ];

  const recentComments = [
    { id: 1, user: "Ahmed K.",  comment: "Amazing food and great atmosphere!", rating: 5, time: "10 min ago" },
    { id: 2, user: "Sara M.",   comment: "Love the new menu items",            rating: 4, time: "1 hour ago" },
    { id: 3, user: "Khalid R.", comment: "Best coffee in town!",               rating: 5, time: "3 hours ago" },
  ];

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

        {/* ── Welcome ── */}
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

        {/* ── KPI Stats ── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -3, boxShadow: "0 20px 40px rgba(249,115,22,0.15)" }}
              className="bg-card border border-border rounded-2xl p-5 transition-all relative overflow-hidden"
            >
              {/* subtle bg glow */}
              <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-2xl"
                style={{ background: stat.sparkColor }}
              />
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    stat.positive ? "text-emerald-600 bg-emerald-500/10" : "text-destructive bg-destructive/10"
                  }`}
                >
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Views & Comments Area Chart ── */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{t("dashboard.totalViews")} &amp; {t("dashboard.comments")}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-3 h-1.5 rounded-full bg-primary inline-block" /> Views
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-3 h-1.5 rounded-full bg-orange-300 inline-block" /> Comments
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={viewsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#fdba74" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#fdba74" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="views"    stroke="#f97316" strokeWidth={2.5} fill="url(#colorViews)"    dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
              <Area type="monotone" dataKey="comments" stroke="#fdba74" strokeWidth={2.5} fill="url(#colorComments)" dot={false} activeDot={{ r: 5, fill: "#fdba74" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Bar + Donut row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Posts Bar Chart — takes 3 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("dashboard.recentPosts")}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Views vs Likes</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary">
                {t("dashboard.viewAll")} <ArrowUpRight className="w-4 h-4 ms-1" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={postsPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="#f97316" radius={[6, 6, 0, 0]} />
                <Bar dataKey="likes" fill="#fed7aa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Ratings Donut — takes 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">{t("dashboard.avgRating")} Distribution</h2>
              <p className="text-sm text-muted-foreground mt-0.5">All time</p>
            </div>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={ratingsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {ratingsData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-card border border-border rounded-xl p-2 shadow-lg text-xs">
                          <p className="font-semibold text-foreground">{payload[0].name}</p>
                          <p className="text-muted-foreground">{payload[0].value}%</p>
                        </div>
                      ) : null
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 w-full">
                {ratingsData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-semibold text-foreground ms-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Followers Growth + Recent Comments row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Followers Line Chart — 3 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t("dashboard.followers")} Growth</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Last 6 months</p>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-500/10 text-xs font-semibold px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +24%
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={followersGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4, stroke: "hsl(var(--card))" }}
                  activeDot={{ r: 6, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Comments — 2 cols */}
          <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">{t("dashboard.recentComments")}</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                {t("dashboard.viewAll")} <ArrowUpRight className="w-4 h-4 ms-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentComments.map((comment) => (
                <motion.div
                  key={comment.id}
                  whileHover={{ x: 4 }}
                  className="p-3.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-xs">{comment.user.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-foreground text-sm">{comment.user}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(comment.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{comment.comment}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5">{comment.time}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CTA Banner ── */}
        <motion.div variants={itemVariants} className="bg-gradient-primary rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-xl lg:text-2xl font-bold mb-1.5">{t("dashboard.growTitle")}</h2>
              <p className="text-white/75">{t("dashboard.growSubtitle")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" className="bg-white text-foreground hover:bg-white/90">
                <Activity className="w-5 h-5 me-2" />
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