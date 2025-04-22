import React from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./ProtectedRoutes";
import CenterScreenLayout from "../pages/layouts/CenterScreenLayout";
import PortalLayout from "../pages/layouts/PortalLayout";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Projects from "../pages/Projects";
import Members from "../pages/Members";
import Clients from "../pages/Clients";

export default [
  {
    element: <CenterScreenLayout />,
    children: [
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/", element: <Navigate to="/signin" replace /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <PortalLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/projects", element: <Projects /> },
      {
        path: "/members",
        element: (
          <AdminRoute>
            <Members />
          </AdminRoute>
        ),
      },
      {
        path: "/clients",
        element: (
          <AdminRoute>
            <Clients />
          </AdminRoute>
        ),
      },
      { path: "*", element: <Navigate to="/projects" replace /> },
    ],
  },
];
