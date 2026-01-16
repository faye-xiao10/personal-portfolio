// 1. React and core libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// 2. Third-party libraries
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 3. Components/pages (sorted alphabetically or by type)
import RootRouterPage from './pages/RootRouterPage';

// import Footer from './components/Footer'
import AppLayout from './AppLayout';
import SkillPage from './pages/SkillNodePage';

import './index.css';
import { SkillTreeProvider } from './contexts/SkillTreeContext';
// import './tailwind.css';

const Root: React.FC = () => (

    <SkillTreeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
          <Route path="/*" element={<RootRouterPage />} />
          
          </Route>

    

        </Routes>
      </BrowserRouter>
    </SkillTreeProvider>
)
const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
