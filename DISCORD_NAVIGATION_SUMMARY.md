# Discord-Like Navigation Implementation Summary

## Overview

The app now features a Discord-inspired navigation structure with a side drawer menu displaying institutions (like Discord channels) and institution-specific tabs.

## Navigation Structure

### Main Structure

```
Drawer Navigator (MainDrawer)
├── Custom Drawer Content (Institution List)
├── Institution Tabs (Default Screen)
│   ├── Dashboard Tab
│   ├── Forms Tab
│   └── Submissions Tab (Residents only)
├── Announcements
├── Profile
├── Settings
└── Browse Institutions
```

## Key Components

### 1. **MainDrawer.js** (`navigation/MainDrawer.js`)

- Main drawer navigator wrapping the entire app
- Contains routes for Institution, Announcements, Profile, Settings
- Uses custom drawer content to display institutions list

### 2. **CustomDrawerContent.js** (`components/CustomDrawerContent.js`)

- Custom drawer UI displaying institutions like Discord channels
- Features:
  - Institution list with logos/avatars
  - Auto-selects first institution on load
  - Quick access to Announcements, Profile, Settings
  - Logout button
  - Add institution button

### 3. **InstitutionTabs.js** (`navigation/InstitutionTabs.js`)

- Bottom tabs specific to selected institution
- Tabs vary by user role:
  - **Residents**: Dashboard, Forms, Submissions
  - **Tutors**: Dashboard, Forms (submissions review)

### 4. **InstitutionContext.js** (`contexts/InstitutionContext.js`)

- Global state management for selected institution
- Provides `selectedInstitution` and `setSelectedInstitution`
- Used across the app to access current institution data

### 5. **WelcomeScreen.js** (`screens/WelcomeScreen.js`)

- Displayed when no institution is selected
- Guides users to browse or select an institution from drawer

### 6. **SettingsScreen.js** (`screens/SettingsScreen.js`)

- New dedicated settings screen
- Features:
  - Account management (Edit Profile, Change Password, Delete Account)
  - Preferences (Dark Mode toggle)
  - Information (About Us, Privacy Policy)

## User Experience Flow

### First Time Users

1. Login → See Welcome Screen (no institutions)
2. Open drawer or click "Browse Institutions"
3. Join an institution
4. Institution auto-selected → View tabs

### Returning Users

1. Login → First institution auto-selected
2. See institution-specific tabs (Dashboard, Forms, etc.)
3. Open drawer to:
   - Switch between institutions
   - Access Profile
   - Access Settings
   - View Announcements
   - Join more institutions

## Key Features

### Discord-Like Elements

- **Side drawer menu** with institution list (like Discord's server list)
- **Institution avatars/logos** displayed in circular format
- **Active institution highlighting** in the drawer
- **Quick navigation** between institutions
- **Centralized settings and profile** in drawer

### Institution-Specific Views

- Each institution has its own set of tabs
- Forms and submissions are filtered by selected institution
- Dashboard shows institution-specific data

### Role-Based Tabs

- **Residents**: Can submit forms and view their submissions
- **Tutors**: Can review submissions and manage residents

## File Changes Summary

### New Files

- `contexts/InstitutionContext.js` - Institution state management
- `components/CustomDrawerContent.js` - Custom drawer UI
- `navigation/MainDrawer.js` - Main drawer navigator
- `navigation/InstitutionTabs.js` - Institution-specific tabs
- `screens/WelcomeScreen.js` - No institution selected screen
- `screens/SettingsScreen.js` - Settings screen

### Modified Files

- `App.js` - Replaced bottom tabs with drawer navigator, added InstitutionProvider

### Removed Dependencies

- Old bottom tab navigation structure removed
- Institutions tab removed (now in drawer)

## Benefits

1. **Better Organization**: Institutions are clearly separated
2. **Scalability**: Easy to add more institutions without cluttering UI
3. **Familiar UX**: Discord-like navigation is intuitive for modern users
4. **Context Awareness**: Always know which institution you're working with
5. **Quick Switching**: Fast navigation between institutions via drawer

## Technical Implementation

### Context Provider Hierarchy

```jsx
<QueryClientProvider>
  <ThemeProvider>
    <InstitutionProvider>
      <AppContent />
    </InstitutionProvider>
  </ThemeProvider>
</QueryClientProvider>
```

### Navigation Flow

1. User selects institution from drawer
2. `setSelectedInstitution()` updates global state
3. All tabs access `selectedInstitution` via `useInstitution()` hook
4. Institution data automatically flows to all screens

## Future Enhancements

Potential improvements:

- Institution search in drawer
- Favorite institutions
- Institution-specific notifications
- Recently viewed institutions
- Direct messaging between users in same institution
- Institution-specific announcements badge

## Testing

To test the new navigation:

1. Start the app: `npx expo start`
2. Login with your credentials
3. Open the drawer (hamburger menu or swipe from left)
4. Select different institutions to see tabs update
5. Navigate to Profile, Settings, Announcements from drawer
6. Try browsing and joining new institutions

## Troubleshooting

If institutions don't load:

- Check internet connection
- Verify backend API is accessible
- Check console for API errors

If navigation seems broken:

- Clear cache: `npx expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Dependencies

The implementation uses:

- `@react-navigation/drawer` (v7.7.2)
- `@react-navigation/bottom-tabs` (v7.7.3)
- `@react-navigation/native` (v7.1.19)
- `@react-navigation/stack` (v7.6.2)
- `react-native-gesture-handler` (v2.28.0)
- `@tanstack/react-query` (v5.64.1)

All dependencies were already installed in the project.
