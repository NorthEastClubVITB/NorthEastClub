
import React, { useState } from "react";
import "./team.css";



import Subhasis from '../img_core/Subhasis.jpeg';
import Abhijit from '../img_core/Abhijit tripathi - ABHIJIT TRIPATHI 24BCE10548.jpg';
import Hazijul from '../img_core/Screenshot_20260209-204744 - MD HAZIJUL HAQUE 24BAC10026.png'
import Adarsh from '../img_core/WhatsApp Image 2026-02-11 at 00.37.06 - Adarsh Shukla.jpeg'
import Shriya from '../img_core/Shriya Punnal - Shriya Punnal 23bce10751.jpg'
import Deep from '../img_core/Deep - DEEP JAISWAL 24BAI10750.jpg'
import Ansh from '../img_core/1770656271714 - lucifer sinha.jpg'
import Naba from '../img_core/Naba_Img.jpeg'
import Jivanshi from '../img_core/Jivanshi Rajput  - JIVANSHI RAJPUT 24BCE10609.jpg'
import Anuj from '../img_core/Anuj Gupta - ANUJ GUPTA 24BAI10152.webp'
import Pranjal from '../img_core/Pranjal.png'
import Vinayak from '../img_core/vinayakSingh25BAI10832 - Vinayak Singh.jpg'
import Akshay from '../img_core/IMG_20251225_091129~2 - Akshay Singh.jpg'
import Dhairya from '../img_core/IMG_4429 - DHAIRYA JAISWAL 25BAI10441.jpeg'
import Ananya from '../img_core/IMG_3413 - Ananya Luintel.jpeg'
import Madhu from '../img_core/Screenshot_20260210-102551_Gallery - MADHU KUMARI 25BAS10075.jpg'
import Siddhi from '../img_core/Siddhi - SIDDHI GUPTA 24BCE10846.jpg'
import Shamim from '../img_core/IMG_9460 - SHAMIM UZ ZAMAN 24BSA10159.jpeg'
import Pari from '../img_core/20260210_122548 - PARI JAIN 25MIB10005.jpg'
import Souhini from '../img_core/SOUHINI ROY - SOUHINI ROY 25MEI10040.JPG'

import Pratyaksha from '../img_core/Pratyaksha Singh - Pratyaksha Singh 23bai10345(1).jpg'
import Soumya from '../img_core/Soumya Harjanj - SOUMYA HARJANI 25BCE10075.jpg'
import Shashwat from '../img_core/IMG_20251213_183223 - SHASHWAT PRATIM CHOUDHURY 25BAI10705.jpg'
import Gahira from '../img_core/IMG_4703 - Gahira Kaur.jpeg'
//import Harshvardhan from '../img_core/Harshvardhan Singh  - HARSHVARDHAN SINGH 25BAI11615.pdf'
import Harshvardhan from '../img_core/IMG-20251223-WA0023 - HARSHVARDHAN BORGOHAIN 24BAC10024.jpg'
import Mitul from '../img_core/Mitul Khanna - MITUL KHANNA 24BCE10976.jpg'
import Tushar from '../img_core/TusharChakraborty - TUSHAR CHAKRABORTY 24BAI10842.jpeg'
import Nilutpal from '../img_core/IMG-20251021-WA0084 - Junmoni Hazarika.jpg'
// import Debadrita from '../img_core/DebadritaPal - Debadrita Pal.jpg'
import Deepika from '../img_core/Deepika - Deepika Dagar.jpeg'
import Saroj from '../img_core/Saroj - Saroj Parajuli.jpg'
import Faruk from '../img_core/Faruk.jpeg'



import Navbar from "./NavBar";



const teamMembers = [
  { name: "Subhashis", dept: "Cultural", img: Subhasis },
  { name: "Abhijit", dept: "Cultural", img: Abhijit },
  { name: "Hazijul", dept: "Technical", img: Hazijul },
  { name: "Adarsh", dept: "Cultural", img: Adarsh },
  { name: "Shriya", dept: "Cultural", img: Shriya },
  { name: "Deep", dept: "Cultural", img: Deep },
  { name: "Ansh", dept: "Technical", img: Ansh },
  { name: "Naba", dept: "Technical", img: Naba },
  { name: "Jivanshi", dept: "Cultural", img: Jivanshi },
  { name: "Anuj", dept: "Design", img: Anuj },
  { name: "Pranjal", dept: "Design", img: Pranjal },
  { name: "Madhu", dept: "Cultural", img: Madhu },
  { name: "Shamim", dept: "Social Media", img: Shamim },
  { name: "Vinayak", dept: "Social Media", img: Vinayak },
  { name: "Akshay", dept: "Social Media", img: Akshay },
  { name: "Dhairya", dept: "Social Media", img: Dhairya },
  { name: "Ananya", dept: "Social Media", img: Ananya },
  { name: "Madhu", dept: "Design", img: Madhu },
  
  { name: "Siddhi", dept: "Event Management", img: Siddhi },
  { name: "Pranjal", dept: "Content", img: Pranjal },
  { name: "Pari", dept: "Cultural", img: Pari },
  { name: "Souhini", dept: "Social Media", img: Souhini },
  
  { name: "Pratyaksha", dept: "Cultural", img: Pratyaksha },
  { name: "Soumya", dept: "Event Management", img: Soumya },
  { name: "Shashwat", dept: "PR", img: Shashwat },
  { name: "Gahira", dept: "Cultural", img: Gahira },
  { name: "Harshvardhan", dept: "Cultural", img: Harshvardhan },
  { name: "Mitul", dept: "Cultural", img: Mitul },
  { name: "Tushar", dept: "PR", img: Tushar },
  { name: "Nilutpal", dept: "Cultural", img: Nilutpal },
//   { name: "Debadrita", dept: "Event Management", img: Debadrita },
  { name: "Deepika", dept: "Event Management", img: Deepika },
  { name: "Saroj", dept: "Event Management", img: Saroj },
  { name : "Faruk",dept: "Event Management", img: Faruk}
];



const Team = () => {
  const [selectedDept, setSelectedDept] = useState("");

  const filteredMembers = teamMembers.filter(member =>
    selectedDept === "" ? true : member.dept === selectedDept
  );

  return (
    <>
    <Navbar/>
    <div className="team-page">
      <h1>{selectedDept ==="" ? "Our Team" : `${selectedDept} Team`}</h1>
        {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className="firefly"></div>
      ))}
      <div className="drop">
      <select onChange={(e) => setSelectedDept(e.target.value)}>
        <option value="">All Departments</option>
        <option value="Technical">Technical</option>
        <option value="Design">Design</option>
        <option value="Event Management">Event Management</option>
        <option value="Cultural">Cultural</option>
        <option value="PR">PR</option>
        <option value="Social Media">Social Media</option>
        <option value="Design">Design</option>
        <option value="Content">Content</option>
      </select>
      </div>

      <div className="team-grid">
        {filteredMembers.map((member, index) => (
          <div key={index} className="team-card">
            <img src={member.img} alt={member.name} />
            <h3>{member.name}</h3>
            <p>{member.dept}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Team;


