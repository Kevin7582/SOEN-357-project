import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Eye,
} from "lucide-react";

const accuracyData = [
  {
    test: "Immediate Recall",
    "Image-Based": 82,
    "Translation-Based": 68,
  },
  {
    test: "Delayed Recall",
    "Image-Based": 75,
    "Translation-Based": 55,
  },
];

const responseTimeData = [
  { test: "Immediate", "Image-Based": 2.1, "Translation-Based": 3.0 },
  { test: "Delayed", "Image-Based": 2.4, "Translation-Based": 3.5 },
];

const radarData = [
  { metric: "Accuracy", "Image-Based": 82, "Translation-Based": 68 },
  { metric: "Speed", "Image-Based": 78, "Translation-Based": 60 },
  { metric: "Retention", "Image-Based": 75, "Translation-Based": 55 },
  { metric: "Engagement", "Image-Based": 85, "Translation-Based": 65 },
  { metric: "Ease of Use", "Image-Based": 88, "Translation-Based": 80 },
];

const retentionCurve = [
  { day: "Day 1", "Image-Based": 82, "Translation-Based": 68 },
  { day: "Day 3", "Image-Based": 79, "Translation-Based": 62 },
  { day: "Day 7", "Image-Based": 75, "Translation-Based": 55 },
  { day: "Day 14", "Image-Based": 72, "Translation-Based": 47 },
  { day: "Day 30", "Image-Based": 68, "Translation-Based": 40 },
];

