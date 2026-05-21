import Modal from "./Modal";
import { Trash2 } from "lucide-react";

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle="Please confirm your action."
      width="max-w-md"
    >
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-5">
          <Trash2 className="text-red-600" size={36} />
        </div>

        <p className="text-slate-500">
          {description}
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-slate-300 font-medium hover:bg-slate-50 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-medium transition"
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;