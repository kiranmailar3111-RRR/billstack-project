const SelectField = ({
  label,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div className="space-y-2">
      
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          h-14
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          px-5
          text-slate-800
          outline-none
          transition-all
          focus:bg-white
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;