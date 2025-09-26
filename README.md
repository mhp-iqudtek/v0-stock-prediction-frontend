# Quant-Trade Frontend

A professional stock prediction dashboard built with Next.js, featuring advanced filtering, sorting, pagination, and real-time data integration.

## Features

- **Professional Stock Trading Theme**: Dark theme optimized for financial data with proper color coding
- **Advanced Filtering**: Search, sector filtering, price ranges, date ranges, and prediction filters
- **Sorting & Pagination**: Interactive column sorting with customizable page sizes
- **API Integration**: Ready-to-connect backend integration with fallback to demo data
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Refresh functionality for live data updates

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes (example implementation)
│   ├── globals.css        # Global styles with financial theme
│   ├── layout.tsx         # Root layout with branding
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── layout/            # Header and footer components
│   ├── stock/             # Stock-specific components
│   │   ├── stock-data-table.tsx      # Main data table
│   │   ├── stock-filters.tsx         # Advanced filtering
│   │   ├── date-range-selector.tsx   # Date range picker
│   │   └── pagination-controls.tsx   # Pagination UI
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── use-stocks.ts      # Stock data fetching hook
├── lib/                   # Utility functions
│   ├── api.ts             # API integration layer
│   ├── mock-data.ts       # Demo data
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript definitions
    └── stock.ts           # Stock data types
\`\`\`

## API Integration

The frontend is designed to work with your backend API. Update the `API_BASE_URL` in `lib/api.ts`:

\`\`\`typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
\`\`\`

### Expected API Endpoints

- `GET /api/stocks` - Get paginated stock data with filtering and sorting
- `GET /api/stocks/{symbol}` - Get individual stock data
- `GET /api/stocks/{symbol}/history` - Get stock prediction history
- `GET /api/stocks/sectors` - Get available sectors
- `GET /api/dashboard/stats` - Get dashboard statistics

### API Response Format

\`\`\`typescript
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
\`\`\`

## Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features Overview

### Dashboard
- Key metrics cards showing predictions, accuracy, active stocks, and market trends
- "Powered by iquedtek" branding throughout the interface

### Data Table
- Sortable columns for all stock data fields
- Color-coded price changes (green for gains, red for losses)
- Prediction indicators with confidence levels
- Responsive design with proper mobile handling

### Filtering System
- Text search for symbols and company names
- Sector-based filtering
- Price range sliders
- Daily change percentage filters
- Prediction confidence ranges
- Date range selector with presets (Today, Last 7 days, etc.)

### Pagination
- Customizable page sizes (10, 25, 50, 100)
- Smart page navigation with ellipsis
- Results counter and navigation controls

## Customization

### Theming
The color scheme is defined in `app/globals.css` using CSS custom properties. Modify the color values to match your brand:

\`\`\`css
:root {
  --primary: oklch(0.45 0.15 220);  /* Primary brand color */
  --success: oklch(0.55 0.15 140);  /* Success/gains color */
  --destructive: oklch(0.65 0.2 15); /* Error/losses color */
}
\`\`\`

### API Integration
Replace the mock data in `lib/mock-data.ts` with your actual API calls in `lib/api.ts`. The frontend will automatically handle loading states and error fallbacks.

## Production Deployment

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **date-fns** - Date manipulation utilities
- **React Day Picker** - Date range selection

## Support

For questions or support, contact the development team or refer to the API documentation.
