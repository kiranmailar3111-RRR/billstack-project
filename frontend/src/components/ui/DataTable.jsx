import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const DataTable = ({
  title,
  subtitle,
  search,
  setSearch,
  columns,
  children,
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems,
  actionButton,
}) => {
  return (
    <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {title}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full sm:w-72 bg-slate-100 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {actionButton}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="text-left px-6 py-4 text-sm font-black text-slate-700 uppercase tracking-wide"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {children}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div className="text-sm text-slate-500">
          Showing total{" "}
          <span className="font-bold text-slate-800">
            {totalItems}
          </span>{" "}
          records
        </div>

        <div className="flex items-center gap-2">
          
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
            className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="px-5 py-2 rounded-2xl bg-blue-600 text-white text-sm font-bold">
            {currentPage}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;