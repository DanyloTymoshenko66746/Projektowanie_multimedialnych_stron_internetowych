const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');


if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}


app.post('/api/contact', (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    
   
    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            error: 'Wszystkie pola są wymagane' 
        });
    }
    
   
    const newSubmission = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        message,
        submittedAt: new Date().toISOString(),
        ip: req.ip || req.socket.remoteAddress
    };
    
  
    let submissions = [];
    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        submissions = JSON.parse(data);
    } catch (error) {
        console.error('Błąd odczytu pliku:', error);
    }

    submissions.push(newSubmission);
    try {
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
        console.log(`✅ Zapisano zgłoszenie od: ${firstName} ${lastName} (${email})`);
        
        res.status(200).json({
            success: true,
            message: 'Formularz został wysłany poprawnie!',
            data: newSubmission
        });
    } catch (error) {
        console.error('Błąd zapisu:', error);
        res.status(500).json({
            success: false,
            error: 'Błąd zapisu danych na serwerze'
        });
    }
});


app.get('/api/submissions', (req, res) => {
    try {
        const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        const submissions = JSON.parse(data);
        res.json({ success: true, count: submissions.length, submissions });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Błąd odczytu' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
    console.log(`📝 Zgłoszenia będą zapisywane w: ${SUBMISSIONS_FILE}`);
});