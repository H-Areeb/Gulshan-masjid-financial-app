import { toast } from 'react-hot-toast';

// Add at the top, after imports
const showThemedToast = (type, message) => {
  toast.custom(
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
        type === 'success'
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-red-50 border-red-200 text-red-700'
      }`}
    >
      {type === 'success' ? (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="font-semibold">{message}</span>
    </div>,
    { duration: 3000 }
  );
};

export { showThemedToast };