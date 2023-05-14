import React from 'react';
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
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);