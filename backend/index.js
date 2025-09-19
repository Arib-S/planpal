// backend/index.js
import express from "express";
import cors from "cors";
import { db } from "./firebase.js";

const app = express();
app.use(cors());
app.use(express.json());

// Get all events
app.get("/events", async (req, res) => {
    try {
        const snapshot = await db.collection("events").get();
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add an event
app.post("/events", async (req, res) => {
    try {
        const { title, date } = req.body;
        const docRef = await db.collection("events").add({
            title,
            date,
            createdAt: new Date()
        });
        res.json({ id: docRef.id, title, date });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an event
app.delete("/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("events").doc(id).delete();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("PlanPal Backend Running!");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));