# IMF Gadget API

This is the IMF Gadget API, a Node.js application that provides an API for managing gadgets and user authentication.

## Features

- User signup and signin with JWT authentication
- CRUD operations for gadgets
- Middleware for user authentication
- Database schema defined using Drizzle ORM

## Project Structure

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/imf-gadget-api.git
   cd imf-gadget-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a [.env](http://_vscodecontentref_/6) file in the root directory and add your database URL and JWT secret:

   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. Run the application:
   ```
   npm start
   ```

### API Endpoints

- **POST /gadgets/signup**: User signup
- **POST /gadgets/signin**: User signin
- **GET /gadgets**: Get all gadgets (requires authentication)
- **POST /gadgets/add**: Add a new gadget (requires authentication)
- **PATCH /gadgets/update/:id**: Update a gadget by ID (requires authentication)
- **DELETE /gadgets/delete/:id**: Delete (decommission) a gadget by ID (requires authentication)