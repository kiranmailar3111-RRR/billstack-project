const EmptyState = ({
  icon,
  title = "No Data Found",
  description = "There is no data available right now.",
  action,
}) => {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-5 text-slate-400">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="text-slate-500 mt-2 max-w-sm mx-auto">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;