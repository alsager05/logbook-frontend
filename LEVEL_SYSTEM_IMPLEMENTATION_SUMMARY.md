# Level System Implementation Summary

## Overview

The app now supports **institution-specific resident levels** with automatic content filtering. Residents will only see forms and options appropriate for their training level in each institution.

##Implementation Status

### ✅ Completed Features

1. **Institution-Specific Level Display**

   - Drawer menu shows level badges for each institution
   - Dashboard displays user's level for the selected institution
   - Forms list screen shows current level with filtering context

2. **UI Enhancements**
   - Level badges with school icon in drawer
   - Role badges with color coding (Admin: Red, Tutor: Blue, Resident: Green)
   - Clear level info header in forms list

### 🔄 In Progress

3. **Form Access Control**

   - Backend automatically filters forms by level
   - Error handling for level-restricted access (pending)
   - Field options filtering by level (pending)

4. **Profile Enhancements**
   - Level progress indicator (pending)

## Changes Made

### 1. CustomDrawerContent.js

**Added level and role badges to institution items:**

```javascript
<View style={themedStyles.institutionInfo}>
  <Text style={themedStyles.institutionName}>{institution.name}</Text>
  <View style={themedStyles.badgesContainer}>
    {/* Level Badge */}
    {institution.userLevel && (
      <View style={themedStyles.levelBadge}>
        <Ionicons name="school-outline" size={12} color={theme.primary} />
        <Text style={themedStyles.levelBadgeText}>{institution.userLevel}</Text>
      </View>
    )}
    {/* Role Badge */}
    {institution.userRole && (
      <View style={themedStyles.roleBadge}>
        <Text style={themedStyles.roleBadgeText}>{institution.userRole}</Text>
      </View>
    )}
  </View>
</View>
```

**Visual Design:**

- Level badge: Blue background with school icon
- Role badges: Color-coded (Admin=Red, Tutor=Blue, Resident=Green)
- Compact design to fit in drawer

### 2. InstitutionFormsScreen.js

**Added level header showing filtering context:**

```javascript
{
  userLevel && (
    <View style={themedStyles.levelHeader}>
      <View style={themedStyles.levelInfoContainer}>
        <Ionicons name="school" size={20} color={theme.primary} />
        <View style={themedStyles.levelTextContainer}>
          <Text style={themedStyles.levelTitle}>Your Level: {userLevel}</Text>
          <Text style={themedStyles.levelSubtitle}>
            Showing forms for {userLevel} and below
          </Text>
        </View>
      </View>
    </View>
  );
}
```

**User Experience:**

- Users immediately see their current level
- Clear explanation of why certain forms may not appear
- Consistent with level system expectations

### 3. DashboardScreen.js

**Updated to use institution-specific level:**

```javascript
// Use institution-specific level instead of global level
const userLevel =
  selectedInstitution?.userLevel || user.level || user.year || "N/A";
```

**Display:**

- Level appears next to role in welcome section
- Only shows if level is set
- Falls back to global level if institution level not available

## API Integration

### Expected Response Structure

```json
{
  "institutions": [
    {
      "_id": "inst1",
      "name": "KBOG",
      "code": "KBOG001",
      "logo": "uploads/logo.png",
      "userRole": "resident",
      "userLevel": "R3",
      "assignedAt": "2025-10-01",
      "formTemplatesCount": 15,
      "formSubmissionsCount": 89
    }
  ]
}
```

### Level Values

- `"R1"` - First Year Resident
- `"R2"` - Second Year Resident
- `"R3"` - Third Year Resident
- `"R4"` - Fourth Year Resident
- `"R5"` - Fifth Year Resident
- `""` or `null` - No level assigned

## Styling

### Level Badge Styles

```javascript
levelBadge: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.primaryContainer || theme.surfaceVariant,
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 12,
  gap: 4,
},
levelBadgeText: {
  fontSize: 11,
  fontWeight: "600",
  color: theme.primary,
}
```

### Role Badge Styles

```javascript
roleBadge: {
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 12,
  // Dynamic background color based on role
},
roleBadgeText: {
  fontSize: 10,
  fontWeight: "600",
  textTransform: "capitalize",
  // Dynamic text color based on role
}
```

