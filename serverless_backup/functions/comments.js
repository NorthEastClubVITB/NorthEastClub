const { Client } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        // GET /comments?eventId=xyz
        if (event.httpMethod === 'GET') {
            const { eventId } = event.queryStringParameters;
            if (!eventId) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing eventId' }) };
            }

            const { rows } = await client.query(
                'SELECT * FROM comments WHERE event_id = $1 ORDER BY created_at DESC',
                [eventId]
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ comments: rows })
            };
        }

        // POST /comments
        if (event.httpMethod === 'POST') {
            const { eventId, name, text } = JSON.parse(event.body);

            if (!eventId || !name || !text) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };
            }

            const { rows } = await client.query(
                'INSERT INTO comments (event_id, name, text) VALUES ($1, $2, $3) RETURNING *',
                [eventId, name, text]
            );

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(rows[0])
            };
        }

        return { statusCode: 405, headers, body: 'Make sure your method is GET or POST' };

    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Database connection failed', details: error.message })
        };
    } finally {
        await client.end();
    }
};
