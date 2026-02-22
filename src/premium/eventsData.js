// ============ CLOUDINARY CONFIGURATION ============

// Update this with your actual Cloudinary Cloud Name
const CLOUD_NAME = 'dambyonbn';

const normalizeFilename = (filename) => {
    if (!filename) return '';
    // Cloudinary standard normalization: spaces to underscores
    // Do NOT replace parenthesis with underscores, Cloudinary keeps them (or they can be URL-encoded)
    return filename.replace(/\s/g, '_');
};

const getCloudinaryUrl = (folder, filename, transforms = 'f_auto,q_auto') => {
    const normalizedFilename = normalizeFilename(filename);
    const transformPath = transforms ? `${transforms}/` : '';
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformPath}v1/events/${folder}/${normalizedFilename}`;
};

const getCloudinaryVideoUrl = (folder, filename, transforms = 'f_auto,q_auto') => {
    const normalizedFilename = normalizeFilename(filename);
    const transformPath = transforms ? `${transforms}/` : '';
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformPath}v1/events/${folder}/${normalizedFilename}`;
};

// ============ EVENTS DATA ============

export const eventsData = [
    {
        id: 'threads-of-heritage',
        folder: 'Threads_of_herit_1',
        title: "Threads of Heritage",
        date: "February 20, 2025",
        time: "11:00 AM - 4:30 PM",
        location: "Arch 102",
        attendees: "200+",
        description: "Experience the vibrant culture and traditions of North East India. A celebration of rich artistic heritage hosted by the North East Club as part of Advitya 2025.",
        color: "#1A237E",
        // Cover image for event cards
        coverImage: getCloudinaryUrl('Threads_of_herit_1', 'toh1.jpg'),
        heroVideo: getCloudinaryVideoUrl('Threads_of_herit_1', '20250220_122943.mp4'),  // Real MP4 for "Relive the Experience" section
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        fullDescription: "Threads of Heritage – The North East is a celebration of the rich cultural traditions and artistic heritage of Northeast India, hosted by the North East Club as part of Advitya 2025. This immersive event features exquisite handicraft displays, interactive bamboo crafting workshops, and traditional games. From the vibrant photo booth to the authentic tea stall, every corner invites you to experience the essence of the Northeast.",
        highlights: ["Hands-on Bamboo Craft Workshop", "Nuances of Northeast Trivia", "Cultural Photo Booth", "Traditional Tea Stall", "Craft Showcase & Prizes"],
        // Images for /events page (no videos)
        images: [
            { src: getCloudinaryUrl('Threads_of_herit_1', 'toh1.jpg'), caption: 'A Celebration of Culture' },
            { src: getCloudinaryUrl('Threads_of_herit_1', '20250220_113837.jpg'), caption: 'Elegance in Tradition' },
            { src: getCloudinaryUrl('Threads_of_herit_1', '20250220_113844.jpg'), caption: 'Bridging Cultures' },
            { src: getCloudinaryUrl('Threads_of_herit_1', '20250220_113845.jpg'), caption: 'Threads of History' },
            { src: getCloudinaryUrl('Threads_of_herit_1', '20250220_132248.jpg'), caption: 'Rhythms of the World' },
            { src: getCloudinaryUrl('Threads_of_herit_1', 'toh2.jpg'), caption: 'United in Diversity' },
            { src: getCloudinaryUrl('Threads_of_herit_1', 'toh3.jpg'), caption: 'A Tapestry of Heritage' },
        ],
        // Mixed media for /explore-* pages (images + videos)
        media: [
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', 'toh1.jpg'), caption: 'A Celebration of Culture' },
            { type: 'video', src: getCloudinaryVideoUrl('Threads_of_herit_1', '20250220_111948.mp4'), caption: 'Grace in Motion' },
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', '20250220_113837.jpg'), caption: 'Elegance in Tradition' },
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', '20250220_113844.jpg'), caption: 'Bridging Cultures' },
            { type: 'video', src: getCloudinaryVideoUrl('Threads_of_herit_1', '20250220_122943.mp4'), caption: 'Melodies of the Past' },
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', '20250220_113845.jpg'), caption: 'Threads of History' },
            { type: 'video', src: getCloudinaryVideoUrl('Threads_of_herit_1', '20250220_123013.mp4'), caption: 'Artistry in Action' },
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', '20250220_132248.jpg'), caption: 'Rhythms of the World' },
            { type: 'video', src: getCloudinaryVideoUrl('Threads_of_herit_1', '20250220_120008.mp4'), caption: 'Weaving Stories' },
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', 'toh2.jpg'), caption: 'United in Diversity' },
            { type: 'video', src: getCloudinaryVideoUrl('Threads_of_herit_1', '20250220_120104.mp4'), caption: 'Harmony in Diversity' },
            { type: 'image', src: getCloudinaryUrl('Threads_of_herit_1', 'toh3.jpg'), caption: 'A Tapestry of Heritage' },
        ],
        testimonials: [
            { name: "Sarah M.", text: "Seeing everyone celebrate their heritage was incredibly moving. It reminded me why diversity is our greatest strength." },
            { name: "Raj P.", text: "I finally got to share my culture with my friends. The pride I felt wearing my traditional clothes was indescribable." }
        ]
    },
    {
        id: 'uncensored',
        folder: 'Uncensored',
        title: "Uncensored",
        date: "December 2024",
        time: "",
        location: "AB1-Audi",
        attendees: "350+",
        description: "Laughter, talent, and boundless creativity took center stage at Uncensored, an electrifying event hosted by the North East Club. More than just a talent show, it was a high-energy spectacle featuring hilarious skits, live performances, comedy acts, music, and dance—all designed to keep the audience entertained.",
        color: "#102A43",
        coverImage: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.34 PM.jpg'),
        heroVideo: getCloudinaryVideoUrl('Uncensored', 'WhatsApp Video 2026-02-09 at 10.32.29 PM (1).mp4'),  // Real MP4 for "Relive the Experience" section
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        fullDescription: "A panel of witty judges added an extra layer of fun, ensuring every moment was filled with excitement. Whether cheering from the crowd or stepping into the spotlight, participants and attendees alike experienced an afternoon of pure entertainment. 'Uncensored' wasn’t just an event—it was a celebration of spontaneity, expression, and unforgettable memories.",
        highlights: [
            "Hilarious Skits & Comedy",
            "Live Music & Dance",
            "Interactive Judging Panel",
            "Student Spotlight Performances"
        ],
        images: [
            { src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.34 PM.jpg'), caption: 'Voices Unheard' },
            { src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.30 PM.jpg'), caption: 'Soulful Melodies' },
            { src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.31 PM.jpg'), caption: 'Art in Motion' },
            { src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.33 PM.jpg'), caption: 'Words that Resonate' },
            { src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.34 PM.jpg'), caption: 'Shared Emotions' },
            { src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.38 PM.jpg'), caption: 'Creative Synergy' },
        ],
        media: [
            { type: 'image', src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.34 PM.jpg'), caption: 'Voices Unheard' },
            { type: 'video', src: getCloudinaryVideoUrl('Uncensored', 'WhatsApp Video 2026-02-09 at 10.32.29 PM (1).mp4'), caption: 'Raw & Unfiltered' },
            { type: 'image', src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.30 PM.jpg'), caption: 'Soulful Melodies' },
            { type: 'image', src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.31 PM.jpg'), caption: 'Art in Motion' },
            { type: 'video', src: getCloudinaryVideoUrl('Uncensored', 'WhatsApp Video 2026-02-09 at 10.32.29 PM.mp4'), caption: 'The Stage is Yours' },
            { type: 'image', src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.33 PM.jpg'), caption: 'Words that Resonate' },
            { type: 'image', src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.34 PM.jpg'), caption: 'Shared Emotions' },
            { type: 'image', src: getCloudinaryUrl('Uncensored', 'WhatsApp Image 2026-02-09 at 10.32.38 PM.jpg'), caption: 'Creative Synergy' },
        ],
        testimonials: [
            { name: "Alex K.", text: "I've never felt so heard. Sharing my poetry here changed how I see myself as an artist." },
            { name: "Maya L.", text: "The raw authenticity of every performance left me speechless. This is what art should be." }
        ]
    },
    {
        id: 'inauguration',
        folder: 'inaug',
        title: "Inauguration",
        date: "May 2024",
        time: "",
        location: "AB1-Audi",
        attendees: "500+",
        description: "The North East Club proudly hosted its Grand Inaugural Event, marking the beginning of a journey to celebrate and showcase the vibrant cultures of Northeast India.",
        color: "#0A192F",
        coverImage: getCloudinaryUrl('inaug', 'kmda.jpg'),
        heroVideo: null,  // No videos available for inauguration
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        fullDescription: "Where it all began. The inauguration ceremony set the tone for an incredible year ahead. Distinguished guests shared wisdom, talented performers entertained, and new friendships were forged. This was the moment we became a community.",
        highlights: ["500+ attendees", "Keynote speeches", "Welcome performances", "Networking sessions", "Club showcase"],
        images: [
            { src: getCloudinaryUrl('inaug', 'kmda.jpg'), caption: 'A Grand Beginning' },
            { src: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.53 PM.jpg'), caption: 'Words of Wisdom' },
            { src: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.54 PM.jpg'), caption: 'Setting the Stage' },
            { src: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.56 PM.jpg'), caption: 'Building Connections' },
            { src: getCloudinaryUrl('inaug', 'WhatsApp Image 2025-02-07 at 11.28.01 PM (1).jpeg'), caption: 'Exploring Opportunities' },
            { src: getCloudinaryUrl('inaug', 'WhatsApp Image 2025-02-07 at 11.28.01 PM.jpeg'), caption: 'Memories in the Making' },
        ],
        // Inauguration has no videos — images only even in explore view
        media: [
            { type: 'image', src: getCloudinaryUrl('inaug', 'kmda.jpg'), caption: 'A Grand Beginning' },
            { type: 'image', src: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.53 PM.jpg'), caption: 'Words of Wisdom' },
            { type: 'image', src: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.54 PM.jpg'), caption: 'Setting the Stage' },
            { type: 'image', src: getCloudinaryUrl('inaug', 'WhatsApp Image 2026-02-09 at 10.32.56 PM.jpg'), caption: 'Building Connections' },
            { type: 'image', src: getCloudinaryUrl('inaug', 'WhatsApp Image 2025-02-07 at 11.28.01 PM (1).jpeg'), caption: 'Exploring Opportunities' },
            { type: 'image', src: getCloudinaryUrl('inaug', 'WhatsApp Image 2025-02-07 at 11.28.01 PM.jpeg'), caption: 'Memories in the Making' },
        ],
        testimonials: [
            { name: "Emma T.", text: "Walking into that auditorium, I knew I was home. The energy was incredible from the start." },
            { name: "David R.", text: "The inauguration set the bar high. Every event since has been amazing, but this one will always be special." }
        ]
    }
];

// Map eventType props to event IDs
export const eventTypeMap = {
    threads: 'threads-of-heritage',
    inauguration: 'inauguration',
    uncensored: 'uncensored'
};
