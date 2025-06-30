import './index.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import App from './App'
import { AuthProvider, useAuth } from './context/AuthContext';
import ProjectsList from "./pages/admin/ProjectsList.jsx";
import RoutesComponent from './routes/Routes';
import { SnackbarProvider } from './components/ui/Snackbar.jsx';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div className="loader"></div></div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (!children) {
        return <div className="flex items-center justify-center h-screen text-red-500">No content</div>;
    }
    return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <SnackbarProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={<App />}> {/* Use /* to match all nested routes */}
                            <Route
                                path="*"
                                element={
                                    <ProtectedRoute>
                                        <RoutesComponent />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </SnackbarProvider>
        </AuthProvider>
    </React.StrictMode>
)
