import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import FacultyAndTeam from './components/FacultyAndTeam';
import Events from './components/Events';
import Footer from './components/Footer';
import ParticlesComponent from './components/Particles';

function App() {
  return (
    <div className='App'>
      <ParticlesComponent id="particles" />
      <NavBar />

      <Home />

      {/* Sections with ID for smooth scrolling */}
      <section id="events">
        <Events />
      </section>

      <section id="team">
        <FacultyAndTeam />
      </section>

      <Footer />
    </div>
  );
}

export default App;
