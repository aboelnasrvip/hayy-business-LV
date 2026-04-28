import { motion } from "framer-motion";
import {
  TrendingUp,
  Eye,
  MessageSquare,
  Star,
  Users,
  TrendingDown,
  ArrowUpRight,
  Plus,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

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
  { name: "2 Stars", value: 4, color: "#fed7aa" },
  { name: "1 Star", value: 2, color: "#e5e7eb" },
];

const followersGrowth = [
  { month: "Oct", followers: 1200 },
  { month: "Nov", followers: 1600 },
  { month: "Dec", followers: 1900 },
  { month: "Jan", followers: 2100 },
  { month: "Feb", followers: 2500 },
  { month: "Mar", followers: 2891 },
];

// ─── Neumorphic tokens ────────────────────────────────────────────────────────

const neuCard =
  "rounded-[1.5rem] bg-[#e0e5ec] shadow-[8px_8px_18px_#b8bec7,-8px_-8px_18px_#ffffff] dark:bg-[#252838] dark:shadow-[6px_6px_16px_#12151f,-6px_-6px_16px_#2e3248]";
const neuSmall =
  "bg-[#e0e5ec] shadow-[3px_3px_7px_#b8bec7,-3px_-3px_7px_#ffffff] dark:bg-[#252838] dark:shadow-[3px_3px_6px_#12151f,-3px_-3px_6px_#2e3248]";
