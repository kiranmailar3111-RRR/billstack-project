const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      
      <label className="text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          h-14
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-5
          text-slate-800
          placeholder:text-slate-400
          outline-none
          transition-all
          focus:bg-white
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />
    </div>
  );
};

export default InputField;