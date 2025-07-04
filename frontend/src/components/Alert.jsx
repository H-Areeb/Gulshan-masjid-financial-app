import { FiCheckCircle, FiAlertCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const alertTypes = {
  success: {
    icon: <FiCheckCircle className="text-emerald-500" />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-600',
  },
  error: {
    icon: <FiXCircle className="text-red-500" />,
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-600',
  },
  warning: {
    icon: <FiAlertCircle className="text-yellow-500" />,
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-yellow-600',
  },
  info: {
    icon: <FiInfo className="text-blue-500" />,
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-600',
  },
};

const Alert = ({ type = 'info', message }) => {
  const style = alertTypes[type] || alertTypes.info;

  return (
    <div className={`flex items-start gap-3 border px-4 py-3 rounded-md shadow-sm ${style.bg} ${style.border}`}>
      <div className="mt-1">{style.icon}</div>
      <div className={`text-sm font-medium ${style.text}`}>{message}</div>
    </div>
  );
};

export default Alert;
