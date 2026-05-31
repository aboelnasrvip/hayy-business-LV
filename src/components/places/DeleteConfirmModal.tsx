import { Trash2, X } from 'lucide-react';

const neu = "bg-[#e0e5ec] shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff] dark:bg-[#252838] dark:shadow-[4px_4px_10px_#12151f,-4px_-4px_10px_#2e3248]";

interface Props {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({ title, description, onConfirm, onCancel, isLoading }: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className={`${neu} rounded-[2rem] p-8 max-w-sm w-full`}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-700 dark:text-white text-lg">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-full text-sm font-semibold text-gray-500 dark:text-gray-400 ${neu} transition-all disabled:opacity-50`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-red-500 to-rose-600
              shadow-[3px_3px_8px_#b8bec7,-1px_-1px_4px_#ffffff] dark:shadow-[3px_3px_8px_#12151f,-1px_-1px_4px_#2e3248]
              hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DeleteConfirmModal;