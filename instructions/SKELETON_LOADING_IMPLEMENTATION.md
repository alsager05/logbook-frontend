# Skeleton Loading Implementation

## Overview

This document describes the skeleton loading system implemented across the app to provide better user experience during data fetching.

## What are Skeleton Loaders?

Skeleton loaders are placeholder UI elements that mimic the layout of the actual content while data is being loaded. They provide:

1. **Better perceived performance** - Users see something immediately
2. **Reduced bounce rate** - Users are less likely to leave
3. **Professional appearance** - Modern UX pattern
4. **Loading state visibility** - Clear indication that content is coming

## Architecture

### Base Components (`loading-skeletons/SkeletonBase.js`)

The foundation of the skeleton system includes:

- **SkeletonBox**: Basic rectangular placeholder with shimmer animation
- **SkeletonCircle**: Circular placeholder (for avatars)
- **SkeletonText**: Text line placeholder
- **SkeletonCard**: Card container with themed styling

### Shimmer Animation

All skeleton components include a subtle pulse/shimmer animation that:

- Loops between 30% and 70% opacity
- Uses native driver for smooth performance
- Duration: 1 second per cycle

```javascript
const shimmerAnimation = Animated.loop(
  Animated.sequence([
    Animated.timing(shimmerAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(shimmerAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }),
  ])
);
```

## Skeleton Components

### 1. DashboardSkeleton

**Used in**: `DashboardScreen.js`

Mimics the dashboard layout with:

- Welcome section (user info)
- Stats grid (4 stat cards)
- Quick actions grid (4 action cards)
- Recent activity list (3 items)

### 2. FormListSkeleton

**Used in**: `InstitutionFormsScreen.js`

Displays:

- 5 form card placeholders
- Each with icon, title, description, and stats

### 3. ResidentListSkeleton

**Used in**: `ResidentsScreen.js`

Shows:

- 6 resident card placeholders
- Each with avatar, name, email, and stats

### 4. AnnouncementListSkeleton

**Used in**: `AnnouncementScreen.js`

Includes:

- Filter dropdown placeholders
- 4 announcement cards with images

### 5. SubmissionListSkeleton

**Used in**:

- `ResidentSubmissionsScreen.js`
- `FormsScreen.js`

Displays:

- 6 submission card placeholders
- Icon, content, and status badge

### 6. ProfileSkeleton

**Used in**: `ProfileScreen.js`

Shows:

- Profile header with avatar
- Info section with key-value pairs
- Action items list

### 7. InstitutionListSkeleton

**Used in**: `BrowseInstitutionsScreen.js`

Displays:

- Search bar placeholder
- 6 institution cards with logo and details

## Implementation Pattern

### Standard Implementation

```javascript
// 1. Import the skeleton
import { DashboardSkeleton } from "../loading-skeletons";

// 2. Get loading state from query
const { data, isLoading, refetch } = useQuery({
  queryKey: ["someData"],
  queryFn: fetchData,
});

// 3. Show skeleton during initial load (not refresh)
const [refreshing, setRefreshing] = useState(false);

if (isLoading && !refreshing) {
  return <DashboardSkeleton />;
}

// 4. Regular content
return <ActualContent data={data} />;
```

### Key Points

1. **Only show skeleton on initial load**, not during refresh
2. **Check both `isLoading` and `!refreshing`**
3. **Return skeleton immediately** (don't wrap in container)
4. **Skeleton handles its own styling** and theming

## Theme Integration

All skeletons automatically adapt to light/dark theme:

```javascript
const { theme } = useTheme();

// Skeletons use theme colors:
backgroundColor: theme.isDark ? "#374151" : "#E5E7EB";
cardBackground: theme.card;
textColor: theme.text;
```

## File Structure

```
loading-skeletons/
├── index.js                      # Central export file
├── SkeletonBase.js               # Base components with animation
├── DashboardSkeleton.js          # Dashboard specific
├── FormListSkeleton.js           # Form list specific
├── ResidentListSkeleton.js       # Resident list specific
├── AnnouncementListSkeleton.js   # Announcement list specific
├── SubmissionListSkeleton.js     # Submission list specific
├── ProfileSkeleton.js            # Profile specific
└── InstitutionListSkeleton.js    # Institution list specific
```

## Screens Updated

✅ **DashboardScreen** - Shows dashboard skeleton
✅ **ResidentsScreen** - Shows resident list skeleton
✅ **AnnouncementScreen** - Shows announcement list skeleton
✅ **ResidentSubmissionsScreen** - Shows submission list skeleton
✅ **FormsScreen** - Shows submission list skeleton
✅ **InstitutionFormsScreen** - Shows form list skeleton
✅ **ProfileScreen** - Shows profile skeleton
✅ **BrowseInstitutionsScreen** - Shows institution list skeleton

## Performance Considerations

1. **Native Driver**: All animations use native driver for 60fps
2. **Lightweight**: Skeletons are simple views with minimal logic
3. **No Data**: Skeletons don't require any data to render
4. **Fast Rendering**: Render immediately without waiting for layout

## Best Practices

### ✅ Do

- Match skeleton layout to actual content as closely as possible
- Use consistent spacing and sizing
- Show skeleton only during initial load
- Keep animations subtle and smooth
- Use theme colors for consistency

### ❌ Don't

- Show skeleton during pull-to-refresh
- Make skeleton animations too fast or distracting
- Include actual data in skeletons
- Make skeletons too complex (keep them simple)
- Forget to handle error states separately

## Future Enhancements

Potential improvements for the skeleton system:

1. **Configurable Animation**: Allow different animation speeds
2. **Gradient Shimmer**: Add left-to-right shimmer gradient
3. **Content-Aware Skeletons**: Adjust based on expected data size
4. **Skeleton Variants**: Different sizes/layouts for the same component
5. **Accessibility**: Add proper accessibility labels for screen readers

## Testing Checklist

When testing skeleton loaders:

- [ ] Skeleton appears immediately on screen load
- [ ] Shimmer animation runs smoothly
- [ ] Layout matches actual content
- [ ] Works in both light and dark mode
- [ ] Disappears when data loads
- [ ] Doesn't show during pull-to-refresh
- [ ] No layout shift when transitioning to actual content
- [ ] Performance is smooth (no jank)

## Support

For questions or issues with skeleton loaders, refer to:

- Base components: `loading-skeletons/SkeletonBase.js`
- Theme integration: `contexts/ThemeContext.js`
- Individual screen implementations in `screens/` directory

## Summary

The skeleton loading system provides a polished, professional loading experience across all major screens in the app. It's built with performance in mind, integrates seamlessly with the theme system, and follows React Native best practices.
