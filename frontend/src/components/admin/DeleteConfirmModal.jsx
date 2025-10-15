import { FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

const DeleteConfirmModal = ({ userName, onClose, onConfirm, isLoading = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Delete User?
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to delete <strong>{userName}</strong>? This action cannot be
          undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;