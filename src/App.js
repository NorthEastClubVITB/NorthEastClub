//import React from 'react';
import {Routes,Route} from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import FacultyAndTeam from './components/FacultyAndTeam';
import Events from './components/Events';
import Footer from './components/Footer';
import ParticlesComponent from './components/Particles';
import Team from './components/Team.js';
//import { Route } from 'lucide-react';

function App() {
  return (
    <Routes>
      <Route path='/'
      element={
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
      }/>
      <Route path='/team' element={<Team/>}/>
    </Routes>
    
  );
}


export default App;
