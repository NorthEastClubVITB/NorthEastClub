const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'comments.db');
const db = new sqlite3.Database(dbPath);

const comments = [
    {
        event_id: 'uncensored',
        name: 'Ansh',
        text: 'The energy at Uncensored was unmatched! The skits were hilarious.'
    },
    {
        event_id: 'inauguration',
        name: 'Rana talukdar',
        text: 'Hearing the Polo folk song brought back so many memories from home.'
    },
    {
        event_id: 'threads-of-heritage',
        name: 'jyotibrat',
        text: 'Proud to see our culture represented so beautifully. The Bihu dance was perfect.'
    }
];

db.serialize(() => {
    // Create table if not exists (just in case)
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        name TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    const stmt = db.prepare("INSERT INTO comments (event_id, name, text) VALUES (?, ?, ?)");

    comments.forEach(comment => {
        stmt.run(comment.event_id, comment.name, comment.text, (err) => {
            if (err) {
                console.error(`Error adding comment from ${comment.name}:`, err.message);
            } else {
                console.log(`Added comment from ${comment.name}`);
            }
        });
    });

    stmt.finalize();
    console.log('Seeding complete.');
});

db.close();
