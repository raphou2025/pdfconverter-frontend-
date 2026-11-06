// import { createContext, useCallback, useContext, useState } from 'react';
// import Toast from '../components/ui/Toast';

// const NotificationContext = createContext(null);

// function NotificationToast({ notification, dismiss }) {
//   const onClose = useCallback(() => dismiss(notification.id), [dismiss, notification.id]);

//   return (
//     <Toast
//       message={notification.message}
//       type={notification.type}
//       onClose={onClose}
//     />
//   );
// }

// export function NotificationProvider({ children }) {
//   const [notifications, setNotifications] = useState([]);
//   const notify = useCallback((message, type = 'success') => {
//     const id = `${Date.now()}-${Math.random()}`;
//     setNotifications((current) => [...current, { id, message, type }].slice(-4));
//   }, []);
//   const dismiss = useCallback((id) => {
//     setNotifications((current) => current.filter((notification) => notification.id !== id));
//   }, []);

//   return (
//     <NotificationContext.Provider value={notify}>
//       {children}
//       <div className="fixed bottom-5 right-5 z-[100] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col gap-3" aria-live="polite">
//         {notifications.map((notification) => (
//           <NotificationToast
//             key={notification.id}
//             notification={notification}
//             dismiss={dismiss}
//           />
//         ))}
//       </div>
//     </NotificationContext.Provider>
//   );
// }

// export function useNotification() {
//   const notify = useContext(NotificationContext);
//   if (!notify) {
//     throw new Error('useNotification must be used within a NotificationProvider');
//   }
//   return notify;
// }


import { createContext, useContext } from 'react';
import { showToast } from '../components/ui/Toast';

// We keep the context so you don't have to change all your `notify(...)` calls across the app
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  // This acts as a bridge between your old code and the new react-hot-toast library
  const notify = (message, type = 'success') => {
    showToast(message, type);
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const notify = useContext(NotificationContext);
  if (!notify) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return notify;
}