const neuInset =
  "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] dark:bg-[#252838] dark:shadow-[inset_3px_3px_7px_#12151f,inset_-3px_-3px_7px_#2e3248]";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-3 py-2 rounded-xl text-sm ${neuSmall}`}>
      <p className="font-semibold text-gray-700 dark:text-white mb-1">
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="capitalize">
          {entry.name}:{" "}
          <span className="font-bold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Component ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Eye,
      labelKey: "dashboard.totalViews",
      value: "12,543",
      change: "+14%",
      positive: true,
    },
    {
      icon: MessageSquare,
      labelKey: "dashboard.comments",
      value: "342",
      change: "+8%",
      positive: true,
    },
    {
      icon: Star,
      labelKey: "dashboard.avgRating",
      value: "4.8",
      change: "+0.3",
      positive: true,
    },
    {
      icon: Users,
      labelKey: "dashboard.followers",
      value: "2,891",
      change: "+24%",
      positive: true,
    },
  ];

  const recentComments = [
    {
      id: 1,
      user: "Ahmed K.",
      comment: "Amazing food and great atmosphere!",
      rating: 5,
      time: "10 min ago",
    },
    {
      id: 2,
      user: "Sara M.",
      comment: "Love the new menu items",
      rating: 4,
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Khalid R.",
      comment: "Best coffee in town!",
      rating: 5,
      time: "3 hours ago",
    },
  ];

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      

      {/* ── KPI Cards ── */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-16"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -3 }}
            className="rounded-[1.5rem] p-5 flex flex-col gap-3
  bg-[#e8ecf3] shadow-[12px_12px_24px_#adb5c0,-12px_-12px_24px_#ffffff]
  dark:bg-[#2b2e42] dark:shadow-[8px_8px_20px_#0e1020,-8px_-8px_20px_#343750]
  transition-all"
          >
            {/* orange accent line on top */}
            <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r from-primary to-orange-400 opacity-70" />

            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${neuInset}`}
              >
                <stat.icon size={18} className="text-primary" />
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1
                ${
                  stat.positive
                    ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
                    : "text-red-500 bg-red-100 dark:bg-red-900/30"
                }`}
              >
                {stat.positive ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-700 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {t(stat.labelKey)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Area Chart ── */}
      <motion.div variants={item} className={`${neuCard} p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-700 dark:text-white">
              {t("dashboard.totalViews")} & {t("dashboard.comments")}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-primary inline-block" />{" "}
              Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-orange-300 inline-block" />{" "}
              Comments
            </span>
          </div>
        </div>
        <div className={`rounded-2xl p-4 ${neuInset}`}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={viewsData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gComments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fdba74" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fdba74" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#c8cdd5"
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#gViews)"
                dot={false}
                activeDot={{ r: 5, fill: "#f97316" }}
              />
              <Area
                type="monotone"
                dataKey="comments"
                stroke="#fdba74"
                strokeWidth={2.5}
                fill="url(#gComments)"
                dot={false}
                activeDot={{ r: 5, fill: "#fdba74" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Bar + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Bar Chart */}
        <motion.div variants={item} className={`lg:col-span-3 ${neuCard} p-6`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-700 dark:text-white">
                {t("dashboard.recentPosts")}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Views vs Likes</p>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary">
              {t("dashboard.viewAll")} <ArrowUpRight size={13} />
            </button>
          </div>
          <div className={`rounded-2xl p-4 ${neuInset}`}>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={postsPerformance}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barSize={12}
                barGap={3}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#c8cdd5"
                  strokeOpacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="#f97316" radius={[6, 6, 0, 0]} />
                <Bar dataKey="likes" fill="#fdba74" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut */}
        <motion.div variants={item} className={`lg:col-span-2 ${neuCard} p-6`}>
          <div className="mb-4">
            <h2 className="font-bold text-gray-700 dark:text-white">
              {t("dashboard.avgRating")}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Distribution</p>
          </div>
          <div className={`rounded-2xl p-3 ${neuInset}`}>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={ratingsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {ratingsData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div
                        className={`px-3 py-2 rounded-xl text-xs ${neuSmall}`}
                      >
                        <p className="font-semibold text-gray-700 dark:text-white">
                          {payload[0].name}
                        </p>
                        <p className="text-gray-400">{payload[0].value}%</p>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            {ratingsData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <span className="text-xs text-gray-400">{item.name}</span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 ms-auto">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Line Chart + Comments ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Line Chart */}
        <motion.div variants={item} className={`lg:col-span-3 ${neuCard} p-6`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-700 dark:text-white">
                {t("dashboard.followers")} Growth
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              <TrendingUp size={11} /> +24%
            </span>
          </div>
          <div className={`rounded-2xl p-4 ${neuInset}`}>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart
                data={followersGrowth}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fdba74" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#c8cdd5"
                  strokeOpacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{
                    fill: "#f97316",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#e0e5ec",
                  }}
                  activeDot={{ r: 6, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Comments */}
        <motion.div variants={item} className={`lg:col-span-2 ${neuCard} p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700 dark:text-white">
              {t("dashboard.recentComments")}
            </h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary">
              {t("dashboard.viewAll")} <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentComments.map((c) => (
              <div key={c.id} className={`p-3.5 rounded-2xl ${neuInset}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-primary ${neuSmall}`}
                    >
                      {c.user.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-white">
                      {c.user}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(c.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className="fill-primary text-primary"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {c.comment}
                </p>
                <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1.5">
                  {c.time}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CTA Banner ── */}
      <motion.div
        variants={item}
        className="rounded-[1.5rem] p-6 lg:p-8 bg-gradient-to-r from-primary to-orange-500
          shadow-[8px_8px_18px_#b8bec7,-4px_-4px_10px_#ffffff,inset_0_1px_0_rgba(255,255,255,0.15)]
          dark:shadow-[8px_8px_18px_#12151f,-4px_-4px_10px_#2e3248]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-xl lg:text-2xl font-bold mb-1">
              {t("dashboard.growTitle")}
            </h2>
            <p className="text-white/75 text-sm">
              {t("dashboard.growSubtitle")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold
              bg-white text-gray-700 shadow-[3px_3px_8px_rgba(0,0,0,0.15)] hover:shadow-[1px_1px_4px_rgba(0,0,0,0.1)] transition-all"
            >
              <Activity size={16} /> {t("dashboard.viewAnalytics")}
            </button>
            <button
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold
              bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all"
            >
              <Plus size={16} /> {t("dashboard.createCampaign")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