## User Experience Flow

### Scenario: R3 Resident Viewing Forms

```
1. User opens drawer
   → Sees: "KBOG" with "R3" level badge and "resident" role badge

2. User selects KBOG institution
   → Navigates to Dashboard
   → Welcome section shows: "Level R3"

3. User taps "Forms" tab
   → Header shows: "Your Level: R3"
   → Subtitle: "Showing forms for R3 and below"
   → Sees only R1, R2, R3 forms (backend filtered)

4. User opens a form
   → Field options are filtered by level
   → Some options may be hidden/locked
```

## Testing

### Manual Testing Checklist

- [x] Level badge displays correctly in drawer
- [x] Role badge displays with correct color
- [x] Dashboard shows institution-specific level
- [x] Forms screen shows level header
- [ ] Forms are filtered by level (backend)
- [ ] Level-restricted form shows error
- [ ] Field options filter by level
- [ ] Profile shows level progress

### Test Data

Create institutions with different levels:

```javascript
{
  userLevel: "R1",  // Should see minimal forms
  userLevel: "R3",  // Should see more forms
  userLevel: "R5",  // Should see all forms
  userLevel: null,  // Should see unrestricted forms only
}
```

## Pending Tasks

### 1. FormScreen.js Updates

**Need to implement:**

- Handle level restriction errors from backend
- Display `availableOptions` instead of `options` for fields
- Show helpful error messages when form requires higher level
- Add "Some options hidden" hint for level-restricted fields

### 2. Error Handling

**When accessing restricted form:**

```javascript
if (error.requiredLevel) {
  Alert.alert(
    "Form Restricted",
    `This form requires level ${error.requiredLevel}. ` +
      `Your current level: ${error.userLevel || "Not Set"}. ` +
      `Contact your supervisor for level update.`,
    [
      { text: "OK", onPress: () => navigation.goBack() },
      { text: "Contact Supervisor", onPress: () => contactSupervisor() },
    ]
  );
}
```

### 3. Profile Progress Indicator

**Design:**

```
Your Training Progress

KBOG
R1 → R2 → R3 (current) → R4 → R5
Current: R3

Hospital B
R1 (current) → R2 → R3 → R4 → R5
Current: R1
```

### 4. Caching Strategy

**Store level info locally:**

```javascript
const cacheInstitutions = async (institutions) => {
  await AsyncStorage.setItem("user_institutions", JSON.stringify(institutions));
};

const getCachedLevel = async (institutionId) => {
  const cached = await AsyncStorage.getItem("user_institutions");
  if (cached) {
    const institutions = JSON.parse(cached);
    const inst = institutions.find((i) => i._id === institutionId);
    return inst?.userLevel || "";
  }
  return "";
};
```

## Migration Notes

### For Users

**New Visual Elements:**

- Level badges on institution cards in drawer
- Level info in dashboard welcome section
- Level context header in forms list

**No Breaking Changes:**

- All existing functionality preserved
- Forms without restrictions work as before
- Users without levels see all unrestricted content

### For Developers

**API Dependencies:**

- `/institutions/me` must return `userLevel` field
- `/formTemplates?institutionId=X` should filter by level
- `/formTemplates/:id` should return `availableOptions` and level errors

**Context Usage:**

```javascript
const { selectedInstitution } = useInstitution();
const userLevel = selectedInstitution?.userLevel;
```

## Related Documentation

- `MOBILE_APP_LEVEL_SYSTEM.md` - Complete level system specification
- `INSTITUTION_SPECIFIC_ROLES.md` - Institution-specific roles implementation
- `InstitutionContext.js` - Institution state management

## Next Steps

1. **Form Error Handling**: Implement level restriction error handling in FormScreen
2. **Field Options**: Update field rendering to use `availableOptions`
3. **Profile Progress**: Add level progress indicator to ProfileScreen
4. **Caching**: Implement level caching in InstitutionContext
5. **Testing**: Comprehensive testing with different level combinations
6. **Documentation**: Update user-facing help docs with level info

## Summary

The level system foundation is in place with clear visual indicators and proper data flow. Users can now see their level in each institution, and the UI provides context for content filtering. The remaining work focuses on error handling, field-level restrictions, and enhanced progress tracking.
