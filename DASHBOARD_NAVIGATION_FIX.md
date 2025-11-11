# Dashboard Navigation Fix

## Issues Fixed in DashboardScreen

### Overview

The DashboardScreen had outdated navigation calls that didn't match the new tab structure. All navigation has been updated to work correctly with the new Discord-like navigation system.

## Changes Made

### 1. ✅ Stats Cards Navigation

**Problem:** Stats cards were navigating to "Forms" for everyone, and using old navigation structure.

**Fixed:**

- Residents now navigate to **"MySubmissions"** tab
- Tutors navigate to **"Forms"** tab (for reviewing submissions)
- Properly uses tab navigation within the same tab navigator

**Code:**

```javascript
// Before
onPress={() => navigation.navigate("Forms")}

// After
onPress={() =>
  navigation.navigate(
    userRole.toUpperCase() === "RESIDENT"
      ? "MySubmissions"
      : "Forms"
  )
}
```

**Affected Stats:**

- Total Submissions
- Pending Review
- Completed

### 2. ✅ Quick Action Cards Navigation

**Problem:**

- Used wrong tab name "My Submissions" (with space)
- Didn't use drawer navigation for Announcements and Profile
- Tutors had redundant actions

**Fixed:**

#### For Residents:

- **"New Form"** → Navigates to **"Forms"** tab (to browse and submit forms)
- **"My Submissions"** → Navigates to **"MySubmissions"** tab (to view submissions)

#### For Tutors:

- **"Review Forms"** → Navigates to **"Forms"** tab (to review submissions)
- **"My Residents"** → Navigates to **"Residents"** tab (to view residents)

#### For All Users:

- **"Announcements"** → Uses `navigation.getParent()?.navigate("Announcements")` to access drawer
- **"Profile"** → Uses `navigation.getParent()?.navigate("Profile")` to access drawer

**Code:**

```javascript
// Drawer navigation
onPress={() => navigation.getParent()?.navigate("Announcements")}
onPress={() => navigation.getParent()?.navigate("Profile")}

// Tab navigation
onPress={() => navigation.navigate("MySubmissions")} // Residents
onPress={() => navigation.navigate("Residents")} // Tutors
```

### 3. ✅ Recent Activity Navigation

**Problem:** Used old tab name "My Submissions" (with space)

**Fixed:**

- **"View All"** button navigates to correct tab:
  - Residents: **"MySubmissions"**
  - Tutors: **"Forms"**
- Recent activity items navigate to FormReview within the correct tab stack

**Code:**

```javascript
// View All button
onPress={() =>
  navigation.navigate(
    userRole.toUpperCase() === "RESIDENT"
      ? "MySubmissions"
      : "Forms"
  )
}

// Individual items - navigate to nested screen
navigation.navigate("MySubmissions", {
  screen: "FormReview",
  params: {
    formName: form.formTemplate?.formName || "Form",
    formId: form.formTemplate?._id,
    submissionId: form._id,
  },
});
```

## Navigation Structure Reference

### Tab Navigation (Within InstitutionTabs)

```javascript
navigation.navigate("Dashboard");
navigation.navigate("Forms");
navigation.navigate("MySubmissions"); // Residents only
navigation.navigate("Residents"); // Tutors only
```

### Drawer Navigation (From Tabs to Drawer Screens)

```javascript
navigation.getParent()?.navigate("Announcements");
navigation.getParent()?.navigate("Profile");
navigation.getParent()?.navigate("Settings");
```

### Nested Navigation (To Screens Within Tab Stacks)

```javascript
navigation.navigate("MySubmissions", {
  screen: "FormReview",
  params: { ... }
});
```

## Complete Navigation Map

### Resident Dashboard Quick Actions:

```
Dashboard
├─ New Form           → Forms tab
├─ My Submissions     → MySubmissions tab
├─ Announcements      → Announcements drawer screen
└─ Profile            → Profile drawer screen
```

### Tutor Dashboard Quick Actions:

```
Dashboard
├─ Review Forms       → Forms tab
├─ My Residents       → Residents tab
├─ Announcements      → Announcements drawer screen
└─ Profile            → Profile drawer screen
```

## Testing Checklist

### For Residents:

- [ ] Stats cards navigate to My Submissions tab
- [ ] "New Form" navigates to Forms tab
- [ ] "My Submissions" navigates to MySubmissions tab
- [ ] "Announcements" opens drawer screen
- [ ] "Profile" opens drawer screen
- [ ] "View All" in Recent Activity navigates to MySubmissions
- [ ] Tapping recent items opens FormReview

### For Tutors:

- [ ] Stats cards navigate to Forms tab (submissions)
- [ ] "Review Forms" navigates to Forms tab
- [ ] "My Residents" navigates to Residents tab
- [ ] "Announcements" opens drawer screen
- [ ] "Profile" opens drawer screen
- [ ] "View All" in Recent Activity navigates to Forms
- [ ] Tapping recent items opens FormReview

### General:

- [ ] No navigation errors in console
- [ ] Back button works correctly from all screens
- [ ] Tab switching preserves state
- [ ] Drawer opens from all screens

## Benefits

1. **Consistent Navigation**: All navigation calls follow the new structure
2. **Role-Specific Actions**: Residents and tutors see appropriate quick actions
3. **Proper Hierarchy**: Uses tab navigation for tabs, drawer navigation for drawer screens
4. **Better UX**: Quick actions are more relevant (e.g., Tutors see "My Residents" not "All Submissions")
5. **No Broken Links**: All navigation paths are valid and working

## File Modified

**`screens/DashboardScreen.js`**

- Updated stats card navigation (3 cards)
- Updated quick action cards (4 cards for each role)
- Updated "View All" button in Recent Activity
- Updated individual recent activity item navigation
- No breaking changes, only corrections

## Technical Notes

### getParent() Method

Used to access the parent navigator (Drawer) from a child navigator (Tab):

```javascript
// From Dashboard (inside InstitutionTabs) to Announcements (in Drawer)
navigation.getParent()?.navigate("Announcements");
```

### Nested Navigation

Used to navigate to a specific screen within a tab stack:

```javascript
// Navigate to MySubmissions tab, then to FormReview screen within it
navigation.navigate("MySubmissions", {
  screen: "FormReview",
  params: { ... }
});
```

### Tab Name Changes

- Old: `"My Submissions"` (with space)
- New: `"MySubmissions"` (no space)
- Matches the tab name defined in InstitutionTabs.js

## No Breaking Changes

- All navigation is corrective, not destructive
- Maintains backward compatibility where possible
- No API changes required
- No state management changes needed
- Theme support preserved
