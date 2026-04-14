import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/ArticlesList';
import ArticleEditor from './pages/ArticleEditor';
import ImageSlots from './pages/ImageSlots';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="articoli" element={<ArticlesList />} />
        <Route path="articoli/nuovo" element={<ArticleEditor />} />
        <Route path="articoli/:id/modifica" element={<ArticleEditor />} />
        <Route path="immagini" element={<ImageSlots />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
