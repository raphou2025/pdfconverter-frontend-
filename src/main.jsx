// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import { AuthProvider } from './context/AuthContext.jsx';
// import { NotificationProvider } from './context/NotificationContext.jsx';
// import { ThemeProvider } from './context/ThemeContext.jsx';
// import './styles.css';
// import './i18n.js';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <NotificationProvider>
//       <ThemeProvider>
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </ThemeProvider>
//     </NotificationProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastContainer } from './components/ui/Toast'; // 🚨 Import the ToastContainer
import './styles.css';
import './i18n.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastContainer /> {/* 🚨 Add this here */}
          <App />
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  </React.StrictMode>
);