import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");
  const baseURL = "http://localhost:5000";

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${baseURL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setNotifications(response.data.notifications);
      const unread = response.data.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId = null) => {
    try {
      let endpoint = `${baseURL}/notifications/mark-read`;
      const requestBody = notificationId ? { notificationId } : {};

      await axios.put(endpoint, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      setNotifications(prev => 
        notificationId
          ? prev.map(n => 
              n._id === notificationId 
                ? { ...n, read: true } 
                : n
            )
          : prev.map(n => ({ ...n, read: true }))
      );

      // Update unread count
      setUnreadCount(notificationId 
        ? prev => prev - 1 
        : 0
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        loading, 
        refreshNotifications: fetchNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};