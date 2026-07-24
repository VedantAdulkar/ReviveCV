import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './domains/branches/pages/Dashboard';
import { Workspace } from './domains/branches/pages/Workspace';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-slate-200 dark:selection:bg-slate-800">
        <Routes>
          {/* F1 Dashboard becomes the home page */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/branches/:id" element={<Workspace />} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
