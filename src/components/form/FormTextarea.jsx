export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  rows = 3,
  icon: Icon,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-violet-400" />}
        {label}
        {required && <span className="text-pink-400 text-xs">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500
          bg-white/5 border transition-all duration-200 outline-none resize-none
          focus:bg-white/8 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/20
          ${error
            ? "border-pink-500/60 ring-2 ring-pink-500/15"
            : "border-white/10 hover:border-white/20"
          }
        `}
      />
      {error && (
        <p className="text-xs text-pink-400 flex items-center gap-1 mt-0.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
