import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import FacultyAndTeam from './components/FacultyAndTeam';
import Events from './components/Events';
import Footer from './components/Footer';
import ParticlesComponent from './components/Particles';

import { Routes, Route, useLocation } from 'react-router-dom';
import PremiumEvents from './premium/PremiumEvents';
import ExploreVoyage from './premium/ExploreVoyage';

function App() {
  const location = useLocation();
  const hideNavBarPaths = ['/events', '/explore-threads', '/explore-inauguration', '/explore-uncensored'];
  const shouldHideNavBar = hideNavBarPaths.includes(location.pathname);

  return (
    <div className='App'>
      <ParticlesComponent id="particles" />
      {!shouldHideNavBar && <NavBar />}

      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <section id="events">
              <Events />
            </section>
            <section id="team">
              <FacultyAndTeam />
            </section>
            <Footer />
          </>
        } />
        <Route path="/events" element={<PremiumEvents />} />
        <Route path="/explore-threads" element={<ExploreVoyage eventType="threads" />} />
        <Route path="/explore-inauguration" element={<ExploreVoyage eventType="inauguration" />} />
        <Route path="/explore-uncensored" element={<ExploreVoyage eventType="uncensored" />} />
      </Routes>
    </div>
  );
}

export default App;
