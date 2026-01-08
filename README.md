# WhisperBox

A production-ready, anonymous Q&A web application. Receive messages from anyone without revealing their identity.

## Features

- **Anonymous Messaging**: Send messages securely without login.
- **Identity Options**: Senders can choose to be fully anonymous, use initials, or provide a name.
- **Dashboard**: Receivers can manage messages (Delete) in a private dashboard.
- **Public Profile**: Shareable link `u/[username]` for receiving messages.
- **Moderation**: Basic keyword filtering for safety.
- **Modern UI**: Built with Tailwind CSS, supporting Dark Mode (system).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Shadcn UI compatible variables)
- **Database**: MongoDB (via Prisma ORM)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Deployment**: Vercel Ready

## Getting Started

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `env.example` to `.env` and fill in your values.
   ```bash
   cp env.example .env
   ```
   Required variables:
   - `DATABASE_URL`: MongoDB connection string.
   - `NEXTAUTH_SECRET`: Random string for encryption.
   - `NEXTAUTH_URL`: `http://localhost:3000` (local) or your domain.

3. **Database Setup**
   ```bash
   npx prisma generate
   # For MongoDB, 'prisma db push' or ensure your cluster is accessible
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Configure the **Environment Variables** in Vercel settings (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
4. Redeploy.

## Project Structure

- `/app`: Next.js App Router pages and API.
- `/components`: Reusable UI components.
- `/lib`: Utilities, Prisma client, Server Actions.
- `/prisma`: Database schema.
