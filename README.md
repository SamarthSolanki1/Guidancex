# 🚀 GuidanceX – AI-Powered Career Development Platform

**GuidanceX** is a full-stack web application built to guide users through their career development journey using AI-powered tools and personalized experiences. From onboarding and industry insights to resume generation, interactive quizzes, and cover letter creation, GuidanceX provides everything users need to plan, track, and grow their careers — all in one centralized platform.

---

## 🎯 Key Objectives

- ✅ Deliver **personalized career guidance** based on user-selected industries and skills.
- 🤖 Automate **resume and cover letter creation** using Markdown and AI (Google Gemini).
- 🧠 Provide **interactive AI-generated quizzes** to monitor learning progress.
- 📊 Visualize **industry trends** and **user performance** through dynamic charts and dashboards.

---

## ✨ Features

### 👤 User Authentication & Profiles
- Secure signup/login using **Clerk**
- Customizable user profile pages

### 🚀 Onboarding Flow
- Choose industry, sub-industry, and skills
- Data stored in **PostgreSQL** via **Prisma**

### 📈 Industry Insights
- AI-curated:
  - Market outlook
  - Salary trends
  - Trending job roles
  - Recommended skills
- Displayed with dynamic **Shadcn charts**

### 📄 Resume Builder
- Built with **Markdown templates**
- Real-time preview and customization
- PDF export for professional use

### 🧪 AI Quiz Module
- AI-generated multiple-choice quizzes
- Auto-scored with performance tracking

### ✉️ Cover Letter Generator
- Role- and company-specific letters powered by **Google Gemini**
- Editable, storable, and downloadable

### 📊 User Dashboard
- All-in-one dashboard displaying:
  - Resume preview
  - Quiz history & performance
  - Cover letter archive
  - Personalized industry insights

---

## 🛠 Tech Stack

| Layer                  | Technology                     |
|------------------------|--------------------------------|
| **Frontend Framework** | Next.js                        |
| **UI Components**      | Shadcn (Tailwind CSS)          |
| **Authentication**     | Clerk                          |
| **Background Jobs**    | Inngest                         |
| **ORM & Database**     | Prisma + PostgreSQL            |
| **AI Integration**     | Google Gemini API              |
| **Hosting**            | Vercel                         |

---

## 🧩 Architecture & Components

### ⚙️ Next.js
- Server-side rendering for SEO and performance
- API routes for backend logic

### 🔐 Clerk
- Authentication, session handling, and profile management
- Prebuilt UI components and hooks

### 🗃️ Prisma + PostgreSQL
- Type-safe ORM with flexible schema
- Core models:
  - `User`
  - `IndustryPreference`
  - `ResumeData`
  - `QuizResult`
  - `CoverLetter`
  - `Skill`

### 🔄 Inngest
- Manages background jobs:
  - AI-driven quiz scoring
  - Cover letter generation

### 🤖 Google Gemini API
- Used for:
  - Quiz creation and evaluation
  - Role-specific cover letter generation

---

## 🚀 Deployment

- Deployed via **Vercel**
- CI/CD enabled for smooth and fast releases
- Environment variables securely managed

---

## 🔮 Future Enhancements

- Skill progress tracking with AI recommendations
- Public resume/portfolio sharing
- Job board and LinkedIn integration
- AI career roadmap suggestions

---

## 📄 License

This project is open-source and intended for educational and developmental use.

---

## 🙌 Acknowledgements

- [Clerk](https://clerk.dev/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Inngest](https://www.inngest.com/)
- [Prisma](https://www.prisma.io/)
- [Google Gemini](https://ai.google/)
- [Vercel](https://vercel.com/)



## Instalation




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


## Env setup 

  # Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# PostgreSQL Database
DATABASE_URL=your_postgresql_database_url
DIRECT_URL=your_postgresql_direct_url

# Google Gemini API
GEMINI_API_KEY=your_google_gemini_api_key



Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
