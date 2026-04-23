import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function getWeekLabel(monday) {
  return monday.toLocaleDateString("en", { month: "short", day: "numeric" });
}

function buildWeeklyData(reviews) {
  // Build a map of the last 8 weeks (keyed by Monday ISO date)
  const weeks = {};
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const dow = d.getDay(); // 0=Sun
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
    monday.setHours(0, 0, 0, 0);
    const key = monday.toISOString().split("T")[0];
    weeks[key] = { week: key, label: getWeekLabel(monday), count: 0, totalRating: 0 };
  }

  reviews.forEach((r) => {
    if (!r.timestamp) return;
    const date = new Date(r.timestamp);
    const dow = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1));
    monday.setHours(0, 0, 0, 0);
    const key = monday.toISOString().split("T")[0];
    if (weeks[key]) {
      weeks[key].count++;
      weeks[key].totalRating += r.rating ?? 0;
    }
  });

  return Object.values(weeks).map((w) => ({
    label: w.label,
    reviews: w.count,
    avgRating: w.count > 0 ? parseFloat((w.totalRating / w.count).toFixed(1)) : null,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "reviews"
            ? `📋 ${p.value} review${p.value !== 1 ? "s" : ""}`
            : `⭐ ${p.value} avg`}
        </p>
      ))}
    </div>
  );
};

export default function ReviewChart({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const data = buildWeeklyData(reviews);
  const hasAnyData = data.some((d) => d.reviews > 0);
  if (!hasAnyData) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">Rating trend &amp; volume</h3>
        <span className="text-gray-500 text-xs">Last 8 weeks</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 5]}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="reviews"
            fill="#2563eb"
            opacity={0.75}
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgRating"
            stroke="#facc15"
            strokeWidth={2}
            dot={{ fill: "#facc15", r: 3, strokeWidth: 0 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-5 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-blue-600 opacity-75 inline-block" />
          Reviews
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-0.5 bg-yellow-400 inline-block" />
          Avg Rating
        </span>
      </div>
    </div>
  );
}