const statCards = [
  {
    label: "Image-Based Accuracy",
    sub: "Immediate recall",
    value: "82%",
    delta: "+14%",
    icon: Target,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    label: "Delayed Recall",
    sub: "After 7 days",
    value: "75%",
    delta: "+20%",
    icon: TrendingUp,
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    label: "Avg. Response Time",
    sub: "Image-Based group",
    value: "2.1s",
    delta: "0.9s faster",
    icon: Clock,
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    label: "Retention Gap",
    sub: "Delayed vs immediate",
    value: "7%",
    delta: "vs 13% gap",
    icon: BookOpen,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-lg p-3 text-sm">
        <p className="text-slate-600 mb-2 text-xs font-medium">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-slate-600 text-xs">{entry.name}:</span>
            <span className="font-semibold text-slate-800 text-xs">{entry.value}{entry.name.includes("Time") ? "s" : "%"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Results() {
  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Eye size={12} />
            <span>User Study — Controlled Experiment</span>
          </div>
          <h1 className="text-slate-800 mb-1" style={{ fontWeight: 700, fontSize: 24 }}>
            Study Results & Analysis
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            Findings from a controlled user study comparing image-based and translation-based
            vocabulary learning across immediate and delayed recall tests.
          </p>
        </div>
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, sub, value, delta, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div
                className="inline-flex p-2 rounded-xl mb-3"
                style={{ background: bg }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
              <div className="text-xs text-slate-500 mb-2">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
              <div
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#f0fdf4", color: "#16a34a" }}
              >
                <TrendingUp size={10} />
                {delta}
              </div>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Accuracy bar chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="mb-5">
              <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                Recall Accuracy Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Percentage of correct answers across both test conditions
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={accuracyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="test"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                />
                <Bar
                  dataKey="Image-Based"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="Translation-Based"
                  fill="#e2e8f0"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Response time chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="mb-5">
              <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                Average Response Time
              </h3>
              <p className="text-xs text-slate-400">
                Seconds per answer — lower is better
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={responseTimeData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="test"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 4]}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}s`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                />
                <Bar
                  dataKey="Image-Based"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="Translation-Based"
                  fill="#e2e8f0"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Retention curve */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                Memory Retention Over Time
              </h3>
              <p className="text-xs text-slate-400">
                Projected recall accuracy following Ebbinghaus forgetting curve
              </p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full border border-amber-100">
              Projected
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={retentionCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[30, 100]}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: "#64748b" }}
              />
              <Line
                type="monotone"
                dataKey="Image-Based"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Translation-Based"
                stroke="#cbd5e1"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#cbd5e1", strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar + key observations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="mb-5">
              <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                Multi-Dimensional Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Across accuracy, speed, retention, engagement and usability
              </p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Radar
                  name="Image-Based"
                  dataKey="Image-Based"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
                <Radar
                  name="Translation-Based"
                  dataKey="Translation-Based"
                  stroke="#cbd5e1"
                  fill="#cbd5e1"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#64748b" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Key observations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="mb-5">
              <h3 className="text-slate-800 text-sm mb-1" style={{ fontWeight: 600 }}>
                Key Observations
              </h3>
              <p className="text-xs text-slate-400">
                Summary of findings from the user study
              </p>
            </div>
            <div className="space-y-3">
              {[
                {
                  icon: CheckCircle2,
                  color: "#10b981",
                  bg: "#f0fdf4",
                  text: "Image-based learners outperformed translation group in both immediate and delayed recall tests.",
                },
                {
                  icon: TrendingUp,
                  color: "#6366f1",
                  bg: "#eef2ff",
                  text: "The accuracy gap widened in delayed recall (+20%), suggesting stronger long-term encoding.",
                },
                {
                  icon: Clock,
                  color: "#f59e0b",
                  bg: "#fffbeb",
                  text: "Response times were 30% faster in the image-based group, indicating reduced cognitive effort.",
                },
                {
                  icon: AlertCircle,
                  color: "#ef4444",
                  bg: "#fef2f2",
                  text: "Limitations include small sample size and short study duration — future work needed.",
                },
                {
                  icon: Lightbulb,
                  color: "#8b5cf6",
                  bg: "#f5f3ff",
                  text: "Results align with Paivio's Dual Coding Theory — visual + verbal encoding strengthens memory.",
                },
              ].map(({ icon: Icon, color, bg, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div
                    className="p-1.5 rounded-lg shrink-0 mt-0.5"
                    style={{ background: bg }}
                  >
                    <Icon size={12} style={{ color }} />
                  </div>
                  <p className="text-xs text-slate-600" style={{ lineHeight: 1.6 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50">
            <h3 className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>
              Raw Data Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Group
                  </th>
                  <th className="text-center px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Accuracy (Immediate)
                  </th>
                  <th className="text-center px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Accuracy (Delayed)
                  </th>
                  <th className="text-center px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Avg Response Time
                  </th>
                  <th className="text-center px-6 py-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Retention Drop
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="font-medium text-slate-700">Image-Based (Group A)</span>
                    </div>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span className="font-semibold text-indigo-600">82%</span>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span className="font-semibold text-indigo-600">75%</span>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span className="font-semibold text-indigo-600">2.1s</span>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-700">
                      −7%
                    </span>
                  </td>
                </tr>
                <tr className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="font-medium text-slate-500">Translation-Based (Group B)</span>
                    </div>
                  </td>
                  <td className="text-center px-6 py-4 text-slate-500">68%</td>
                  <td className="text-center px-6 py-4 text-slate-500">55%</td>
                  <td className="text-center px-6 py-4 text-slate-500">3.0s</td>
                  <td className="text-center px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
                      −13%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Conclusion */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
              <Lightbulb size={20} className="text-indigo-300" />
            </div>
            <div>
              <h3 className="text-white mb-2 text-sm" style={{ fontWeight: 600 }}>
                Conclusion
              </h3>
              <p className="text-indigo-200 text-sm" style={{ lineHeight: 1.7 }}>
                This project explored the effectiveness of image-based vocabulary learning compared
                to translation-based methods. Results indicate that visual association improves both
                recall accuracy (+14% immediate, +20% delayed) and response speed (0.9s faster). From
                an HCI perspective, this demonstrates how interface design can directly impact learning
                outcomes — supporting Paivio's Dual Coding Theory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
