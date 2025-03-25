import React, { useEffect, useState } from "react";
import { onValue, ref, get } from "firebase/database";
import { db } from "../../../config/firebase-config";
import { useContext } from "react";
import { AppContext } from "../../../store/app-context";
import { deleteNotification } from "../../../services/notification.service";
import { useRef } from "react";

const NotificationListener = () => {
  const { userData } = useContext(AppContext);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (userData) {
      const userNotificationsRef = ref(db, `users/${userData.username}/notifications`);
  
      const unsubscribe = onValue(userNotificationsRef, async (snapshot) => {
        if (!snapshot.exists()) return;
  
        const userNotifications = snapshot.val();
        const notificationIds = Object.keys(userNotifications);
        const latestNotificationId = notificationIds[notificationIds.length - 1];
  
        const notificationRef = ref(db, `notifications/${latestNotificationId}`);
        const notificationSnapshot = await get(notificationRef);
  
        if (notificationSnapshot.exists()) {
          const newNotification = notificationSnapshot.val();
  
          if (newNotification.type === "message") {
            setNotification({
              title: newNotification.title,
              message: newNotification.notification,
            });

            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
  
            timeoutRef.current = setTimeout(() => {
              console.log("Deleting notification...");
              setNotification(null);
              deleteNotification(userData.username, latestNotificationId);
            }, 5000);
          }
        }
      });
  
      return () => {
        unsubscribe();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [userData]);

  return (
    notification && (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        <strong>{notification.title}</strong>
        <p>{notification.message}</p>
      </div>
    )
  );
};

export default NotificationListener;
