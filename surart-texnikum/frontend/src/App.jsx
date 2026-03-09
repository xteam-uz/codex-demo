import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home';
import NewsPage from './pages/News';
import NewsDetailPage from './pages/NewsDetail';
import GalleryPage from './pages/Gallery';
import LeadershipPage from './pages/Leadership';
import LibraryPage from './pages/Library';
import LocationPage from './pages/Location';
import MVPPage from './pages/MVP';
import PearsonPage from './pages/Pearson';
import ApplicationPage from './pages/Application';
import ContactPage from './pages/Contact';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.25 }}
      >
        <Layout>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/leadership" element={<LeadershipPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/mvp" element={<MVPPage />} />
            <Route path="/pearson" element={<PearsonPage />} />
            <Route path="/application" element={<ApplicationPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </motion.div>
    </AnimatePresence>
  );
}
