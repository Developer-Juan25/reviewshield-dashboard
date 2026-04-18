export default function StatsBar({ total, negative, avgRating }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
          Total Reviews
        </p>
        <p className="text-3xl font-bold text-white">{total}</p>
        <p className="text-gray-500 text-xs mt-1">Last 30 days</p>
      </div>
      <div className="bg-gray-900 border border-red-900/40 rounded-xl p-5">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
          Negative Alerts
        </p>
        <p className="text-3xl font-bold text-red-400">{negative}</p>
        <p className="text-gray-500 text-xs mt-1">Requires attention</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
          Avg Rating
        </p>
        <p className="text-3xl font-bold text-yellow-400">⭐ {avgRating}</p>
        <p className="text-gray-500 text-xs mt-1">Across all platforms</p>
      </div>
    </div>
  );
}
