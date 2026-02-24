import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import FacultyAndTeam from './components/FacultyAndTeam';
import Events from './components/Events';
import Footer from './components/Footer';
import ParticlesComponent from './components/Particles';
import Team from './components/Team';

import PremiumEvents from './premium/PremiumEvents';
import ExploreVoyage from './premium/ExploreVoyage';

function Layout({ children, hideFooter }) {
  const location = useLocation();
  const hideNavBarPaths = ['/explore-threads', '/explore-inauguration', '/explore-uncensored'];
  const shouldHideNavBar = hideNavBarPaths.includes(location.pathname);

  return (
    <div className='App'>
      <ParticlesComponent id="particles" />
      {!shouldHideNavBar && <NavBar />}
      {children}
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />

            <section id="events">
              <Events />
            </section>

            <section id="team">
              <FacultyAndTeam />
            </section>
          </Layout>
        }
      />

      <Route
        path="/team"
        element={
          <Layout>
            <Team />
          </Layout>
        }
      />

      <Route path="/events" element={<Layout hideFooter><PremiumEvents /></Layout>} />
      <Route path="/explore-threads" element={<Layout hideFooter><ExploreVoyage eventType="threads" /></Layout>} />
      <Route path="/explore-inauguration" element={<Layout hideFooter><ExploreVoyage eventType="inauguration" /></Layout>} />
      <Route path="/explore-uncensored" element={<Layout hideFooter><ExploreVoyage eventType="uncensored" /></Layout>} />
    </Routes>
  );
}

export default App;