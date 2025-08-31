# MoneyTracker Pro - Personal Finance Management

A comprehensive expense tracker web application with budget insights and advanced analytics.

## Features

- 📊 **Dashboard**: Real-time financial metrics and insights
- 💰 **Transaction Management**: Add income and expenses with categorization
- 🎯 **Budget Management**: Set monthly budgets and track spending goals
- 📈 **Analytics**: Interactive charts showing spending trends and category breakdowns
- 📄 **Export**: Generate CSV reports of your financial data
- 🌙 **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- **Frontend**: React 18 with TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite for fast development and production builds

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5000`

## Deployment

### GitHub Pages (Frontend Only)

1. **Update base path** in `vite.config.github.ts`:
   ```typescript
   base: '/your-repo-name/', // Replace with your actual repo name
   ```

2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to main branch

### Full Stack Deployment Options

For full-stack deployment with database, consider:
- **Vercel** + **Neon Database**: Best for React/Node.js apps
- **Netlify** + **Supabase**: Alternative with great developer experience  
- **Railway** or **Render**: Full-stack hosting with PostgreSQL
- **Heroku**: Traditional platform-as-a-service option

## Project Structure

```
├── client/src/          # Frontend React application
├── server/              # Backend Express API
├── shared/              # Shared types and schemas
├── .github/workflows/   # GitHub Actions deployment
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

Screenshots.
<img width="1350" height="579" alt="Screenshot 2025-08-31 163513" src="https://github.com/user-attachments/assets/b619659c-3409-4561-8a06-56eaa5e45a7c" />
