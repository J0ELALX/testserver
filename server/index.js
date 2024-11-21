const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Store events (replace with database in production)
let events = [];

// Get all events
app.get('/api/events', (req, res) => {
    res.json(events);
});

// Create new event
app.post('/api/events', upload.array('photos'), (req, res) => {
    try {
        const { eventName } = req.body;
        const photos = req.files.map(file => `/uploads/${file.filename}`);
        
        const newEvent = {
            id: Date.now().toString(),
            name: eventName,
            photos: photos,
            createdAt: new Date()
        };
        
        events.push(newEvent);
        res.json(newEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete event endpoint
app.delete('/api/events/:id', (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('Attempting to delete event:', eventId); // Debug log

        const eventIndex = events.findIndex(event => event.id === eventId);
        console.log('Event index:', eventIndex); // Debug log
        
        if (eventIndex === -1) {
            console.log('Event not found'); // Debug log
            return res.status(404).json({ error: 'Event not found' });
        }

        // Delete associated images
        const event = events[eventIndex];
        event.photos.forEach(photoPath => {
            const filePath = path.join(__dirname, photoPath);
            console.log('Deleting file:', filePath); // Debug log
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        // Remove event from array
        events.splice(eventIndex, 1);
        console.log('Event deleted successfully'); // Debug log
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error); // Debug log
        res.status(500).json({ error: error.message });
    }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});     