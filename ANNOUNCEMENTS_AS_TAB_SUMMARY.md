# Announcements Moved to Institution Tabs

## Overview

Announcements have been moved from the global drawer menu to institution-specific tabs. Each institution now has its own Announcements tab showing only announcements relevant to that institution.

## Changes Made

### 1. ✅ Updated Announcement API

**File:** `api/announcement.js`

Added support for filtering announcements by institution:

```javascript
export const announcementService = {
  // Get all announcements (global)
  getAllAnnouncements: async () => {
    const response = await api.get("/announcements");
    return response.data;
  },

  // Get announcements by institution
  getInstitutionAnnouncements: async (institutionId) => {
    const response = await api.get(
      `/announcements?institutionId=${institutionId}`
    );
    return response.data;
  },
};
```

**Benefits:**

- Announcements are now filtered by institution
- Each institution has its own set of announcements
- Maintains backward compatibility with legacy code

### 2. ✅ Updated AnnouncementScreen

**File:** `screens/AnnouncementScreen.js`

Changed to use institution context and filter announcements:

```javascript
// Added imports
import { useInstitution } from "../contexts/InstitutionContext";
import { announcementService } from "../api/announcement";

// Updated query
const { selectedInstitution } = useInstitution();

const { data, refetch } = useQuery({
  queryKey: ["institutionAnnouncements", selectedInstitution?._id],
  queryFn: () =>
    announcementService.getInstitutionAnnouncements(selectedInstitution?._id),
  enabled: !!selectedInstitution?._id,
});
```

**Benefits:**

- Automatically filters announcements by selected institution
- Updates when switching institutions
- Works seamlessly with existing UI

### 3. ✅ Added Announcements Tab to InstitutionTabs

**File:** `navigation/InstitutionTabs.js`

Added AnnouncementsStack with custom header:

```javascript
// Stack for Announcements tab
function AnnouncementsStack({ navigation }) {
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AnnouncementsMain"
        component={AnnouncementScreen}
        options={{
          header: () => (
            <InstitutionHeader
              navigation={navigation}
              title="Announcements"
              theme={theme}
              institution={selectedInstitution}
            />
          ),
        }}
      />
      <Stack.Screen
        name="AnnouncementDetails"
        component={AnnouncementDetailsScreen}
        options={({ route }) => ({
          headerTitle:
            route.params?.announcement?.title || "Announcement Details",
        })}
      />
    </Stack.Navigator>
  );
}
```

**Tab Navigator Updated:**

```javascript
<Tab.Screen
  name="Announcements"
  component={AnnouncementsStack}
  options={{
    tabBarLabel: "Announcements",
  }}
/>
```

**Benefits:**

- Announcements are now part of institution tabs
- Shows institution logo/name in header
- Menu button available for drawer access

### 4. ✅ Removed Announcements from Drawer

**File:** `components/CustomDrawerContent.js`

Removed Announcements from drawer navigation section:

```javascript
// Before
<View style={themedStyles.navigationSection}>
  <TouchableOpacity onPress={() => navigation.navigate("Announcements")}>
    <Text>Announcements</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
    <Text>Profile</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
    <Text>Settings</Text>
  </TouchableOpacity>
</View>

// After
<View style={themedStyles.navigationSection}>
  <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
    <Text>Profile</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
    <Text>Settings</Text>
  </TouchableOpacity>
</View>
```

**Benefits:**

- Cleaner drawer menu
- Announcements are institution-specific, not global

### 5. ✅ Removed Announcements from MainDrawer

**File:** `navigation/MainDrawer.js`

Removed Announcements drawer screen:

```javascript
// Removed:
<Drawer.Screen name="Announcements">
  {(props) => <AnnouncementStack {...props} />}
</Drawer.Screen>;

// Also removed import:
import AnnouncementStack from "./AnnouncementStack";
```

**Benefits:**

- Simplified drawer structure
- No confusion between drawer and tab navigation

### 6. ✅ Updated Dashboard Navigation

**File:** `screens/DashboardScreen.js`

