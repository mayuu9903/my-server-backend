const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg'); 
const app = express();

app.use(cors());
app.use(express.json());

// Cloud Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Route to handle form submission
app.post('/save-user', async (req, res) => {
    // Hamare HTML se 'username' aur 'email' aa raha hai
    const { username, email } = req.body;
    
    console.log("Received data from frontend:", username, email);

    try {
        // Database ke andar columns 'name' aur 'email' hain
        const queryText = 'INSERT INTO users (name, email) VALUES ($1, $2)';
        await pool.query(queryText, [username, email]);
        
        console.log("Data successfully saved to database!");
        res.send("Data saved to Render Cloud!");
    } catch (err) {
        // Agar database me koi bhi galti hogi, toh ye line usey Render Logs me print karegi
        console.error("Database Insert Error:", err.message);
        res.status(500).send("Database Error: " + err.message);
    }
});

app.listen(3000, () => console.log("Server port 3000 par chalu hai!"));
