# Portfolio Analysis Application

A comprehensive portfolio analysis tool that tracks and analyzes investment portfolio performance against Chinese market benchmarks (SHA, SHE, CSI300).

## Project info

**URL**: https://lovable.dev/projects/9b775905-83ab-4564-afcc-28a9f1711061

## Features

- **Portfolio Management**: Upload CSV data, create and switch between multiple portfolios
- **Performance Analysis**: Track portfolio performance with various financial metrics
- **Historical Comparison**: Compare portfolio against SHA, SHE, and CSI 300 benchmarks
- **Risk Metrics**: Calculate volatility, Sharpe ratio, Sortino ratio, beta, alpha, and more
- **Rolling Analysis**: Analyze performance over 30/60/90-day and 1/3/5-year rolling windows
- **Performance Attribution**: Break down returns into risk-free rate, market return, alpha, and unexplained components
- **Supabase Integration**: Persist portfolios and data in the cloud

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9b775905-83ab-4564-afcc-28a9f1711061) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9b775905-83ab-4564-afcc-28a9f1711061) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and Click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Recent Updates

### Enhanced Chart Visualizations and Extended Rolling Analysis (2025-01-30)

#### 1. Rolling Performance Analysis Extension
Extended the Rolling Performance chart in the Performance Attribution section to support multiple time periods:

- **New Period Options**: Added 1-year (365 days), 3-years (1,095 days), and 5-years (1,825 days) analysis
- **Dynamic Window Calculation**: Rolling window now adjusts based on selected period
- **Calendar Days**: All periods use calendar days (not just trading days) for accurate analysis
- **Interactive Period Selector**: Toggle between 90D, 1Y, 3Y, and 5Y views with button controls
- **Dynamic Reporting**: Conclusion text automatically updates to reflect the selected period

**Location**: `src/components/PerformanceAttribution.tsx`

#### 2. Performance Attribution Pie Chart Improvements
Enhanced the Performance Attribution pie chart for better visibility on all devices:

- **Increased Chart Height**: 200px → 280px for more space
- **Simplified Labels**: Shows only percentages on slices (e.g., "45%") instead of full text
- **Added Legend**: Full category names displayed below the chart with color indicators
- **Enhanced Tooltip**: Complete information shown on hover with category name and value
- **Larger Pie**: Increased radius for better visibility
- **Label Lines**: Added visual connection between slices and percentage labels

**Location**: `src/components/PerformanceAttribution.tsx`

#### 3. Historical Performance Chart Mobile Optimization
Improved the Historical Performance Comparison chart for better mobile viewing:

- **Removed Static Dots**: Eliminated dots at every data point for cleaner lines
- **Added Hover Dots**: Interactive dots appear only on hover/tap for data inspection
- **Increased Line Width**: Improved visibility with thicker lines (2-2.5px)
- **Cleaner Visualization**: Much easier to read trends on mobile devices

**Location**: `src/components/PerformanceChart.tsx`

#### Technical Details

**Period Calculations (Calendar Days)**:
- 90 days = 90 calendar days
- 1 year = 365 calendar days
- 3 years = 1,095 calendar days (365 × 3)
- 5 years = 1,825 calendar days (365 × 5)

**Benefits**:
- Better mobile experience with cleaner charts
- More comprehensive long-term performance analysis
- Improved readability across all devices
- Flexible time period selection for different analysis needs

**Testing**:
- ✅ Build successful
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ All existing functionality preserved
