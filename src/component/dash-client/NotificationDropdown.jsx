import React from "react"; 
import { useNavigate } from "react-router-dom";
import "../../CSS/NotificationDropdown.css";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationDropdown = ({onClose}) => {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead } = useNotifications();

  const handleNotificationClick = async (notification) => {
    // Mark the notification as read
    await markAsRead(notification._id);

    // Determine type prefix (donation or exchange) and navigate accordingly
    if (notification.type.startsWith("donation")) {
      navigate('/don', {
        state: { focusDonationId: notification.donation?._id }
      });
    } else if (notification.type.startsWith("exchange")) {
      navigate('/exchange', {
        state: { focusExchangeId: notification.exchange?._id }
      });
    } else {
      console.warn("Unhandled notification type:", notification.type);
    }
    onClose();
  };

  return (
    <div className="notification-dropdown">
      <h4>Notifications</h4>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li 
              key={notification._id} 
              className={notification.read ? "read" : "unread"}
              onClick={() => handleNotificationClick(notification)}
              style={{ cursor: 'pointer' }}
            >
              <p>
              {notification.message}
              </p>
              <span className="notification-time">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;
