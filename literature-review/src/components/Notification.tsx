interface NotificationProps {
  message: string;
  type: string;
}

export default function Notification({ message, type }: NotificationProps) {
  return (
    <div
      className={`fixed top-20 right-5 py-4 px-6 rounded-lg z-50 animate-slide-in ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`}
    >
      {message}
    </div>
  );
}
