# Cyber Project

A modern web application built with Next.js, React, and Supabase, featuring AI capabilities through LangChain and OpenAI integration.

## 🚀 Features

- Next.js 15.2.4 with React 19
- TypeScript support
- Supabase integration for backend services
- AI capabilities powered by LangChain and OpenAI
- Modern development environment

## 📦 Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account
- OpenAI API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd cyber-project
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
cyber-project/
├── src/
│   ├── app/         # Next.js app directory
│   ├── data/        # Data-related files
│   ├── lib/         # Utility functions and libraries
│   ├── scripts/     # Build and utility scripts
│   ├── search/      # Search functionality
│   ├── type/        # TypeScript type definitions
│   └── types/       # Additional type definitions
├── public/          # Static assets
├── supabase/        # Supabase configuration
└── ...
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Built With

- [Next.js](https://nextjs.org/) - The React framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [LangChain](https://www.langchain.com/) - Framework for developing AI applications
- [OpenAI](https://openai.com/) - AI models and APIs

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
