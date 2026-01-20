import { createBrowserRouter } from "react-router-dom";
import VigatBahee from "../components/VigatBahee";
import VigatBaheeLayout from "../components/VigatBaheeLayout";
import AddNewEntries from "../common/AddNewEntries";
import AboutUs from "../google adsense/AboutUs";
import TermsAndConditions from "../google adsense/TermsAndConditions";
import ContactUs from "../google adsense/ContactUs";
import Footer from "../google adsense/Footer";
import DMCAPolicy from "../google adsense/DMCAPolicy";
import PrivacyPolicy from "../google adsense/ PrivacyPolicy";
import PersonalEntryForm from "../components/PersonalEntryForm";
import ViewEntriesByType from "../components/ViewEntriesByType";
import Home from "../google adsense/Home";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "bahee",
        element: <VigatBahee />,
      },
      {
        path: "bahee-layout",
        element: <VigatBaheeLayout />,
      },
      {
        path: "new-bahee",
        element: <AddNewEntries />,
      },
      {
        path: "personal-bahee",
        element: <PersonalEntryForm />,
      },
      {
        path: "view-entries",
        element: <ViewEntriesByType />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "footer",
        element: <Footer />,
      },
      {
        path: "dmca-policy",
        element: <DMCAPolicy />,
      },
    ],
  },
]);

export default router;