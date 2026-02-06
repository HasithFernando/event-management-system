# Role-Based User System Implementation

## Overview
This document describes the comprehensive role-based user system implementation with separate dashboards for Organizers and Attendees.

## Architecture

### User Roles
- **ORGANIZER**: Can create, manage, and host events
- **USER/ATTENDEE**: Can browse events, purchase tickets, and manage bookings
- **ADMIN**: Has access to organizer features (same as ORGANIZER)

## Implementation Details

### 1. Authentication Pages

#### Login Page (`frontend/src/app/auth/login/page.tsx`)
- **User Type Selector**: Tabs to switch between Organizer and Attendee login
- **Features**:
  - Email and password input fields
  - Google OAuth integration
  - User type selection (visual indicator)
  - Error handling and loading states
  - Responsive design with illustration

#### Register Page (`frontend/src/app/auth/register/page.tsx`)
- **Role Selection**: Dropdown to select between Attendee and Organizer
- **Features**:
  - First name, last name, email, phone fields
  - Password input with validation
  - Role selection (USER/ORGANIZER)
  - Google OAuth registration
  - Form validation and error handling

### 2. Dashboard Routing

#### Main Dashboard (`frontend/src/app/dashboard/page.tsx`)
- **Purpose**: Acts as a router/redirect page
- **Logic**:
  - Checks user authentication status
  - Redirects to `/dashboard/organizer` if user role is ORGANIZER or ADMIN
  - Redirects to `/dashboard/attendee` if user role is USER
  - Redirects to login if not authenticated
  - Shows loading spinner during redirect

### 3. Organizer Dashboard (`frontend/src/app/dashboard/organizer/page.tsx`)

#### Layout
- **Sidebar Navigation**:
  - Dashboard (active by default)
  - Events
  - Attendees
  - Settings
  - Create Event button (prominent)
  - Sign Out button

#### Features
- **Dashboard Overview**:
  - Total Revenue: Sum of all ticket sales
  - Total Attendees: Count of all attendees across events
  - Events Hosted: Total number of events created
  - Avg. Ticket Price: Average price across all events

- **Revenue Analytics**:
  - Line chart showing revenue over months
  - Placeholder for chart visualization
  - Quick stats sidebar showing:
    - Active Events count
    - Draft Events count
    - Sold Out Events count
    - Completed Events count

- **Upcoming Events Table**:
  - Event name, date, capacity, price, status
  - Action links to view/edit events
  - Status badges (PUBLISHED, DRAFT, SOLD_OUT, COMPLETED)
  - Pagination for large event lists

#### Data Fetching
```typescript
- Fetches all events by organizer ID
- Calculates statistics from event data
- Handles loading and error states
- Protects route from unauthorized access
```

### 4. Attendee Dashboard (`frontend/src/app/dashboard/attendee/page.tsx`)

#### Layout
- **Navigation Bar**:
  - EventHub logo
  - Dashboard, My Tickets, Saved Events links
  - Sign Out button

#### Features
- **Hero Section**:
  - "Find your next experience" headline
  - Search bar for event discovery
  - Real-time search filtering

- **Trending Events Section**:
  - Grid layout (3 columns on desktop, responsive)
  - Event cards showing:
    - Event image/thumbnail
    - Price badge
    - Category badge
    - Title and description
    - Date, time, and location
    - Available seats with progress bar
    - "Get Tickets" or "Ticket Purchased" button
  - Search filtering by title and description

- **My Tickets Section**:
  - Shows user's purchased tickets
  - Displays:
    - Event title and booking reference
    - Booking status (CONFIRMED, PENDING)
    - Event date and location
    - Number of tickets
    - Total amount paid
  - Limited to 4 most recent tickets

- **Discover Section**:
  - Call-to-action to browse all events
  - Link to full events catalog

#### Data Fetching
```typescript
- Fetches all published events
- Fetches user's bookings
- Filters events based on search query
- Checks if user has already booked an event
- Handles loading and error states
```

### 5. Sidebar Component (`frontend/src/components/Sidebar.tsx`)

#### Role-Based Navigation
**For Organizers**:
- Dashboard → `/dashboard/organizer`
- Events → `/my-events`
- Attendees → `/dashboard/organizer/attendees`
- Settings → `/settings`

**For Attendees**:
- Dashboard → `/dashboard/attendee`
- My Tickets → `/my-tickets`
- Discover → `/events`
- Saved Events → `/saved-events`

