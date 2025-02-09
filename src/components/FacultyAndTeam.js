import React from 'react';
import './FacultyAndTeam.css';
import roshni from '../images/Team/roshni.jpg'
import bindu from '../images/Team/bindu.jpg'
import vasika from '../images/Team/vashika.jpg'
import kosutav from '../images/Team/WhatsApp Image 2025-02-07 at 11.26.36 PM.jpeg'
import Arunim from '../images/Team/My_photo - Arunim Gogoi 23BAI11381.jpg'
import Rana from '../images/Team/IMG_20250207_184213 - Rana Talukdar 23bai10186.jpg'
import Ayush from '../images/Team/pic for id card - Rex Patel.jpg'
import Arman from '../images/Team/PFP - ARMAAN DAS 24BSA10097.jpg'
import Jooman from '../images/Team/JK - Jooman Kishor Lahkar 23bec10052.jpg'
import Episita from '../images/Team/IMG_4458_Original - Eipshita Basuli.jpeg'
import faculty from '../images/Team/faculty.png'
import founder from '../images/founders/dickshit.jpeg'
import founder2 from '../images/founders/WhatsApp Image 2025-02-08 at 7.27.11 PM.jpeg'
import arnab from '../images/founders/Arnab.png'
import facultyy from '../images/Team/professor.png'

const FacultyAndTeam = () => {
  const facultyMembers = [
    { name: 'Dr. Subrata Nath', position: 'Faculty Coordinator', image:faculty},
    { name: 'Dr. Shafiul Alom Ahmed', position: 'Faculty Coordinator', image: facultyy},
  ];

  const teamMembers = [
    { name: 'Roshni Sharma', role: 'President', image: roshni },
    { name: 'Bindupautra Jyotibrat', role: 'Technical Team Lead', image: bindu },
    { name: 'Vashika Gupta ', role: 'Event Management Team Lead ', image: vasika },
    { name: 'Kaustav Kalita', role: 'Social Media Team Lead', image: kosutav},
    { name: 'Eipshita Basuli ', role: 'Cultural team Lead ', image: Episita},
    { name: 'Arunim Gogoi', role: 'PR Team Lead', image: Arunim},
    { name: 'Rana Talukdar', role: 'Technical team Co-lead ', image: Rana },
    { name: 'Ayush Prajapati ', role: 'Event Management Team Co-Lead', image: Ayush },
    { name: 'Armaan Das ', role: 'Social Media Team Co-Lead', image: Arman},
    { name: 'Jooman Kishor Lahkar ', role: 'PR Team CO-Lead', image:Jooman},
    
  ];
  const founders=[
    {name:'Roshni Sharma ',image:roshni},
    {name :'Saumadipta Chatterjee',image:founder2},
    {name:'Deekshit Kashyap',image:founder},
        {name:'Arnab Jyoti Borah',image:arnab}

  ]

  return (
    <div className="faculty-and-team">
      <div className="faculty-members">
        <h2>Faculty Members</h2>
        <div className="faculty-list">
          {facultyMembers.map((faculty, index) => (
            <div className="faculty-card" key={index}>
              <img className="profile-img" src={faculty.image} alt={faculty.name} />
              <h3>{faculty.name}</h3>
              <p>{faculty.position}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="team-members">
        <h2>Team Members</h2>
        <div className="team-grid">
          {teamMembers.map((team, index) => (
            <div className="team-card" key={index}>
              <img className="profile-img" src={team.image} alt={team.name} />
              <h3>{team.name}</h3>
              <p>{team.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="team-members">
        <h2>Founding Members</h2>
        <div className="team-grid">
          {founders.map((team, index) => (
            <div className="team-card" key={index}>
              <img className="profile-img" src={team.image} alt={team.name} />
              <h3>{team.name}</h3>
              <p>{team.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyAndTeam;
