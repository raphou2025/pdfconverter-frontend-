export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}