Updated "Announcements" quick action to navigate to tab:

```javascript
// Before
onPress={() => navigation.getParent()?.navigate("Announcements")}

// After
onPress={() => navigation.navigate("Announcements")}
```

**Benefits:**

- Consistent navigation pattern
- Uses tab navigation instead of drawer
- Simpler, more intuitive

## New Tab Structure

### For Residents:

```
Institution Tabs
├── Dashboard
├── Forms
├── My Submissions
└── Announcements (NEW!)
```

### For Tutors:

```
Institution Tabs
├── Dashboard
├── Submissions
├── My Residents
└── Announcements (NEW!)
```

## Navigation Flow

### Accessing Announcements:

1. **From Dashboard**: Tap "Announcements" quick action → Opens Announcements tab
2. **From Tab Bar**: Tap Announcements icon at bottom
3. **Institution Specific**: Each institution has its own announcements

### Viewing Announcement Details:

1. Tap announcement in list
2. Navigate to AnnouncementDetails screen
3. Back button returns to announcements list

## Visual Structure

```
┌─────────────────────────────────────┐
│ ☰  [🏢 KBOG]  Announcements        │ ← Institution header
├─────────────────────────────────────┤
│ Year: 2024    Month: All            │ ← Filters
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 📢 New Policy Update            │ │
│ │ Posted: Jan 15, 2024            │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📣 Training Session             │ │
│ │ Posted: Jan 10, 2024            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Dashboard │ Forms │ ... │ 📢        │ ← Tab bar with Announcements
└─────────────────────────────────────┘
```

## API Endpoint

The announcement API now supports institution filtering:

```
GET /announcements?institutionId={institutionId}
```

Returns only announcements for the specified institution.

## Benefits

1. **Institution Context**: Announcements are specific to each institution
2. **Better Organization**: Part of institution tabs, not global
3. **Consistency**: Follows the same pattern as other institution features
4. **Easy Access**: Always visible in tab bar
5. **Header Integration**: Shows institution logo/name
6. **Automatic Filtering**: Changes when switching institutions
7. **No Confusion**: Clear that announcements belong to the institution

## Testing Checklist

### For Both Residents and Tutors:

- [ ] Announcements tab appears in tab bar
- [ ] Announcements icon (megaphone) shows correctly
- [ ] Tapping tab opens announcements for current institution
- [ ] Institution name/logo shows in header
- [ ] Menu button (☰) works to open drawer
- [ ] Switching institutions updates announcements
- [ ] Empty state shows when no announcements
- [ ] Filters (year/month) work correctly

### Dashboard Integration:

- [ ] "Announcements" quick action navigates to tab
- [ ] Navigation is instant, no delays
- [ ] Back button works correctly

### Announcement Details:

- [ ] Tapping announcement opens details
- [ ] Back button returns to list
- [ ] Details show correctly

### Drawer Menu:

- [ ] Announcements NOT in drawer menu
- [ ] Profile and Settings still accessible
- [ ] No broken navigation links

## Files Modified

1. **`api/announcement.js`** - Added institution filtering
2. **`screens/AnnouncementScreen.js`** - Updated to use institution context
3. **`navigation/InstitutionTabs.js`** - Added Announcements tab
4. **`components/CustomDrawerContent.js`** - Removed Announcements link
5. **`navigation/MainDrawer.js`** - Removed Announcements drawer screen
6. **`screens/DashboardScreen.js`** - Updated navigation

## No Breaking Changes

- All changes are additive or corrective
- Existing functionality preserved
- No database migrations required
- Theme support maintained
- Backward compatible API structure

## Migration Notes

If the backend doesn't support `institutionId` parameter yet:

- The API will return all announcements
- Client-side filtering can be added temporarily
- No errors will occur
- Graceful degradation

## Future Enhancements

Potential improvements:

- [ ] Badge showing unread announcements count
- [ ] Push notifications for new announcements
- [ ] Mark announcements as read
- [ ] Search within announcements
- [ ] Categories/tags for announcements
- [ ] Pin important announcements to top
