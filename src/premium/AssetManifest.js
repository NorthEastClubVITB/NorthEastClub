// Smart Asset Manifest - Manually curated high-quality assets
// This mimics a smart backend scanner for the static frontend

import vidHeritage1 from '../images/events/Threads_of_herit_2/IMG_6263.MOV';
import vidHeritage2 from '../images/events/Threads_of_herit_2/IMG_6265.MOV';
import vidHeritage3 from '../images/events/Threads_of_herit_2/IMG_6266.MOV';
import vidFolk from '../images/events/Uncensored/WhatsApp Video 2026-02-09 at 10.32.29 PM (1).mp4';
import vidCraft from '../images/events/Threads_of_herit_1/20250220_120008.mp4';
import imgInaug1 from '../images/events/inaug/WhatsApp Image 2026-02-09 at 10.32.53 PM.jpeg';
import imgInaug2 from '../images/events/inaug/WhatsApp Image 2026-02-09 at 10.32.54 PM.jpeg';
import imgInaug3 from '../images/events/inaug/WhatsApp Image 2026-02-09 at 10.32.56 PM.jpeg';
import imgThreads1 from '../images/events/Threads_of_herit_1/20250220_113837.jpg';
import imgThreads2 from '../images/events/Threads_of_herit_1/20250220_113844.jpg';
import imgThreads3 from '../images/events/Threads_of_herit_1/20250220_113845.jpg';
import imgUncensored1 from '../images/events/Uncensored/WhatsApp Image 2026-02-09 at 10.32.30 PM.jpeg';
import imgUncensored2 from '../images/events/Uncensored/WhatsApp Image 2026-02-09 at 10.32.31 PM.jpeg';
import imgUncensored3 from '../images/events/Uncensored/WhatsApp Image 2026-02-09 at 10.32.33 PM.jpeg';
import imgUncensored4 from '../images/events/Uncensored/WhatsApp Image 2026-02-09 at 10.32.34 PM.jpeg';

export const AssetManifest = {
    hero: [
        { type: 'video', src: vidHeritage1, label: 'Threads of Heritage' },
        { type: 'video', src: vidFolk, label: 'Uncensored Energy' },
        { type: 'video', src: vidHeritage3, label: 'Cultural Weaver' }
    ],
    inauguration: [
        { type: 'image', src: imgInaug1 },
        { type: 'image', src: imgInaug2 },
        { type: 'image', src: imgInaug3 },
        { type: 'image', src: imgInaug2 },
        { type: 'image', src: imgInaug1 },
        { type: 'image', src: imgInaug3 },
        { type: 'image', src: imgInaug1 },
        { type: 'image', src: imgInaug2 },
        { type: 'image', src: imgInaug3 }, // Added for length
        { type: 'image', src: imgInaug1 }, // Added for length
    ],
    threads: [
        { type: 'video', src: vidHeritage1 },
        { type: 'image', src: imgThreads1 },
        { type: 'video', src: vidHeritage2 },
        { type: 'image', src: imgThreads2 },
        { type: 'video', src: vidCraft },
        { type: 'image', src: imgThreads3 },
        { type: 'video', src: vidHeritage1 },
        { type: 'video', src: vidHeritage3 },
        { type: 'image', src: imgThreads1 }, // Duplicate
        { type: 'video', src: vidHeritage2 },
    ],
    uncensored: [
        { type: 'video', src: vidFolk },
        { type: 'image', src: imgUncensored1 },
        { type: 'image', src: imgUncensored2 },
        { type: 'video', src: vidFolk },
        { type: 'image', src: imgUncensored3 },
        { type: 'image', src: imgUncensored4 },
        { type: 'video', src: vidFolk },
        { type: 'image', src: imgUncensored1 }, // Duplicate
    ]
};

export const getRandomAsset = (category) => {
    const list = AssetManifest[category];
    if (!list) return null;
    return list[Math.floor(Math.random() * list.length)];
};
