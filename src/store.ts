// This file is kept for backward compatibility.
// All data operations now go through src/api.ts → server/index.js → SQLite DB.
// The initializeData function is a no-op since the server seeds the database.

export function initializeData() {
  // Database seeding is handled by the server (server/db.js)
}

