# Quick Start - Multi-Institution Support 🚀

## ✅ What's New

### New Tab in App: **"Institutions"** 🏢

A new tab has been added to both tutor and resident views with a business icon.

---

## 📱 Three New Screens

### 1️⃣ My Institutions Screen

**What it does**: Shows all institutions you've joined

**Features**:

- 📊 Shows institution stats (forms count, submissions count)
- ➕ "Join More" button to browse more institutions
- 🔄 Pull to refresh
- 🎯 Tap institution to view its forms
- 💡 Empty state guides you to browse institutions if you haven't joined any

**Location**: `screens/MyInstitutionsScreen.js`

---

### 2️⃣ Browse Institutions Screen

**What it does**: Browse and join available institutions

**Features**:

- 🔍 Search bar to filter institutions
- 🏥 Shows institution details (name, code, description, contact)
- ✅ "Joined" badge for institutions you're already in
- ➕ "Join" button to join new institutions
- 🔄 Pull to refresh
- ⚡ Confirmation dialog before joining

**Location**: `screens/BrowseInstitutionsScreen.js`

---

### 3️⃣ Institution Forms Screen

**What it does**: View forms and submissions for a specific institution

**Features**:

- 📑 Two tabs:
  - **Available Forms**: All forms you can submit
  - **My Submissions**: Your submissions to this institution
- 🏢 Institution header with logo and name
- 📝 Tap form to submit
- 👁️ Tap submission to review
- 🔄 Pull to refresh on both tabs

**Location**: `screens/InstitutionFormsScreen.js`

---

## 🔄 Updated Existing Screens

### ✏️ Form Screen

- ✨ Now shows institution badge when submitting to an institution
- 📌 Includes institution context in submission
- 💾 Institution ID saved with form submission

### 📋 Resident Submissions Screen

- 🏢 Institution badges on submission cards
- 🎨 Better card layout
- 📱 Shows which institution each submission belongs to

---

## 🎯 How to Use (User Flow)

### First Time Setup

```
1. Login to app
2. Tap "Institutions" tab (business icon)
3. See "No Institutions Yet" message
4. Tap "Browse Institutions" button
5. Search or scroll through institutions
6. Tap "Join" on desired institution
7. Confirm join request
8. 🎉 You're now part of the institution!
```

### Submitting a Form to Institution

```
1. Tap "Institutions" tab
2. Tap on your institution
3. View "Available Forms" tab
4. Tap on a form
5. Fill out the form (notice institution badge at top)
6. Submit form
7. ✅ Form is now linked to that institution
```

### Viewing Your Submissions

```
1. Tap "Institutions" tab
2. Tap on your institution
3. Switch to "My Submissions" tab
4. View all submissions made to this institution
5. Tap any submission to review details
```

---

## 🎨 Visual Features

### Institution Cards

```
┌─────────────────────────────────────┐
│ 🏢 [Logo]  Hospital Name            │
│            H001                      │
│            Description text          │
│            📧 contact@hospital.com   │
│                              [Join]  │
└─────────────────────────────────────┘
```

### Institution Badge on Submission

```
┌─────────────────────────────────────┐
│ Form Name              🏢 Hospital A │
│ Submitted: 10/27/2025               │
│ Tutor: Dr. Smith                    │
│ ● Pending                           │
└─────────────────────────────────────┘
```

### My Institutions Card

```
┌─────────────────────────────────────┐
│ 🏢 [Logo]  Hospital Name         ›  │
│            H001                      │
│            📄 12 Forms               │
│            ✅ 45 Submissions         │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Details

### API Endpoints Used

| Endpoint                           | Method | Purpose                          |
| ---------------------------------- | ------ | -------------------------------- |
| `/institutions`                    | GET    | Browse all institutions          |
| `/institutions/me`                 | GET    | Get my institutions              |
| `/institutions/:id/join`           | POST   | Join institution                 |
| `/institutions/:id`                | GET    | Get institution details          |
| `/formTemplates?institutionId=xxx` | GET    | Get institution forms            |
| `/formSubmitions`                  | POST   | Submit form (with institutionId) |

### Files Created

- ✅ `api/institutions.js` - API service
- ✅ `screens/BrowseInstitutionsScreen.js`
- ✅ `screens/MyInstitutionsScreen.js`
- ✅ `screens/InstitutionFormsScreen.js`

### Files Modified

- ✏️ `screens/FormScreen.js` - Added institution context
- ✏️ `screens/ResidentSubmissionsScreen.js` - Added badges
- ✏️ `App.js` - Added institutions tab

---

## 🧪 Testing Steps

### Test 1: Browse Institutions

- [ ] Open app and tap "Institutions" tab
- [ ] See empty state if no institutions
- [ ] Tap "Browse Institutions"
- [ ] See list of institutions
- [ ] Use search bar to filter
- [ ] Join an institution
- [ ] See success message

### Test 2: View My Institutions

- [ ] Return to "My Institutions"
- [ ] See joined institution
- [ ] See correct stats (forms count, submissions count)
- [ ] Pull to refresh
- [ ] Tap institution

### Test 3: Submit Form to Institution

- [ ] From institution screen, see "Available Forms" tab
- [ ] Tap a form
- [ ] See institution badge at top
- [ ] Fill out form
- [ ] Submit form
- [ ] See success message with institution name

### Test 4: View Submissions

- [ ] Go to institution
- [ ] Switch to "My Submissions" tab
- [ ] See submitted form
- [ ] See institution badge on card
- [ ] Tap submission to review

### Test 5: Navigation

- [ ] Navigate through all screens
- [ ] Back button works correctly
- [ ] Tab switching works
- [ ] No navigation errors

---

## 🎓 Pro Tips

### For Users

1. **Join Multiple Institutions**: You can join as many institutions as you need
2. **Search Efficiently**: Use the search bar to quickly find institutions
3. **Check Stats**: See how many forms and submissions per institution
4. **Tab Switching**: Quickly switch between forms and submissions

### For Developers

1. **Pass Institution Context**: Always pass `institutionId` when navigating to FormScreen from institution flow
2. **Handle Empty States**: All screens handle empty data gracefully
3. **Query Invalidation**: Joining an institution automatically refreshes relevant data
4. **Theme Support**: All screens use ThemeContext for consistent styling

---

## 🚦 Status

| Feature             | Status      |
| ------------------- | ----------- |
| API Service         | ✅ Complete |
| Browse Institutions | ✅ Complete |
| My Institutions     | ✅ Complete |
| Institution Forms   | ✅ Complete |
| Form Submission     | ✅ Complete |
| Submission Badges   | ✅ Complete |
| Navigation          | ✅ Complete |
| Theme Support       | ✅ Complete |
| Error Handling      | ✅ Complete |
| Loading States      | ✅ Complete |
| Empty States        | ✅ Complete |
| Pull to Refresh     | ✅ Complete |
| Search              | ✅ Complete |

---

## 📝 Notes

- All screens support both light and dark themes
- All screens use React Query for data management
- All screens include proper error handling
- All screens have loading and empty states
- No linter errors in any file
- Follows existing code patterns and conventions

---

## 🎉 Ready to Use!

The multi-institution support is fully integrated and ready for testing. Users can now:

1. ✅ Browse and join institutions
2. ✅ View institution-specific forms
3. ✅ Submit forms with institution context
4. ✅ Track submissions by institution
5. ✅ Manage multiple institutions

**Happy coding! 🚀**
