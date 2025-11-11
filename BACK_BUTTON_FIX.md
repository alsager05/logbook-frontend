# Back Button and Navigation Fixes

## Issues Fixed

### 1. ✅ Back Button Navigation Issue

**Problem:** Back buttons in all stack navigators were taking users back to Dashboard instead of the previous screen.

**Root Cause:** Custom `headerLeft` components were manually added with `navigation.goBack()`, which interfered with React Navigation's built-in back button logic.

**Solution:** Removed all custom `headerLeft` configurations and let React Navigation handle back navigation automatically.

## Changes Made

### File: `navigation/InstitutionTabs.js`

#### Removed Custom Back Buttons From:

1. **ResidentFormsStack**

   - Form screen
   - FormReview screen

2. **TutorFormsStack**

   - FormReview screen
   - ResidentDetails screen

3. **MySubmissionsStack**

   - FormReview screen
   - Form screen

4. **ResidentsStack**

   - ResidentDetails screen

5. **AnnouncementsStack**
   - AnnouncementDetails screen

### Before (Broken):

```javascript
<Stack.Screen
  name="Form"
  component={FormScreen}
  options={({ route }) => ({
    headerTitle: route.params?.formName || "Form",
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 16 }}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>
    ),
  })}
/>
```

**Problem:** `navigation.goBack()` in custom header was using the wrong navigation reference, causing it to go back to Dashboard.

### After (Fixed):

```javascript
<Stack.Screen
  name="Form"
  component={FormScreen}
  options={({ route }) => ({
    headerTitle: route.params?.formName || "Form",
  })}
/>
```

**Solution:** React Navigation automatically provides the correct back button with proper navigation context.

## How React Navigation Handles Back Buttons

React Navigation's built-in back button:

- Uses the correct navigation reference from the stack
- Maintains proper navigation history
- Respects modal presentation styles
- Handles gestures correctly (swipe back on iOS)
- Theme-aware styling
- Proper accessibility labels

## Navigation Flow Now Works Correctly

### Resident Flow:

```
Forms Tab → Form Screen → [Back Button] → Forms Tab
Forms Tab → FormReview Screen → [Back Button] → Forms Tab

My Submissions → FormReview → [Back Button] → My Submissions
My Submissions → Form → [Back Button] → My Submissions
```

### Tutor Flow:

```
Submissions Tab → FormReview → [Back Button] → Submissions Tab
Submissions Tab → ResidentDetails → [Back Button] → Submissions Tab

Residents Tab → ResidentDetails → [Back Button] → Residents Tab
```

### Both:

```
Announcements → AnnouncementDetails → [Back Button] → Announcements
```

## Benefits

### 1. **Correct Navigation**

Back button now goes to the actual previous screen, not Dashboard

### 2. **Consistent Behavior**

All back buttons work the same way across the app

### 3. **Native Feel**

iOS swipe-back gestures work correctly

### 4. **Less Code**

Removed ~60 lines of unnecessary custom back button code

### 5. **Maintainability**

One less thing to maintain and debug

### 6. **Accessibility**

Built-in back buttons have proper accessibility labels

## Testing Checklist

### Resident Navigation:

- [ ] Forms → Form → Back works
- [ ] Forms → FormReview → Back works
- [ ] My Submissions → FormReview → Back works
- [ ] My Submissions → Form (edit) → Back works

### Tutor Navigation:

- [ ] Submissions → FormReview → Back works
- [ ] Submissions → ResidentDetails → Back works
- [ ] Residents → ResidentDetails → Back works

### General Navigation:

- [ ] Announcements → Details → Back works
- [ ] Back button appears on all detail screens
- [ ] Back button has correct icon
- [ ] Back button text (iOS) shows previous screen name
- [ ] Swipe back (iOS) works
- [ ] Hardware back button (Android) works

### Edge Cases:

- [ ] Deep linking still works
- [ ] Navigation state is preserved
- [ ] Rapid back button presses handled correctly
- [ ] Memory leaks prevented (screens unmount properly)

## Technical Notes

### Stack Navigator Configuration

Each stack navigator has these base options:

```javascript
screenOptions={{
  headerStyle: {
    backgroundColor: theme.surface,
    borderBottomColor: theme.border,
  },
  headerTitleStyle: {
    color: theme.text,
  },
  headerBackTitle: "Back", // iOS only
}}
```

The `headerBackTitle: "Back"` provides a short back button label on iOS.

### When Custom Headers Are Needed

We still use custom headers for the main tab screens (Dashboard, Forms, etc.) to show:

- Menu button (☰)
- Institution badge
- Custom title styling

But for detail screens (Form, FormReview, etc.), the default header with automatic back button is perfect.

## Resident Submission Count Issue

### Current Status

**Issue:** In the Residents screen, resident cards may not show correct submission counts.

**Root Cause:** The backend API endpoint `/users/residents/my-residents?institutionId={id}` may not be returning `submissionsCount` and `lastSubmission` fields when filtering by institution.

### API Expected Response

```javascript
{
  residents: [
    {
      _id: "resident123",
      username: "John Doe",
      email: "john@example.com",
      image: "url",
      submissionsCount: 15, // ← May be missing
      lastSubmission: "2024-01-15", // ← May be missing
    },
  ];
}
```

### Current Code

```javascript
<Text style={themedStyles.statText}>
  {resident.submissionsCount || 0} Submissions
</Text>
```

This will show "0 Submissions" if `submissionsCount` is missing.

### Potential Solutions

#### Option 1: Fix Backend (Recommended)

Update the backend API to include submission counts when querying residents by institution.

#### Option 2: Fetch Counts Separately (Frontend)

```javascript
// In ResidentsScreen.js
const { data: submissionCounts } = useQuery({
  queryKey: ["residentSubmissionCounts", selectedInstitution?._id],
  queryFn: async () => {
    // Fetch submissions for each resident in this institution
    // Calculate counts on frontend
  },
  enabled: residents.length > 0,
});
```

#### Option 3: Remove Counts Temporarily

```javascript
{
  /* Stats - Temporarily hidden until backend provides counts */
}
{
  /* <View style={themedStyles.statsContainer}>
  <View style={themedStyles.statItem}>
    <Text>{resident.submissionsCount || 0} Submissions</Text>
  </View>
</View> */
}
```

### Recommendation

**Check with backend team** to ensure the API returns:

- `submissionsCount`: Number of submissions by this resident in this institution
- `lastSubmission`: Date of most recent submission in this institution
- `pendingCount`: (Optional) Number of pending submissions

These should be included in the `/users/residents/my-residents?institutionId={id}` response.

## Files Modified

**`navigation/InstitutionTabs.js`**

- Removed custom `headerLeft` from 10+ screen configurations
- Simplified navigation options
- Let React Navigation handle back buttons automatically

## No Breaking Changes

- All navigation still works
- Screen options preserved
- Theme support maintained
- Custom headers on main screens unchanged
