import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/Login';

const Placeholder = ({ title }) => <div>{title}</div>;

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Placeholder title="Dashboard" />} />
        <Route path="applications" element={<Placeholder title="Applications" />} />
        <Route path="gallery" element={<Placeholder title="Gallery" />} />
        <Route path="leadership" element={<Placeholder title="Leadership" />} />
        <Route path="library" element={<Placeholder title="Library" />} />
        <Route path="mvp" element={<Placeholder title="MVP" />} />
        <Route path="news" element={<Placeholder title="News" />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}
