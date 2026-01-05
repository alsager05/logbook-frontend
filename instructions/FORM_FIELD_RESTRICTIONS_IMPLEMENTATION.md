# Form & Field Restrictions Implementation

## Overview

Implemented level-based access control for forms and field options as specified in the `MOBILE_DEV_RESTRICTIONS_GUIDE.md` and `MOBILE_DEV_QUICK_REFERENCE.md`.

## ✅ Implementation Complete

### 1. Form-Level Restrictions

**Level restriction error handling added to FormScreen.js:**

```javascript
// Error handling query setup
const {
  data: template,
  isLoading,
  error,
} = useQuery({
  queryKey: ["formTemplate", formId],
  queryFn: async () => {
    try {
      const response = await formsService.getFormById(formId);
      return response;
    } catch (error) {
      // Check if it's a level restriction error
      if (error.response?.data?.requiredLevel) {
        throw {
          isLevelRestriction: true,
          ...error.response.data,
        };
      }
      throw error;
    }
  },
  retry: false, // Don't retry level restriction errors
});
```

**Professional error screen:**

```
🔒 Form Restricted

This form requires level R3 or above.
Your current level in this institution: R1

┌─────────────────────────┐
│ Required Level:  R3     │
│ Your Level:      R1     │
└─────────────────────────┘

Contact your supervisor to update your level

[Go Back]
```

### 2. Field-Level Option Restrictions

**Updated select field rendering:**

```javascript
case "select":
  // Use availableOptions (filtered by backend) instead of options
  const selectOptions = field.availableOptions || field.options || [];

  // Handle empty options (all restricted)
  if (selectOptions.length === 0) {
    return (
      <View>
        <View style={warningContainer}>
          ⚠️ No options available for your current level
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Show hint if field has level restrictions */}
      {field.hasLevelRestrictions && (
        <View style={hintContainer}>
          ℹ️ Some options may be hidden based on your level
        </View>
      )}
      <CustomDropdown
        options={selectOptions.map(opt => opt.value || opt)}
        ...
      />
    </View>
  );
```

### 3. Visual Design

#### Level Restriction Error Screen

- Large lock icon (🔒)
- Clear "Form Restricted" title
- Detailed error message from backend
- Level info box showing:
  - Required level (e.g., R3)
  - User's current level (e.g., R1)
- Helper text: "Contact your supervisor"
- Primary action button: "Go Back"

#### Field-Level Hints

- Info icon (ℹ️) with subtle background
- Text: "Some options may be hidden based on your level"
- Appears only when `field.hasLevelRestrictions === true`

#### Empty Options Warning

- Alert icon (⚠️) with warning colors
- Text: "No options available for your current level"
- Yellow/amber background
- Appears when `availableOptions.length === 0`

## Key Implementation Details

### 1. Trust the Backend ✅

```javascript
// ✅ CORRECT: Use availableOptions (already filtered by backend)
const options = field.availableOptions || field.options || [];

// ❌ WRONG: Don't use optionsWithLevels or filter client-side
const options = field.optionsWithLevels.filter(...);
```

### 2. Error Detection ✅

```javascript
// Backend sends level restriction errors with specific structure
{
  message: "This form requires level R3 or above...",
  requiredLevel: "R3",
  userLevel: "R1",
  institutionId: "inst123"
}

// We detect it via:
if (error.response?.data?.requiredLevel) {
  // This is a level restriction error
}
```

### 3. Graceful Degradation ✅

```javascript
// Always provide fallbacks
const options = field.availableOptions || field.options || [];

// Show helpful messages when empty
if (options.length === 0) {
  return <WarningMessage />;
}
```

## Styles Added

### Error Screen Styles

```javascript
errorContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},
errorTitle: {
  fontSize: 24,
  fontWeight: "bold",
  color: theme.text,
  marginTop: 16,
  marginBottom: 8,
  textAlign: "center",
},
errorMessage: {
  fontSize: 16,
  color: theme.textSecondary,
  textAlign: "center",
  marginBottom: 20,
  lineHeight: 24,
},
levelInfoBox: {
  backgroundColor: theme.surfaceVariant,
  padding: 16,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.border,
  marginVertical: 16,
  minWidth: 250,
},
```

### Field Hint Styles

```javascript
hintContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  backgroundColor: theme.surfaceVariant,
  padding: 8,
  borderRadius: 6,
  marginBottom: 8,
},
hintText: {
  fontSize: 12,
  color: theme.textSecondary,
  fontStyle: "italic",
},
```

### Warning Styles

