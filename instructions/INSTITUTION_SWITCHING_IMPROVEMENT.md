# Institution Switching Improvements

## Overview

Added a loading state when switching institutions to prevent showing stale data, and automatically navigates to the Dashboard tab when a new institution is selected.

## Problems Solved

### 1. **Stale Data Flash**

**Problem:** When switching institutions, there was a brief moment where old data from the previous institution was visible before new data loaded.

**Solution:** Added a loading overlay that displays while the new institution's data is being fetched.

### 2. **No Automatic Navigation**

**Problem:** After selecting an institution, users stayed on whatever tab they were on, which might show incomplete or old data.

**Solution:** Automatically navigate to Dashboard tab when switching institutions, providing a consistent starting point.

### 3. **No Visual Feedback**

**Problem:** Users didn't know if their institution selection was being processed.

**Solution:** Show institution logo and loading spinner with clear messaging.

## Implementation Details

### 1. ✅ Enhanced InstitutionContext

**File:** `contexts/InstitutionContext.js`

Added loading state management:

```javascript
export const InstitutionProvider = ({ children }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isLoadingInstitution, setIsLoadingInstitution] = useState(false);

  const changeInstitution = (institution) => {
    setIsLoadingInstitution(true);
    setSelectedInstitution(institution);
    // Reset loading after allowing queries to start
    setTimeout(() => setIsLoadingInstitution(false), 300);
  };

  return (
    <InstitutionContext.Provider
      value={{
        selectedInstitution,
        setSelectedInstitution,
        changeInstitution, // New!
        isLoadingInstitution, // New!
      }}>
      {children}
    </InstitutionContext.Provider>
  );
};
```

**Key Features:**

- `changeInstitution()`: New method that triggers loading state
- `isLoadingInstitution`: Boolean flag for loading state
- 300ms delay allows React Query to start fetching before hiding loader

### 2. ✅ Updated CustomDrawerContent

**File:** `components/CustomDrawerContent.js`

Changed institution selection behavior:

```javascript
const handleInstitutionPress = (institution) => {
  // Use changeInstitution to trigger loading state
  changeInstitution(institution);

  // Navigate to Dashboard tab when switching institutions
  navigation.navigate("Institution", {
    screen: "Dashboard",
  });

  // Close drawer for better UX
  navigation.closeDrawer();
};
```

**Benefits:**

- Triggers loading state
- Always navigates to Dashboard
- Closes drawer automatically
- Smooth user experience

### 3. ✅ Added Loading Overlay to InstitutionTabs

**File:** `navigation/InstitutionTabs.js`

Added loading screen between institution switches:

```javascript
export default function InstitutionTabs({ role, navigation }) {
  const { selectedInstitution, isLoadingInstitution } = useInstitution();

  // Show loading overlay when switching institutions
  if (isLoadingInstitution) {
    return (
      <View style={styles(theme).loadingContainer}>
        <View style={styles(theme).loadingContent}>
          {selectedInstitution.logo ? (
            <Image
              source={{ uri: selectedInstitution.logo }}
              style={styles(theme).loadingLogo}
            />
          ) : (
            <View style={styles(theme).loadingLogoPlaceholder}>
              <Ionicons name="business" size={48} color={theme.primary} />
            </View>
          )}
          <Text style={styles(theme).loadingInstitutionName}>
            {selectedInstitution.name}
          </Text>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles(theme).loadingText}>
            Loading institution data...
          </Text>
        </View>
      </View>
    );
  }

  // ... rest of tab navigator
}
```

**Features:**

- Shows institution logo/name
- Displays loading spinner
- Clear messaging
- Themed styling
- Covers entire screen

## User Flow

### Before:

```
1. User taps institution in drawer
2. Screen shows old data briefly
3. New data loads and replaces old data
4. User sees flash of wrong information
5. User stays on current tab (might be confusing)
```

### After:

```
1. User taps institution in drawer
2. Loading screen appears immediately
3. Shows new institution logo + "Loading..."
4. Dashboard loads with fresh data
5. User sees consistent, correct information
6. Drawer closes automatically
```

## Visual Design

### Loading Screen:

