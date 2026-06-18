import { useNotification } from '../../context/NotificationContext';

function Toast() {
  const { notification, clear } = useNotification();

  if (!notification) return null;

  return (
    <div className="toast-wrap">
      <div className={`toast toast-${notification.type}`}>
        <span>{notification.message}</span>
        <button type="button" onClick={clear} className="toast-close">
          x
        </button>
      </div>
    </div>
  );
}

export default Toast;
