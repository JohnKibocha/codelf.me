// src/App.jsx
import useAutoTheme from './hooks/useAutoTheme';
import { Outlet } from 'react-router-dom';

function App() {
    useAutoTheme();

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default App;
