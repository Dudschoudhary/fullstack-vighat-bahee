// src/router/index.js or router.js
import { createBrowserRouter } from "react-router-dom";
import VigatBahee from "../components/VigatBahee";
import VigatBaheeLayout from "../components/VigatBaheeLayout";
import AddNewEntries from "../common/AddNewEntries";
import Login from "../components/Login";
import EntryForm from "../components/EntryForm";

// Define the routes

const router = createBrowserRouter([
  {
    path: "/",
    // element: <VigatBahee />,
    children: [
      {
        path: "/bahee",
        element: <VigatBahee/>
      },
      {
        path: "/bahee-layout",
        element: <VigatBaheeLayout/>
      },
      {
        path: "/new-bahee",
        element: <AddNewEntries/>
      },
      {
        path: "/login",
        element: <Login/>
      },
    ]
  }
]);

export default router;