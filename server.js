const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 
const app = express();

app.use(cors());
app.use(express.json());

// यह लाइन आपके इसी फोल्डर की 'website.db' फाइल को कोड से जोड़ेगी
const db = new sqlite3.Database('./website.db', (err) => {
    if (err) console.error("डेटाबेस कनेक्ट नहीं हुआ: " + err.message);
    else console.log("डेटाबेस आपके लैपटॉप में कनेक्ट हो चुका है!");
});

// गिटहब की वेबसाइट से डेटा रिसीव करने का रास्ता
app.post('/save-user', (req, res) => {
    const { username, email } = req.body;
    const sql = `INSERT INTO users (name, email) VALUES (?, ?)`;
    
    db.run(sql, [username, email], function(err) {
        if (err) return res.status(500).send("डेटा सेव नहीं हुआ");
        res.send("डेटा आपके लैपटॉप के डेटाबेस में सेव हो गया!");
    });
});

app.listen(3000, () => console.log("सर्वर पोर्ट 3000 पर चालू है!"));