```javascript
warningContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  backgroundColor: theme.warningContainer || "#FEF3C7",
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.warning || "#F59E0B",
},
warningText: {
  fontSize: 14,
  color: theme.warningText || "#92400E",
  flex: 1,
},
```

## User Experience Flow

### Scenario 1: R1 Resident Tries to Access R3 Form

```
1. User taps on "Advanced Surgical Procedures" form
   ↓
2. Backend returns 403 with level restriction error
   ↓
3. App shows:
   🔒 Form Restricted

   This form requires level R3 or above
   Your current level: R1

   Required Level: R3
   Your Level: R1

   Contact your supervisor to update your level

   [Go Back]
```

### Scenario 2: R2 Resident Views Form with Mixed Options

```
1. User opens "Procedure Complexity" form
   ↓
2. Backend returns field with availableOptions:
   field.availableOptions = ["Observation", "Assisted"]
   field.hasLevelRestrictions = true
   ↓
3. App shows:
   Procedure Complexity
   ℹ️ Some options may be hidden based on your level

   [Select Procedure Complexity ▼]
   - Select...
   - Observation
   - Assisted

   (Missing: "Supervised" and "Independent" - require R3+)
```

### Scenario 3: Field with No Available Options

```
1. User views form with R5-only field
   ↓
2. Backend returns:
   field.availableOptions = []
   field.hasLevelRestrictions = true
   ↓
3. App shows:
   Advanced Techniques
   ⚠️ No options available for your current level
```

## Testing Checklist

### Form-Level Restrictions

- [x] Restricted form shows lock icon and error message
- [x] Error displays required level vs user level
- [x] "Go Back" button navigates correctly
- [x] Error doesn't retry (no infinite loops)
- [ ] Test with different level combinations (R1-R5)

### Field-Level Restrictions

- [x] Uses `availableOptions` instead of `options`
- [x] Shows hint when `hasLevelRestrictions` is true
- [x] Handles empty options gracefully
- [x] Displays warning message for empty options
- [ ] Test with progressive unlocking (R1 → R5)

### Visual Design

- [x] Error screen is centered and readable
- [x] Hint container has subtle background
- [x] Warning container uses amber/yellow colors
- [x] Icons display correctly
- [ ] Test in light and dark mode

## API Integration

### Expected Backend Responses

**Form List (Already Filtered):**

```json
GET /formTemplates?institutionId=X

[
  {
    "_id": "form1",
    "formName": "Basic Assessment",
    "levelRestricted": false
  },
  {
    "_id": "form2",
    "formName": "Intermediate Procedures",
    "levelRestricted": true,
    "minLevel": "R2"
  }
]
```

**Form Detail (Options Filtered):**

```json
GET /formTemplates/:id

{
  "formName": "Procedures",
  "fieldTemplates": [
    {
      "name": "Type",
      "type": "select",
      "hasLevelRestrictions": true,
      "availableOptions": [
        { "value": "Basic", "label": "Basic" },
        { "value": "Standard", "label": "Standard" }
      ]
    }
  ]
}
```

**Restriction Error (403):**

```json
GET /formTemplates/:id

{
  "message": "This form requires level R3 or above. Your current level in this institution: R1",
  "requiredLevel": "R3",
  "userLevel": "R1",
  "institutionId": "inst123"
}
```

## Files Modified

✅ **screens/FormScreen.js**

- Added level restriction error detection in query
- Updated select field rendering to use `availableOptions`
- Added hint display for fields with level restrictions
- Added empty options warning
- Created professional error screen for restricted forms
- Added comprehensive styling for all new UI elements

## Related Documentation

- `MOBILE_DEV_QUICK_REFERENCE.md` - Quick integration guide
- `MOBILE_DEV_RESTRICTIONS_GUIDE.md` - Complete technical spec
- `LEVEL_SYSTEM_IMPLEMENTATION_SUMMARY.md` - Level system overview
- `MOBILE_APP_LEVEL_SYSTEM.md` - Full level system documentation

## Summary

The form and field restriction system is now fully implemented according to specifications:

1. ✅ **Form-Level**: Catches 403 errors and displays professional restriction screen
2. ✅ **Field-Level**: Uses `availableOptions` from backend (pre-filtered)
3. ✅ **UX**: Clear hints, warnings, and error messages
4. ✅ **Design**: Professional UI matching app theme
5. ✅ **Backend Trust**: No client-side filtering, uses backend data directly

Users will see clear, helpful messages when they encounter level restrictions, and the UI gracefully handles all edge cases including empty options and restricted forms.
