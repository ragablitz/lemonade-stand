# Classic Lemonade Stand

A modern web application for managing a digital lemonade stand, built with [Next.js](https://nextjs.org). This project allows you to manage beverages, sizes, and prices, and provides a robust API using [NestJS](https://nestjs.com) for backend operations.

## Features

- 🍋 Manage beverages and their sizes
- 💵 Set and update prices
- 🛡️ API with validation and error handling (NestJS)
- ⚡ Fast, modern frontend (Next.js)
- 🗄️ Uses sqlite TypeORM for database operations

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, pnpm, or bun

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ragablitz/lemonade-stand.git
cd lemonade-stand
npm install
```

### Running the Development Server

Start the backend servers:

```bash
# For NestJS backend (from /src or /api directory)
npm run start:dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### API

The backend API is powered by NestJS and exposes endpoints for managing beverages and sizes.  
See the `/src/app/beverages` & `/src/app/order` module.
---
