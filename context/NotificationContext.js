'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMockLocations, subscribeToMockData } from '@/lib/mock-data';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => {
      const next = [...prev, { id, message, type }];
      return next.length > 2 ? next.slice(next.length - 2) : next;
    });
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  }, []);

  useEffect(() => {
    let previousNotificationsState = {}; // To track notification status per dealership

    const checkForNotifications = () => {
      const currentLocations = getMockLocations();
      currentLocations.forEach(location => {
        if (location.type === 'dealership') {
          const currentStatus = location.pickupNotificationLevel;
          const previousStatus = previousNotificationsState[location.id];

          if (currentStatus && !previousStatus) {
            const pct = location.maxCapacity
              ? ((location.currentBatteryCount / location.maxCapacity) * 100).toFixed(0)
              : '0';
            addNotification(
              `Pickup needed: ${location.name} is at ${pct}% capacity!`,
              currentStatus
            );
          }
          // If a pickup happens, we might want to clear existing notification for that location
          if (!currentStatus && previousStatus) {
            // Optional: remove notification if capacity drops below threshold (e.g., after pickup)
            setNotifications(prev => prev.filter(n => !n.message.includes(location.name)));
          }
          previousNotificationsState[location.id] = currentStatus;
        }
      });
    };

    checkForNotifications(); // Initial check
    const unsubscribe = subscribeToMockData(checkForNotifications);
    return () => unsubscribe();
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      <div className="notification-container">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification-toast ${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>
      {/* Basic styling for notifications */}
      <style jsx global>{`
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .notification-toast {
          background-color: #333;
          color: white;
          padding: 10px 15px;
          border-radius: 5px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          opacity: 0.95;
          min-width: 250px;
          font-size: 0.9em;
        }
        .notification-toast.warning {
          background-color: #ffc107; /* Bootstrap yellow */
          color: #333;
        }
        .notification-toast.error {
          background-color: #dc3545; /* Bootstrap red */
        }
        .notification-toast.info {
            background-color: #17a2b8; /* Bootstrap blue */
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
