const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg'); // SQLite की जगह Postgres टूल का इस्तेमाल
const app = express();

app.use(cors());
app.use(express.json());

// Render के ऑनलाइन Postgres डेटाबेस से कनेक्ट करने का कोड
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// पहली बार चलने पर ऑनलाइन डेटाबेस में ऑटोमैटिक 'users' टेबल बनाने का कोड
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT
    )
`, (err) => {
    if (err) console.error("टेबल नहीं बनी: " + err.message);
    else console.log("डेटाबेस आपके रेंडर क्लाउड में कनेक्ट हो चुका है!");
});

// गिटहब वेबसाइट से डेटा रिसीव करने का रास्ता
app.post('/save-user', async (req, res) => {
    const { username, email } = req.body;
    try {
        await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [username, email]);
        res.send("डेटा आपके रेंडर के ऑनलाइन डेटाबेस में सेव हो गया!");
    } catch (err) {
        console.error(err);
        res.status(500).send("डेटा सेव नहीं हुआ");
    }
});

app.listen(3000, () => console.log("सर्वर पोर्ट 3000 पर चालू है!"));