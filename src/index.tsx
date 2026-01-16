// 1. React and core libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// 2. Third-party libraries
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 3. Components/pages (sorted alphabetically or by type)
import LandingPage from './pages/LandingPage';

// import Footer from './components/Footer'
import AppLayout from './AppLayout';
import SkillPage from './pages/SkillPage';

import './index.css';
// import './tailwind.css';

const Root: React.FC = () => (

    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/skill/:skillId" element={<SkillPage />} />

          <Route path="/" element={ 
            <>
              <LandingPage />
              {/* <Footer /> */}
            </>
          } />
        
        </Route>

   

      </Routes>
    </BrowserRouter>
)
const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
