import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Venues from './pages/Venues';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Search from './pages/Search';
import Availability from './pages/Availability';
import Services from './pages/Services';

// Destination Gambia Portal
import DestinationGambia from './pages/DestinationGambia';
import WhyGambia from './pages/WhyGambia';
import Attractions from './pages/Attractions';
import Hotels from './pages/Hotels';
import TravelInfo from './pages/TravelInfo';
import Investment from './pages/Investment';

// Additional Pages
import Downloads from './pages/Downloads';
import Careers from './pages/Careers';
import CareerApply from './pages/CareerApply';
import Procurement from './pages/Procurement';
import PlanYourEvent from './pages/PlanYourEvent';

import { initializeData } from './store';

// Initialize data on app load
initializeData();

const adminPortalUrl = import.meta.env.VITE_ADMIN_PORTAL_URL?.trim();
const embeddedAdminEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_EMBEDDED_ADMIN === 'true';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminRedirect() {
  useEffect(() => {
    if (adminPortalUrl) {
      window.location.replace(adminPortalUrl);
    }
  }, []);

  return (
    <div className="pt-28 min-h-[60vh] px-4 flex items-center justify-center">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-bold text-[#1F85A8]">Redirecting to the admin portal</h1>
        <p className="mt-3 text-gray-600">
          For security, administration is handled on a separate portal.
        </p>
      </div>
    </div>
  );
}

function AdminUnavailable() {
  return (
    <div className="pt-28 min-h-[60vh] px-4 flex items-center justify-center">
      <div className="max-w-lg text-center">
        <h1 className="text-2xl font-bold text-[#1F85A8]">Admin access is not available here</h1>
        <p className="mt-3 text-gray-600">
          For security, the public site does not expose the embedded admin in this environment.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/services" element={<Services />} />
            <Route path="/search" element={<Search />} />
            
            {/* Destination Gambia Portal */}
            <Route path="/destination" element={<DestinationGambia />} />
            <Route path="/destination/why-gambia" element={<WhyGambia />} />
            <Route path="/destination/attractions" element={<Attractions />} />
            <Route path="/destination/hotels" element={<Hotels />} />
            <Route path="/destination/travel-info" element={<TravelInfo />} />
            <Route path="/destination/investment" element={<Investment />} />
            
            {/* Additional Pages */}
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/apply/:jobId" element={<CareerApply />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/plan-your-event" element={<PlanYourEvent />} />
            
            {/* Admin */}
            <Route
              path="/admin"
              element={
                adminPortalUrl
                  ? <AdminRedirect />
                  : embeddedAdminEnabled
                    ? <Admin />
                    : <AdminUnavailable />
              }
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

