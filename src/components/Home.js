// Home.jsx
import React from 'react';
import './home.css';
import Slideshow from './Slideshow';



const Home = () => {
  return (
    <div className="home">
     
     
      <div className="content">
        <h1>NORTH EAST CLUB</h1>
        <p>A Clutural club in VIT Bhopal</p>
      </div>
      <Slideshow/>
      <div className="content">
        <h1>About Us</h1>
        <h2>North East Club is a vibrant university club representing the diverse and captivating essence of the North Eastern region of India. Our primary goal is to showcase the rich cultural heritage and natural beauty of the region to university students, fostering a deeper appreciation and understanding of its uniqueness.</h2>
      </div>
     
      
    </div>
  );
};

export default Home;