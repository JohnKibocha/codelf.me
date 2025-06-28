import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsList from '../pages/admin/ProjectsList';
import ProjectForm from '../pages/admin/ProjectForm';
import Dashboard from '../pages/Dashboard';

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/new" element={<ProjectForm />} />
      <Route path="/projects/:id/edit" element={<ProjectForm />} />
      {/* Redirect unknown routes to dashboard or 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
