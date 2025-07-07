# ENAL Caccia Treviso - Website Project

## Overview
Complete website for ENAL Caccia - Sezione Provinciale di Treviso (hunting association). Features user registration with admin approval, membership management, hunting competitions, news system, and specialized sections for hunting education, board information, and various sporting activities.

## Project Architecture

### Current Implementation
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **Routing**: Wouter for client-side routing

### Navigation Structure (Updated: January 2025)
- **Home & News**: Combined main page with latest updates
- **Scuola Venatoria**: Hunting school with courses and training programs
- **Direttivo**: Board members information and meeting schedules
- **Gare** (Dropdown Menu):
  - **Gare Cinofile**: Dog training competitions
  - **Gare Pesca**: Fishing competitions and events
  - **Gare Tiro**: Shooting competitions and tournaments
- **Pesca & Tiro**: Combined section for fishing and shooting activities
- **Tesseramento**: Membership registration and payments
- **Contatti**: Contact information and forms

## Recent Changes

### January 7, 2025 - GDPR Compliance & UI Improvements
- ✅ Implemented dropdown navigation menu for "Gare" section
- ✅ Created specialized pages for each competition type:
  - `scuola-venatoria.tsx` - Hunting school courses and information
  - `direttivo.tsx` - Board members with contact details and meeting schedules
  - `gare-cinofile.tsx` - Dog training competitions with registration system
  - `gare-pesca.tsx` - Fishing competitions across different venues
  - `gare-tiro.tsx` - Shooting competitions with safety regulations
  - `pesca-tiro.tsx` - Combined activities section for both sports
- ✅ Enhanced navbar component with responsive dropdown menus
- ✅ Added NavigationMenu component from Radix UI
- ✅ Updated routing in App.tsx to include all new pages
- ✅ Implemented consistent Italian language interface throughout
- ✅ Fixed database connection issues (500 errors resolved)
- ✅ Updated home page links to point to correct specialized pages
- ✅ Improved dropdown menu styling and functionality
- ✅ Created comprehensive TODO.md with implementation roadmap
- ✅ **GDPR Compliance**: Privacy Policy and Cookie Policy pages created
- ✅ **Cookie Management**: Banner with preference system and localStorage
- ✅ **Official Logo**: Updated ENAL logo with falcon design integrated in navbar and footer
- ✅ **Menu Alignment**: Fixed dropdown positioning for "Gare" section

### Database Integration (Previous)
- ✅ Migrated from in-memory storage to PostgreSQL
- ✅ Implemented Drizzle ORM with proper schema definitions
- ✅ Set up authentication with session management
- ✅ Created admin approval system for new users

## User Preferences
- **Language**: Italian interface preferred
- **Design**: Clean, professional appearance suitable for outdoor sports association
- **Navigation**: Specialized sections for different activities with clear organization
- **Target Audience**: Hunting enthusiasts, sports shooters, anglers in Treviso province

## Technical Notes
- Uses PostgreSQL database with persistent storage
- Admin account: admin@enalcaccia.it (password: admin123)
- All pages responsive with mobile-friendly navigation
- Consistent color scheme with forest green primary color
- Built-in error handling and loading states
- Stripe integration prepared (API keys pending user configuration)

## Outstanding Items
- Payment integration setup (requires Stripe API keys from user)
- Email notification system for membership approvals
- Advanced competition registration workflow
- File upload system for competition documents

## Architecture Dependencies
- Navigation menu uses @radix-ui/react-navigation-menu
- Database connection requires DATABASE_URL environment variable
- Session management with connect-pg-simple for PostgreSQL
- All form validation using Zod schemas with react-hook-form