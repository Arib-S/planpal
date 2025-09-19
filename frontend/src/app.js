import React, { useState, useEffect } from "react";
import "./app.css";

const API_BASE = "http://localhost:5000";

function App() {
    const [events, setEvents] = useState([]);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch events from backend
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/events`);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    // Add new event
    const addEvent = async () => {
        if (!title || !date) return;

        try {
            const response = await fetch(`${API_BASE}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, date })
            });

            if (response.ok) {
                setTitle("");
                setDate("");
                fetchEvents(); // Refresh the list
            }
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    // Delete event
    const deleteEvent = async (id) => {
        try {
            await fetch(`${API_BASE}/events/${id}`, {
                method: "DELETE"
            });
            fetchEvents(); // Refresh the list
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="app">
            <h1>PlanPal - Simple Event Planner</h1>

            {/* Add Event Form */}
            <div className="form">
                <h2>Add New Event</h2>
                <input
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button onClick={addEvent}>Add Event</button>
            </div>

            {/* Events List */}
            <div className="events">
                <h2>Upcoming Events</h2>
                {loading ? (
                    <p>Loading events...</p>
                ) : events.length === 0 ? (
                    <p>No events yet. Add one above!</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="event-card">
                            <h3>{event.title}</h3>
                            <p>{event.date}</p>
                            <button
                                onClick={() => deleteEvent(event.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default App;