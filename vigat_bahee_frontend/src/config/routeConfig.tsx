// src/router/index.js or router.js
import { createBrowserRouter } from "react-router-dom";
import VigatBahee from "../components/VigatBahee";
import VigatBaheeLayout from "../components/VigatBaheeLayout";
import AddNewEntries from "../common/AddNewEntries";
import Login from "../components/Login";
import AboutUs from "../google adsense/AboutUs"
import PrivacyPolicy from "../google adsense/ PrivacyPolicy";
import TermsAndConditions from "../google adsense/TermsAndConditions";
import ContactUs from "../google adsense/ContactUs";
import Footer from "../google adsense/Footer";
import DMCAPolicy from "../google adsense/DMCAPolicy";

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
      {
        path: "/about-us",
        element: <AboutUs/>
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy/>
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions/>
      },
      {
        path: "/contact",
        element: <ContactUs/>
      },
      {
        path: "/footer",
        element: <Footer/>
      },
      {
        path: "/dmca-policy",
        element: <DMCAPolicy/>
      }
    ]
  }
]);

export default router;