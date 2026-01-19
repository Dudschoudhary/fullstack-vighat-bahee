import { createBrowserRouter, Navigate } from "react-router-dom";
import VigatBahee from "../components/VigatBahee";
import VigatBaheeLayout from "../components/VigatBaheeLayout";
import AddNewEntries from "../common/AddNewEntries";
import Login from "../components/Login";
import AboutUs from "../google adsense/AboutUs";
import TermsAndConditions from "../google adsense/TermsAndConditions";
import ContactUs from "../google adsense/ContactUs";
import Footer from "../google adsense/Footer";
import DMCAPolicy from "../google adsense/DMCAPolicy";
import PrivacyPolicy from "../google adsense/ PrivacyPolicy";
import PersonalEntryForm from "../components/PersonalEntryForm";
import ViewEntriesByType from "../components/ViewEntriesByType";
import Home from "../google adsense/Home";

interface RouteProps {
  element: React.ReactElement;
}

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute: React.FC<RouteProps> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<RouteProps> = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/bahee" replace /> : element;
};

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <PublicRoute element={<Home />} />,
      },
      {
        path: "bahee",
        element: <ProtectedRoute element={<VigatBahee />} />,
      },
      {
        path: "bahee-layout",
        element: <ProtectedRoute element={<VigatBaheeLayout />} />,
      },
      {
        path: "new-bahee",
        element: <ProtectedRoute element={<AddNewEntries />} />,
      },
      {
        path: "personal-bahee",
        element: <ProtectedRoute element={<PersonalEntryForm />} />,
      },
      {
        path: "view-entries",
        element: <ProtectedRoute element={<ViewEntriesByType />} />,
      },
      {
        path: "login",
        element: <PublicRoute element={<Login />} />,
      },
      {
        path: "about-us",
        element: <PublicRoute element={<AboutUs />} />,
      },
      {
        path: "privacy-policy",
        element: <PublicRoute element={<PrivacyPolicy />} />,
      },
      {
        path: "terms-and-conditions",
        element: <PublicRoute element={<TermsAndConditions />} />,
      },
      {
        path: "contact",
        element: <PublicRoute element={<ContactUs />} />,
      },
      {
        path: "footer",
        element: <ProtectedRoute element={<Footer />} />,
      },
      {
        path: "dmca-policy",
        element: <PublicRoute element={<DMCAPolicy />} />,
      },
    ],
  },
]);

export default router;