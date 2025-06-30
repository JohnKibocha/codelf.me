import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsList from '../pages/admin/ProjectsList';
import ProjectForm from '../pages/admin/ProjectForm';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import BlogManager from '../pages/admin/BlogManager';
import BlogEditor from '../pages/admin/BlogEditor';
import BlogArticlePreviewPage from '../pages/admin/BlogArticlePreviewPage';

export default function RoutesComponent() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/projects/new" element={<ProjectForm />} />
        <Route path="/projects/:id/edit" element={<ProjectForm />} />
        <Route path="/blogs" element={<BlogManager />} />
        <Route path="/blogs/:id/edit" element={<BlogEditor />} />
        <Route path="/blogs/:id/preview" element={<BlogArticlePreviewPage />} />
      </Route>
      {/* Redirect unknown routes to dashboard or 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
