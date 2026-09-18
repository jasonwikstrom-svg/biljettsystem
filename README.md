# Biljettsystem

A full-stack ticket system. The project demonstrates CORS handling, a Node.js/Express backend, a SQLite database, and a React frontend consuming a REST API.

---

## Description

- **Backend**: Node.js + Exepress, exposing a REST API for managing tickets. 
- **Frontend**: React a simple interface for create, use, delete and list tickets.
- **Database**: SQLite, stored locally in `backend/tickets.db`.
- **CORS**: The backend allows requests from the frontend using the CORS middleware.

---

## Features

- Create a new ticket with a randomly generated code.
- Use a ticket by marking it as used.
- Delete an unused ticket
- List all tickets with their status (used or unused).

---

## Databasdesign

Tabell `tickets`:

| Kolumn      | Typ     | Beskrivning                           |
|-------------|---------|---------------------------------------|
| id          | INTEGER | Unique identifier for each ticket     |
| code        | TEXT    | Randomly generated ticket code        |
| created_at  | TEXT    | Timestamp when the ticket was created |
| used        | INTEGER | 0 = unused, 1 = used                  |

![Databasdesign](databasdesign.png)

---

## API Endpoints

| Method | Endpoint             | Description                                  |
|--------|-----------------------|-----------------------------------------------|
| GET    | `/tickets`             | List all tickets                              |
| POST   | `/tickets`             | Create a new ticket                           |
| POST   | `/tickets/:code/use`   | Use a ticket (returns 409 if already used)    |
| DELETE | `/tickets/:code`       | Delete an unused ticket (409 if already used) |

---

## Getting Started


### 1. Backend
```bash
cd backend
npm install
npm start
```
The backend starts on `http://localhost:3001`. The SQLite database is created automatically in `backend/tickets.db`.

### 2. Frontend
```bash
cd frontend
npm install
npm start
```

Open the URL shown in the terminal (usually `http://localhost:5173`) to access the frontend. Make sure the backend is running at the same time.

---

## Project Structure

biljettsystem/
├── backend/
│ ├── db.js # database connection and table setup
│ ├── server.js # Express server and API routes
│ ├── tickets.db # SQLite database (created automatically)
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── assets/
│ │ ├── App.jsx # main React component (UI logic)
│ │ ├── App.css
│ │ ├── main.jsx # React entry point
│ │ └── index.css
│ └── package.json
├── database-design.png
└── README.md                # Node.js/Express backend

---

## Known Issue and Fix 

While building the delete feature, I found that a used ticket could still be deleted from the ticket list in the UI even though the backend correctly rejected the
request with a 409 conflict. The problem was that the frontend updated its state right after the fetch call, without checking whether the request had actually succeeded.

**Fix** the frontend now checks `response.ok` before removing the ticket from the list, so the UI only updates when the backend confirms the deletion was succesful.