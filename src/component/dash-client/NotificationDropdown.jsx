import React from "react";
import "../../CSS/NotificationDropdown.css"; // Create and style this CSS file as needed

const NotificationDropdown = ({ notifications, loading }) => {
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
            <li key={notification._id} className={notification.read ? "read" : "unread"}>
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
