# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio analysis application that tracks and analyzes investment portfolio performance against Chinese market benchmarks (SHA, SHE, CSI300). The application is built with React + TypeScript + Vite and uses Supabase for data persistence.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development (with dev mode enabled)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### Data Flow Architecture

The application follows this data flow:
1. Portfolio data is loaded from Supabase or CSV file
2. Raw data is processed through `portfolioAnalysis.ts` to calculate metrics
3. Metrics are displayed via various specialized components
4. User can manage multiple portfolios and individual records via Supabase

### Key Modules

**Analysis Engine** (`src/utils/portfolioAnalysis.ts`)
- Core financial calculations including returns, volatility, Sharpe ratio, Sortino ratio, beta, alpha
- Rolling metrics calculations (30d/60d/90d windows)
- Correlation analysis against benchmarks
- CSV parsing for portfolio data import

**Database Layer** (`src/utils/portfolioDatabase.ts`)
- Supabase integration for portfolio persistence
- Handles pagination for large datasets (1000 records per page)
- CRUD operations for portfolios and individual records
- Derives calculated fields (shares, market value, gains) from stored data

**Main Page** (`src/pages/Index.tsx`)
- Orchestrates data loading and state management
- Manages portfolio selection and switching
- Coordinates between file uploads, database operations, and UI updates

### Database Schema

The app uses Supabase with two main tables:
- `portfolios`: Stores portfolio metadata (id, name, created_at)
- `portfolio_data`: Stores time-series data (date, principle, share_value, sha, she, csi300, portfolio_id)

Derived fields (shares, market_value, gain_loss, daily_gain) are calculated in the application layer rather than stored.

### Component Organization

**Analysis Components**:
- `PerformanceChart`: Line chart showing portfolio value over time
- `RollingMetricsChart`: Rolling returns and volatility visualization
- `DrawdownChart`: Drawdown analysis
- `PerformanceAttribution`: Breaks down performance vs benchmarks
- `InvestmentBehaviorAnalysis`: Market behavior during portfolio changes

**Data Management**:
- `FileUpload`: CSV import with automatic portfolio creation
- `PortfolioSelector`: Switch between saved portfolios
- `RecordDialog`: Add/edit individual portfolio records
- `ViewRecordsDialog`: Browse and edit records in table format

**UI Components** (`src/components/ui/`):
- Shadcn-ui components for consistent design
- All UI components are pre-configured and ready to use

### Path Aliasing

The project uses `@/` as an alias for `src/`. Example:
```typescript
import { MetricCard } from "@/components/MetricCard";
import { calculateRiskMetrics } from "@/utils/portfolioAnalysis";
```

### CSV Data Format

The application expects CSV files with this structure:
- Row 1: Sheet name (ignored)
- Row 2: Headers (ignored)
- Row 3+: Data in DD/MM/YYYY,SHA,SHE,CSI300,Shares,ShareValue,GainLoss,DailyGain,MarketValue,Principle format

The default portfolio is loaded from `/public/PORTFOLIO_SNAPSHOT.csv`.

### GitHub Pages Deployment

The app is configured for GitHub Pages deployment:
- Base path is set to `/portfolio-analysis/` in vite.config.ts
- BrowserRouter uses `basename="/portfolio-analysis"` in App.tsx
- 404.html redirects to index.html for client-side routing

### TypeScript Configuration

The project uses relaxed TypeScript settings for rapid development:
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedLocals: false`

When adding new code, follow the existing patterns rather than introducing stricter type checking.

### Financial Metrics Calculations

Key financial metrics are annualized using 252 trading days per year (Chinese market convention):
- Volatility: `stdDev * sqrt(252)`
- Returns: Calculated using compound annual growth rate (CAGR)
- Sharpe Ratio: Uses 2% risk-free rate by default
- Rolling metrics: Available in 30/60/90 day windows

### Supabase Integration

Environment variables needed:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These should be in `.env` file (not committed to git).

### State Management

The app uses React hooks for state management:
- Local component state with `useState`
- Side effects with `useEffect`
- React Query (`@tanstack/react-query`) for async data fetching (configured but not extensively used yet)

No global state management library is used; data flows through props and component hierarchies.
