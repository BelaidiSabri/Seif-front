import React from "react";
import { useNavigate } from "react-router-dom";
import "../../CSS/NotificationDropdown.css";
import { useNotifications } from "../../contexts/NotificationContext";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { notifications, loading, markAsRead } = useNotifications();

  const handleNotificationClick = async (notification) => {
    // If notification is related to an exchange, navigate to exchange page
    if (notification.type === 'exchange') {
      await markAsRead(notification._id);
      navigate('/exchanges', { 
        state: { 
          focusExchangeId: notification.exchangeId 
        } 
      });
    }
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
              style={{ cursor: notification.type === 'exchange' ? 'pointer' : 'default' }}
            >
              {notification.message}
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