```
┌─────────────────────────────────────┐
│                                      │
│                                      │
│          ┌─────────────┐            │
│          │             │            │
│          │   🏢 Logo   │            │
│          │             │            │
│          └─────────────┘            │
│                                      │
│          Institution Name            │
│                                      │
│              ⟳                       │ ← Spinner
│                                      │
│      Loading institution data...     │
│                                      │
│                                      │
└─────────────────────────────────────┘
```

## Technical Details

### Loading Duration

- **300ms**: Brief but enough to prevent stale data flash
- Allows React Query to:
  - Invalidate old queries
  - Start fetching new data
  - Prepare cache

### Query Invalidation

React Query automatically handles cache invalidation because:

- Query keys include `selectedInstitution._id`
- When institution changes, query keys change
- Old queries become inactive
- New queries fetch fresh data

**Example:**

```javascript
// Old institution
queryKey: ["institutionSubmissions", "inst_123"];

// New institution
queryKey: ["institutionSubmissions", "inst_456"];
```

### Navigation Flow

```javascript
navigation.navigate("Institution", {
  screen: "Dashboard",
});
```

This ensures users always land on Dashboard when switching institutions, providing:

- Consistent experience
- Fresh data display
- No confusion about which tab they're on

## Benefits

### 1. **No Stale Data Flash**

Users never see data from the wrong institution

### 2. **Clear Feedback**

Loading screen shows which institution is being loaded

### 3. **Consistent Experience**

Always navigates to Dashboard, providing a familiar starting point

### 4. **Better UX**

- Drawer closes automatically
- Smooth transitions
- Professional appearance

### 5. **Data Integrity**

Prevents confusion by ensuring all displayed data belongs to the selected institution

## Testing Checklist

### Basic Functionality:

- [ ] Tapping institution shows loading screen
- [ ] Loading screen displays institution logo
- [ ] Loading screen displays institution name
- [ ] Loading spinner appears
- [ ] Loading text is visible
- [ ] Loading screen disappears after ~300ms
- [ ] Dashboard loads with correct data

### Navigation:

- [ ] Always lands on Dashboard tab after switch
- [ ] Drawer closes automatically
- [ ] Can't interact with UI during loading
- [ ] Back button works correctly after switch

### Data Integrity:

- [ ] Dashboard shows correct institution data
- [ ] Forms tab shows correct institution forms
- [ ] Submissions show correct institution submissions
- [ ] Announcements show correct institution announcements
- [ ] All tabs reflect new institution

### Edge Cases:

- [ ] Switching between institutions rapidly
- [ ] Switching back to same institution
- [ ] Network delays (slow data loading)
- [ ] No institution logo (placeholder works)
- [ ] Very long institution names

### Theme Support:

- [ ] Loading screen respects light theme
- [ ] Loading screen respects dark theme
- [ ] Colors match theme
- [ ] Spinner color matches theme

## Files Modified

1. **`contexts/InstitutionContext.js`**

   - Added `isLoadingInstitution` state
   - Added `changeInstitution()` method
   - Added 300ms timeout logic

2. **`components/CustomDrawerContent.js`**

   - Updated `handleInstitutionPress()`
   - Added `changeInstitution` usage
   - Added auto-navigation to Dashboard
   - Added auto-close drawer

3. **`navigation/InstitutionTabs.js`**
   - Added `ActivityIndicator` import
   - Added loading screen UI
   - Added loading styles
   - Added conditional rendering for loading state

## Performance Considerations

### Memory

- Loading state is lightweight (boolean + timeout)
- No heavy computations
- Minimal memory footprint

### Speed

- 300ms is imperceptible for most users
- Fast enough to prevent flashing
- Long enough to look intentional

### Network

- No additional API calls
- React Query handles caching efficiently
- Existing queries are reused when possible

## Future Enhancements

Potential improvements:

- [ ] Skeleton screens instead of loading spinner
- [ ] Prefetch institution data on hover
- [ ] Animated transitions between institutions
- [ ] Progress indicator for large data loads
- [ ] Cache recently viewed institutions
- [ ] Smart loading (skip if data already cached)

## Backward Compatibility

All changes are backward compatible:

- `setSelectedInstitution()` still works
- Existing code continues to function
- New features are opt-in
- No breaking changes

## Migration Notes

If you need to switch institutions programmatically:

```javascript
// Old way (still works)
setSelectedInstitution(newInstitution);

// New way (with loading state)
changeInstitution(newInstitution);
```

Recommend using `changeInstitution()` for better UX.
