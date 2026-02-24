import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import FacultyAndTeam from './components/FacultyAndTeam';
import Events from './components/Events';
import Footer from './components/Footer';
import ParticlesComponent from './components/Particles';
import Team from './components/Team';

function Layout({ children }) {
  return (
    <div className='App'>
      <ParticlesComponent id="particles" />
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Home Page */}
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

      {/* Team Page */}
      <Route
        path="/team"
        element={
          <Layout>
            <Team />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;