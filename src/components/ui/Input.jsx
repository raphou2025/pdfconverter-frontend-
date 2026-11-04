export default function Input({ label, type = "text", value, onChange, placeholder, required, error }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-400 text-sm mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-gray-800 text-white p-3 rounded-lg border outline-none transition
          ${error ? "border-red-500" : "border-gray-700 focus:border-emerald-400"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}