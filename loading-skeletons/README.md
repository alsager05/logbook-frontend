# Loading Skeletons

Reusable skeleton loading components for the Logbook app.

## Quick Start

```javascript
import { DashboardSkeleton } from "../loading-skeletons";

function MyScreen() {
  const { data, isLoading } = useQuery(...);
  const [refreshing, setRefreshing] = useState(false);

  if (isLoading && !refreshing) {
    return <DashboardSkeleton />;
  }

  return <ActualContent data={data} />;
}
```

## Available Skeletons

| Skeleton                   | Use Case                                               | File                                             |
| -------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `DashboardSkeleton`        | Dashboard screen with stats, actions, and recent items | `DashboardScreen.js`                             |
| `FormListSkeleton`         | List of forms/documents                                | `InstitutionFormsScreen.js`                      |
| `ResidentListSkeleton`     | List of residents/users                                | `ResidentsScreen.js`                             |
| `AnnouncementListSkeleton` | List of announcements                                  | `AnnouncementScreen.js`                          |
| `SubmissionListSkeleton`   | List of form submissions                               | `ResidentSubmissionsScreen.js`, `FormsScreen.js` |
| `ProfileSkeleton`          | User profile view                                      | `ProfileScreen.js`                               |
| `InstitutionListSkeleton`  | List of institutions                                   | `BrowseInstitutionsScreen.js`                    |

## Base Components

Create custom skeletons using these building blocks:

```javascript
import {
  SkeletonBox,
  SkeletonCircle,
  SkeletonText,
  SkeletonCard,
} from "../loading-skeletons";

<SkeletonCard>
  <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
    <SkeletonCircle size={64} />
    <View style={{ flex: 1 }}>
      <SkeletonText width="80%" height={18} />
      <SkeletonText width="60%" height={14} style={{ marginTop: 6 }} />
    </View>
  </View>
</SkeletonCard>;
```

### Base Component Props

**SkeletonBox**

- `width`: string | number (default: "100%")
- `height`: number (required)
- `borderRadius`: number (default: 8)
- `style`: ViewStyle

**SkeletonCircle**

- `size`: number (default: 40)

**SkeletonText**

- `width`: string | number (default: "100%")
- `height`: number (default: 16)
- `style`: ViewStyle

**SkeletonCard**

- `children`: ReactNode
- `style`: ViewStyle

## Features

✨ **Shimmer Animation**: Smooth pulse effect that loops continuously
✨ **Theme Integration**: Automatically adapts to light/dark mode
✨ **Performance**: Uses native driver for 60fps animations
✨ **Accessibility**: Minimal visual distraction
✨ **Responsive**: Works on all screen sizes

## Implementation Pattern

### 1. Import

```javascript
import { DashboardSkeleton } from "../loading-skeletons";
```

### 2. Use with React Query

```javascript
const { data, isLoading } = useQuery({
  queryKey: ["myData"],
  queryFn: fetchData,
});

const [refreshing, setRefreshing] = useState(false);
```

### 3. Conditional Rendering

```javascript
// Show skeleton only during initial load
if (isLoading && !refreshing) {
  return <DashboardSkeleton />;
}

// Show actual content once loaded
return <MyContent data={data} />;
```

## Creating New Skeletons

1. **Copy existing skeleton** that's closest to your layout
2. **Adjust components** to match your screen's structure
3. **Export from index.js** for easy importing
4. **Document in this README** and main docs

Example template:

```javascript
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SkeletonText, SkeletonCard, SkeletonCircle } from "./SkeletonBase";

export const MyCustomSkeleton = () => {
  const { theme } = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <ScrollView style={themedStyles.container}>
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i}>{/* Your skeleton layout here */}</SkeletonCard>
      ))}
    </ScrollView>
  );
};

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
      padding: 16,
    },
  });
```

## Best Practices

✅ **Match Layout**: Skeleton should closely resemble actual content
✅ **Initial Load Only**: Don't show skeleton during pull-to-refresh
✅ **Keep it Simple**: Skeletons should be simpler than actual content
✅ **Consistent Spacing**: Use same gaps/padding as real content
✅ **Theme Aware**: Always use theme colors

❌ **Don't Over-animate**: Keep animations subtle
❌ **Don't Include Data**: Skeletons should never show real data
❌ **Don't Complicate**: Skeletons should be fast to render

## Files

```
loading-skeletons/
├── README.md (this file)
├── index.js (exports all skeletons)
├── SkeletonBase.js (base components)
├── DashboardSkeleton.js
├── FormListSkeleton.js
├── ResidentListSkeleton.js
├── AnnouncementListSkeleton.js
├── SubmissionListSkeleton.js
├── ProfileSkeleton.js
└── InstitutionListSkeleton.js
```

## Documentation

For detailed documentation, see: `SKELETON_LOADING_IMPLEMENTATION.md` in the project root.

## Support

- Check individual skeleton files for specific implementations
- Review base components in `SkeletonBase.js` for creating custom skeletons
- See screen implementations in `screens/` directory for usage examples
