import React from 'react';
import './FacultyAndTeam.css';
import roshni from '../images/Team/roshni.jpg'
import Rupankita from '../img_core/PXL_20251219_084039300~2 - Rupankita Baruah 24BAI10975.jpg'
import bindu from '../images/Team/bindu.jpg'

import kosutav from '../images/Team/Kaustav.jpeg'
import Arunim from '../images/Team/My_photo - Arunim Gogoi 23BAI11381.jpg'
import Rana from '../images/Team/Rana.jpeg'
import Ayush from '../images/Team/pic for id card - Rex Patel.jpg'
import Pratham from '../images/Team/Pratham.jpeg'
import Jooman from '../images/Team/Jumon.jpeg'
import Episita from '../images/Team/IMG_4458_Original - Eipshita Basuli.jpeg'
import faculty from '../images/Team/faculty.png'
import founder from '../images/founders/dickshit.jpeg'
import founder2 from '../images/founders/WhatsApp Image 2025-02-08 at 7.27.11 PM.jpeg'
import arnab from '../images/founders/Arnab.png'
import facultyy from '../images/Team/professor.png'

import mahi from '../images/Team/mahi.jpg'
import aakash from '../images/Team/aakash.jpg'

const FacultyAndTeam = () => {
  const facultyMembers = [
    { name: 'Dr. Shafiul Alom Ahmed', position: 'Faculty Coordinator', image: facultyy},
    { name: 'Dr. Subrata Nath', position: 'Faculty Co-Coordinator', image:faculty},
  ];

  const teamMembers = [
    //{ name: 'Roshni Sharma', role: 'President', image: roshni },
    { name: 'Aakash Lalwani', role: 'Co-ordinator', image: aakash },
    { name: 'Mahijith Chowdhury', role: 'Secretary', image: mahi },
    { name: 'Bindupautra Jyotibrat', role: 'Technical Team Lead', image: bindu },
    //{ name: 'Vashika Gupta ', role: 'Event Management Team Lead ', image: vasika },
    { name: 'Kaustav Kalita', role: 'Social Media Team Lead', image: kosutav},
    { name: 'Arunim Gogoi', role: 'PR Team Lead', image: Arunim},
    //{ name: 'Bidhi Sharma', role: 'Cultural Team Lead ', image: bidhi},
    { name: 'Rana Talukdar', role: 'Technical Team Co-lead ', image: Rana },
    { name: 'Ayush Prajapati ', role: 'Event Management Team Lead', image: Ayush },
    { name: 'Pratham Shah', role: 'Social Media Team Co-Lead', image: Pratham},
    { name: 'Jooman Kishor Lahkar ', role: 'PR Team Co-Lead', image:Jooman},
    { name: 'Eipshita Basuli ', role: 'Cultural Team', image: Episita},
    { name: 'Rupankita Baruah', role: 'Cultural Team Co-Lead', image: Rupankita},
    
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
        <h2>Departmental Leads</h2>
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
      {/* <div className="team-members">
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
      </div> */}
    </div>
  );
};

export default FacultyAndTeam;