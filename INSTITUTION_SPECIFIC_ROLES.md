# Institution-Specific User Roles

## Overview

Each institution now includes a `userRole` field that represents the user's role within that specific institution. This allows users to have different roles in different institutions (e.g., admin in one, resident in another).

## Institution Data Structure

```json
{
  "_id": "68fe4a73059dd8adf312a62c",
  "assignedAt": "2025-11-08T14:04:07.507Z",
  "code": "KBOG",
  "description": "Kuwait Residents Association of Obstetrics & Gynecology",
  "formSubmissionsCount": 18,
  "formTemplatesCount": 5,
  "isActive": true,
  "logo": null,
  "name": "KBOG",
  "userRole": "admin"
}
```

## Role Types

The `userRole` field can have the following values:

- **`resident`** - Standard user with limited permissions
- **`tutor`** - Supervisor with review and management capabilities
- **`admin`** - Full administrative access to the institution

## Implementation

### 1. InstitutionContext

The selected institution (including its `userRole`) is stored in the `InstitutionContext`:

```javascript
const { selectedInstitution } = useInstitution();
const userRole = selectedInstitution?.userRole;
```

### 2. Navigation Changes

#### Before (Global Role)

```javascript
// App.js
<MainDrawer role={role} handleLogout={handleLogout} />

// MainDrawer.js
export default function MainDrawer({ role, handleLogout }) {
  // ...
  <InstitutionTabs {...props} role={role} />
}

// InstitutionTabs.js
export default function InstitutionTabs({ role, navigation }) {
  const isResident = role?.toString().toUpperCase() === "RESIDENT";
  const isTutor = role?.toString().toUpperCase() === "TUTOR";
  // ...
}
```

#### After (Institution-Specific Role)

```javascript
// App.js
<MainDrawer handleLogout={handleLogout} />

// MainDrawer.js
export default function MainDrawer({ handleLogout }) {
  // ...
  <InstitutionTabs {...props} />
}

// InstitutionTabs.js
export default function InstitutionTabs({ navigation }) {
  const { selectedInstitution } = useInstitution();
  const userRole = selectedInstitution?.userRole;
  const isResident = userRole?.toString().toUpperCase() === "RESIDENT";
  const isTutor = userRole?.toString().toUpperCase() === "TUTOR";
  const isAdmin = userRole?.toString().toUpperCase() === "ADMIN";
  // ...
}
```

### 3. Dashboard Screen

The `DashboardScreen` receives the institution-specific role and uses it for conditional rendering:

```javascript
// InstitutionTabs.js - DashboardStack
<DashboardScreen {...props} role={selectedInstitution?.userRole} />;

// DashboardScreen.js
export default function DashboardScreen({ navigation, role }) {
  const { selectedInstitution } = useInstitution();
  const userRole = role || selectedInstitution?.userRole || "Unknown";

  // Use userRole for conditional rendering
  if (userRole.toUpperCase() === "RESIDENT") {
    // Show resident-specific content
  }
}
```

## Benefits

### 1. Multi-Role Support

Users can now have different roles in different institutions:

```
User A:
- Institution 1 (KBOG): admin
- Institution 2 (Hospital): resident
- Institution 3 (Clinic): tutor
```

### 2. Dynamic Tab Rendering

Tabs are now rendered based on the current institution's role:

**Resident View:**

- Dashboard
- Forms (to submit)
- My Submissions
- Announcements

**Tutor View:**

- Dashboard
- Submissions (to review)
- My Residents
- Announcements

**Admin View:**

- Dashboard
- Submissions (to review)
- My Residents
- Announcements
- (Future: Admin panel)

### 3. Simplified State Management

No need to pass `role` through the entire navigation tree. Each component can access the current institution's role directly from context.

## Files Modified

### Navigation

- ✅ `navigation/InstitutionTabs.js` - Uses `selectedInstitution.userRole` instead of `role` prop
- ✅ `navigation/MainDrawer.js` - Removed `role` prop
- ✅ `App.js` - Removed `role` prop from `MainDrawer`

### Screens

- ✅ `screens/DashboardScreen.js` - Uses institution-specific role for conditional rendering

## Usage Pattern

### Getting Current User Role

```javascript
import { useInstitution } from "../contexts/InstitutionContext";

function MyComponent() {
  const { selectedInstitution } = useInstitution();
  const userRole = selectedInstitution?.userRole;

  const isResident = userRole?.toUpperCase() === "RESIDENT";
  const isTutor = userRole?.toUpperCase() === "TUTOR";
  const isAdmin = userRole?.toUpperCase() === "ADMIN";

  return (
    <View>
      {isResident && <ResidentContent />}
      {isTutor && <TutorContent />}
      {isAdmin && <AdminContent />}
    </View>
  );
}
```

### Role-Based Navigation

```javascript
// InstitutionTabs.js
{
  isResident && (
    <Tab.Screen name="MySubmissions" component={MySubmissionsStack} />
  );
}

{
  isTutor && <Tab.Screen name="Residents" component={ResidentsStack} />;
}

{
  isAdmin && <Tab.Screen name="AdminPanel" component={AdminStack} />;
}
```

## Role Hierarchy

```
Admin
  ├── Can review submissions
  ├── Can manage residents
  ├── Can manage forms
  └── Can manage institution settings

Tutor
  ├── Can review submissions
  ├── Can manage their residents
  └── Can view institution data

Resident
  ├── Can submit forms
  ├── Can view their submissions
  └── Can view announcements
```

## Migration Notes

### Breaking Changes

1. **Role Prop Removed**: The `role` prop is no longer passed through navigation
2. **Context Required**: Components must use `useInstitution()` to access role

### Backward Compatibility

- The global `role` state in `App.js` is kept for authentication purposes
- `DashboardScreen` still accepts `role` as a prop for backward compatibility
- Fallback to `selectedInstitution?.userRole` if `role` prop is not provided

## Testing

When testing role-based features:

1. **Test role switching**: Select different institutions with different roles
2. **Test tab rendering**: Verify correct tabs appear for each role
3. **Test permissions**: Ensure actions are restricted based on role
4. **Test loading states**: Verify role is available during institution loading

## Future Enhancements

1. **Role Permissions Matrix**: Define fine-grained permissions per role
2. **Custom Roles**: Allow institutions to define custom role types
3. **Role Management UI**: Allow admins to assign/change user roles
4. **Audit Log**: Track role changes and permission usage
5. **Role-Based Routing**: Automatically redirect based on role capabilities

## Related Documentation

- `INSTITUTION_SWITCHING_IMPROVEMENT.md` - Loading states when switching institutions
- `contexts/InstitutionContext.js` - Institution state management
- `navigation/InstitutionTabs.js` - Role-based tab rendering

## Support

For questions about role-based access control:

- Check `InstitutionContext` for role state management
- Review `InstitutionTabs.js` for conditional tab rendering
- See `DashboardScreen.js` for role-based content rendering
