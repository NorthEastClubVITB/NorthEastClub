const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'events',
        allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi'],
        resource_type: 'auto' // Important for videos
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup (File-based SQLite)
const dbPath = path.resolve(__dirname, 'comments.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create table if not exists
        db.run(`CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT NOT NULL,
            name TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }
});

// Routes

// POST a new file to Cloudinary
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        url: req.file.path, // This is the Cloudinary URL
        secure_url: req.file.path,
        public_id: req.file.filename
    });
});

// GET all media for a specific folder/event from Cloudinary
app.get('/api/media/:folder', async (req, res) => {
    const { folder } = req.params;
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `events/${folder}`,
            max_results: 100
        });
        res.json({ resources: result.resources });
    } catch (error) {
        console.error('Error fetching media:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// GET all comments from all events
app.get('/api/comments', (req, res) => {
    const sql = `SELECT * FROM comments ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ comments: rows });
    });
});

// GET comments for an event
app.get('/api/comments/:eventId', (req, res) => {
    const { eventId } = req.params;
    const sql = `SELECT * FROM comments WHERE event_id = ? ORDER BY created_at DESC`;
    db.all(sql, [eventId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ comments: rows });
    });
});

// POST a new comment
app.post('/api/comments', (req, res) => {
    const { event_id, name, text } = req.body;

    if (!event_id || !name || !text) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `INSERT INTO comments (event_id, name, text) VALUES (?, ?, ?)`;
    db.run(sql, [event_id, name, text], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Return the created comment
        const newItem = {
            id: this.lastID,
            event_id,
            name,
            text,
            created_at: new Date().toISOString()
        };
        res.status(201).json(newItem);
    });
});

// Health check
app.get('/', (req, res) => {
    res.send('Comments API is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
