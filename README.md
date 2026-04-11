# Task Manager Application

A simple yet premium Task Manager built with React (Frontend) and Express (Backend).

## Features

- **Full CRUD**: Create, Read, Update, and Delete tasks.
- **Status Management**: Mark tasks as completed or active.
- **Inline Editing**: Edit existing task titles directly.
- **Filtering**: View all, active, or completed tasks.
- **Persistence**: Tasks are saved to a local JSON file on the server.
- **Premium UI**: Glassmorphism design with smooth animations and responsive layout.
- **Error Handling**: Graceful error and loading states.

## Tech Stack

- **Frontend**: React, Vite, Vanilla CSS, Lucide React (Icons).
- **Backend**: Node.js, Express, UUID, CORS.
- **Storage**: JSON file-based storage.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm

### 1. Backend Setup

```bash
cd server
npm install
npm start
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```
The application will be available at https://task-manager-2k26.vercel.app/(https://task-manager-2k26.vercel.app/).

## Assumptions & Trade-offs

- **Storage**: Used a simple JSON file (`server/data/tasks.json`) for persistence instead of a full database (MongoDB/PostgreSQL) to keep the scope within the 1-2 hour requirement while still providing data persistence across refreshes.
- **State Management**: Used React's built-in `useState` and `useEffect` hooks for simplicity, as the application state is relatively straightforward.
- **Security**: Basic validation is implemented on the backend, but in a production environment, more robust security (authentication, request throttling, etc.) would be added.
- **Styling**: Leveraged Vanilla CSS with modern features (flexbox, grid, backdrop-filter) to demonstrate core CSS skills without relying on Tailwind or other libraries.
