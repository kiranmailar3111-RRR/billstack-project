import { X } from "lucide-react";

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-4xl",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative w-full ${width} bg-white rounded-[32px] shadow-[0_20px_80px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden animate-in fade-in zoom-in duration-200`}
        >
          
          {/* Header */}
          <div className="px-4 md:px-8 py-5 md:py-6 border-b border-slate-100 flex items-start justify-between">
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h2>

              {subtitle && (
                <p className="text-slate-500 text-sm mt-2">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-8 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;