import { useState, useEffect } from "react";
import './slideshow.css';

const states = [
  {
    name: "Assam",
    description: "Known for its tea gardens, wildlife, and the mighty Brahmaputra River.",
    image: "https://static.toiimg.com/thumb/108292225/ASSAM.jpg?width=1200&height=900",
  },
  {
    name: "Mizoram",
    description: "A land of rolling hills and lush forests, rich in tribal culture.",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/aizawl-state-capital-mizoram-tri-hero?qlt=82&ts=1727165714611",
  },
  {
    name: "Manipur",
    description: "Home to Loktak Lake, floating islands, and a vibrant cultural heritage.",
    image: "https://oddessemania.in/wp-content/uploads/2023/10/manipur-1290x540.jpg",
  },
  {
    name: "Tripura",
    description: "Famous for its palaces, temples, and diverse ethnic heritage.",
    image: "https://www.kiomoi.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fkmadmin%2Fimage%2Fupload%2Fv1556099384%2Fkiomoi%2Ftripura%2FTripura.webp&w=3840&q=75",
  },
  {
    name: "Nagaland",
    description: "Known for its indigenous Naga tribes and the Hornbill Festival.",
    image: "https://i1.wp.com/www.inditrip.in/wp-content/uploads/2018/10/Tribes-of-Nagaland.jpg?resize=1024%2C680&ssl=1",
  },
  {
    name: "Arunachal Pradesh",
    description: "The natural beauty of Arunachal Pradesh is truly unparalleled. Often refered to as “the land of the dawnlit mountains”",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Golden_Pagoda_Namsai_Arunachal_Pradesh.jpg",
  },
  {
    name: "Meghalaya",
    description: "The abode of clouds, famous for its living root bridges and waterfalls.",
    image: "https://www.captureatrip.com/_next/image?url=https%3A%2F%2Fcaptureatrip-cms-storage.s3.ap-south-1.amazonaws.com%2FMeghalaya_tour_package_b51c7a0413.webp&w=3840&q=75",
  },
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % states.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slideshow-container">
      <div className="slide" key={index}>
        <img src={states[index].image} alt={states[index].name} className="slide-image" />
        <div className="text-overlay">
          <h2>{states[index].name}</h2>
          <p className="des">{states[index].description}</p>
        </div>
      </div>
      <div className="dots">
        {states.map((_, i) => (
          <span key={i} className={i === index ? "dot active" : "dot"}></span>
        ))}
      </div>
    </div>
  );
}
