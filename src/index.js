import React, { createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/Home/Home';
import SignIn from './components/Authentification/SignIn';
import SignUp from './components/Authentification/SignUp';
import { AuthProvider } from './contexts/AuthContext';
import SubmitRequest from './components/Request/SubmitRequest';
import SignOut from './components/Authentification/SignOut';
import ActionCable from 'actioncable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotifProvider from './contexts/NotificationContext';
import Notification from './components/Shared/Notifications/Notification';
import RequestDetail from './components/Request/RequestDetail';
import Conversation from './components/Conversation/Conversation';





const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign_in",
    element: <SignIn/>,
  },
  {
    path: "/sign_up",
    element: <SignUp/>,
  },
  {
    path: "/submit_request",
    element: <SubmitRequest/>,
  },
  {
    path: "/sign_out",
    element: <SignOut/>,
  },
  {
    path: "/request/:requestId",
    element: <RequestDetail/>,
  },
  {
    path:"/conversation",
    element: <Conversation/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotifProvider>
          <RouterProvider router={router} />
          <ToastContainer/>
          <Notification/>
      </NotifProvider>
    </AuthProvider>
  </React.StrictMode>
);