#### Features
- Calendar widget (same for both roles)
- Quick stats section
- Categories section (attendees only)
- Settings and Logout buttons

### 6. Type Updates

#### RegisterRequest Type
```typescript
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'USER' | 'ORGANIZER';
}
```

## User Flow

### Registration Flow
1. User visits `/auth/register`
2. Fills in personal information
3. Selects role (Attendee or Organizer)
4. Submits form
5. Backend creates user with selected role
6. User is logged in automatically
7. Redirected to appropriate dashboard

### Login Flow
1. User visits `/auth/login`
2. Optionally selects user type (visual indicator only)
3. Enters email and password
4. Submits form
5. Backend authenticates user
6. User is logged in
7. Redirected to `/dashboard`
8. Dashboard redirects to role-specific dashboard

### Dashboard Access Flow
1. User navigates to `/dashboard`
2. Main dashboard checks user role
3. Redirects to `/dashboard/organizer` or `/dashboard/attendee`
4. Role-specific dashboard loads with appropriate data

## Styling & Design

### Color Scheme
- **Primary**: Indigo (#3b82f6, #2563eb)
- **Accent**: Purple (#a855f7, #9333ea)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Components
- **Cards**: Rounded corners (2xl), subtle shadows, hover effects
- **Buttons**: Consistent styling with hover states
- **Tables**: Clean design with alternating row colors
- **Badges**: Status indicators with color coding
- **Progress Bars**: Visual representation of capacity

## Security Considerations

1. **Route Protection**: Dashboards check authentication and role before rendering
2. **Token Validation**: AuthContext validates JWT tokens on mount
3. **Unauthorized Access**: Redirects to login if not authenticated
4. **Role-Based Access**: Organizer features only accessible to ORGANIZER/ADMIN roles

## API Integration

### Services Used
- `eventService.getAllEvents()`: Fetch all published events
- `eventService.getEventsByOrganizer(userId)`: Fetch organizer's events
- `bookingService.getBookingsByUser(userId)`: Fetch user's bookings

### Error Handling
- Try-catch blocks for all API calls
- User-friendly error messages
- Fallback UI for empty states

## Responsive Design

### Breakpoints
- **Mobile**: Single column layouts
- **Tablet**: 2-column grids
- **Desktop**: 3-4 column grids

### Mobile Optimizations
- Hamburger menu for navigation (if needed)
- Touch-friendly button sizes
- Optimized card layouts
- Readable font sizes

## Future Enhancements

1. **Analytics Dashboard**: More detailed charts and metrics
2. **Event Management**: Full CRUD operations for organizers
3. **Attendee Management**: View attendee details and export lists
4. **Notifications**: Real-time notifications for bookings and events
5. **Payment Integration**: Stripe/PayPal integration
6. **Email Notifications**: Confirmation emails and reminders
7. **Advanced Search**: Filters by date, price, location, category
8. **Wishlist**: Save events for later
9. **Reviews & Ratings**: User reviews for events
10. **Social Sharing**: Share events on social media

## Testing Checklist

- [ ] Login with organizer credentials
- [ ] Login with attendee credentials
- [ ] Register as organizer
- [ ] Register as attendee
- [ ] Verify organizer dashboard displays correctly
- [ ] Verify attendee dashboard displays correctly
- [ ] Test event search functionality
- [ ] Test ticket purchase flow
- [ ] Verify sidebar navigation for both roles
- [ ] Test logout functionality
- [ ] Test responsive design on mobile
- [ ] Test error handling for failed API calls
- [ ] Verify role-based access control

## File Structure

```
frontend/src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx (Updated)
│   │   └── register/
│   │       └── page.tsx (Updated)
│   └── dashboard/
│       ├── page.tsx (Updated - Router)
│       ├── organizer/
│       │   └── page.tsx (New)
│       └── attendee/
│           └── page.tsx (New)
├── components/
│   └── Sidebar.tsx (Updated)
├── contexts/
│   └── AuthContext.tsx (Existing)
├── services/
│   ├── eventService.ts (Existing)
│   └── bookingService.ts (Existing)
└── types/
    └── index.ts (Updated)
```

## Deployment Notes

1. Ensure backend API endpoints are properly configured
2. Update environment variables for API base URL
3. Test OAuth configuration for Google login
4. Verify database migrations for role field
5. Test with real data before production deployment

## Support & Maintenance

For issues or questions:
1. Check browser console for errors
2. Verify API connectivity
3. Check user authentication status
4. Review network requests in DevTools
5. Check backend logs for API errors
