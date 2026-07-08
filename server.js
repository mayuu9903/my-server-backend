const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg'); 
const app = express();

app.use(cors());
app.use(express.json());

// Online Cloud Database Connection String
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Form database me save karne ka rasta
app.post('/save-user', async (req, res) => {
    try {
        // Hamare HTML se 'username' aur 'email' aa raha hai
        const { username, email } = req.body;
        
        console.log("Frontend se mila data:", username, email);

        if (!username || !email) {
            return res.status(400).send("Name and Email are required!");
        }

        // Database ke andar columns ka naam 'name' aur 'email' hai
        const queryText = 'INSERT INTO users (name, email) VALUES ($1, $2)';
        await pool.query(queryText, [username, email]);
        
        console.log("Data successfully saved into database!");
        res.status(200).send("Data saved to Render Cloud!");
    } catch (err) {
        console.error("Database Insert Error:", err.message);
        res.status(500).send("Database Error: " + err.message);
    }
});

app.listen(3000, () => console.log("Server port 3000 par chalu hai!"));
