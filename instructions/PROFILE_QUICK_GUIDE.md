# Profile Management - Quick Reference Guide

## 🚀 What Changed?

**Before**: Settings tab with basic app settings  
**After**: Comprehensive Profile tab with user management, settings, and security

---

## 📱 New Profile Tab Structure

### 1️⃣ Profile Screen (Main)

**What it shows:**

- Profile picture (tap to edit)
- Username and role badge
- Email, phone, supervisor
- My institutions list
- Settings (dark mode, notifications)
- Social media links
- Logout button
- Delete account option

**Actions:**

- Tap "Edit Profile" to update information
- Toggle dark mode and notifications
- View About Us and Privacy Policy
- Access social media
- Logout from account
- Delete account (danger zone)

---

### 2️⃣ Edit Profile Screen

**What you can edit:**

- Profile picture (tap to upload from gallery)
- Username
- Email
- Phone number

**Features:**

- Image picker with 1:1 crop
- Form validation
- Real-time error messages
- Save or cancel changes

**Note:** Role and supervisor cannot be changed (contact support)

---

### 3️⃣ Delete Account Screen

**Safety features:**

- Password required
- Multiple warnings
- Clear consequences list
- Admin protection notice

**What happens:**

- ❌ Account marked as deleted
- ❌ Login prevented
- ✅ Data preserved for 30 days
- ✅ Can contact support to restore

---

### 4️⃣ About Us Screen

- Organization information
- KBOG mission and values
- Logo and branding

---

### 5️⃣ Privacy Policy Screen

- Data collection details
- Usage information
- User rights
- Security measures
- Contact information

---

## 🎨 Visual Layout

### Profile Screen Layout

```
┌─────────────────────────────────┐
│         [Profile Picture]        │
│         John Doe                 │
│         [TUTOR]                  │
│         [Edit Profile]           │
├─────────────────────────────────┤
│ Profile Information              │
│ ✉️  Email: john@example.com     │
│ 📱 Phone: +1234567890           │
│ 👤 Supervisor: Dr. Smith        │
├─────────────────────────────────┤
│ My Institutions                  │
│ [🏥 Hospital A - HA001]         │
│ [🏥 Medical College B - MCB001] │
├─────────────────────────────────┤
│ Settings                         │
│ 🌙 Dark Mode          [Toggle]  │
│ 🔔 Notifications      [Toggle]  │
│ ℹ️  About Us              >     │
│ 🛡️  Privacy Policy        >     │
├─────────────────────────────────┤
│ Follow Us                        │
│ [📷] [🌐] [✉️]                  │
├─────────────────────────────────┤
│         [Logout]                 │
├─────────────────────────────────┤
│ ⚠️  Danger Zone                 │
│ [Delete Account]                 │
└─────────────────────────────────┘
```

### Edit Profile Layout

```
┌─────────────────────────────────┐
│      [Profile Picture]           │
│      [Change Photo]              │
├─────────────────────────────────┤
│ Username *                       │
│ [john.doe            ]           │
├─────────────────────────────────┤
│ Email *                          │
│ [john@example.com    ]           │
├─────────────────────────────────┤
│ Phone                            │
│ [+1234567890         ]           │
├─────────────────────────────────┤
│      [Save Changes]              │
│      [Cancel]                    │
├─────────────────────────────────┤
│ ℹ️  Note: Role and supervisor   │
│    cannot be changed             │
└─────────────────────────────────┘
```

### Delete Account Layout

```
┌─────────────────────────────────┐
│          ⚠️                      │
│      Delete Account              │
│                                  │
│ This will permanently delete     │
│ your account...                  │
├─────────────────────────────────┤
│ What will happen:                │
│ ❌ Logged out immediately        │
│ ❌ Cannot login again            │
│ ✅ Data preserved 30 days        │
│ ✅ Contact support to restore    │
├─────────────────────────────────┤
│ 🛡️  Important: If you're admin │
│    of institutions, transfer     │
│    rights first                  │
├─────────────────────────────────┤
│ Enter Password to Confirm *      │
│ [••••••••••••]        [👁️]      │
├─────────────────────────────────┤
│ [Delete My Account Permanently]  │
│ [Cancel]                         │
└─────────────────────────────────┘
```

---

## 🧪 Testing Steps

### Test 1: View Profile

1. ✅ Open app
2. ✅ Tap "Profile" tab (person icon)
3. ✅ See profile information
4. ✅ See institutions list
5. ✅ See settings section

### Test 2: Edit Profile

1. ✅ From profile, tap "Edit Profile"
2. ✅ Tap "Change Photo" and select image
3. ✅ Change username
4. ✅ Change email
5. ✅ Change phone
6. ✅ Tap "Save Changes"
7. ✅ See success message
8. ✅ Return to profile with updated info

### Test 3: Settings

1. ✅ Toggle dark mode on/off
2. ✅ Toggle notifications on/off
3. ✅ Tap "About Us" and view info
4. ✅ Tap "Privacy Policy" and read
5. ✅ Tap social media icons

### Test 4: Delete Account

1. ✅ Scroll to "Danger Zone"
2. ✅ Tap "Delete Account"
3. ✅ See warning screen
4. ✅ Enter password
5. ✅ Confirm deletion
6. ✅ Get logged out
7. ✅ Cannot login again

### Test 5: Admin Protection

1. ✅ As institution admin, try to delete
2. ✅ See error about admin rights
3. ✅ Cannot delete until rights transferred

---

## 📊 API Integration

### Endpoints Used

| Screen         | Endpoint            | Method |
| -------------- | ------------------- | ------ |
| Profile (View) | `/users/profile/me` | GET    |
| Edit Profile   | `/users/profile/me` | PUT    |
| Delete Account | `/users/profile/me` | DELETE |

### Data Flow

```
1. Profile Screen
   └─> GET /users/profile/me
       └─> Display user info

2. Edit Profile
   └─> PUT /users/profile/me (multipart/form-data)
       └─> Update profile
       └─> Refresh profile screen

3. Delete Account
   └─> DELETE /users/profile/me (password in body)
       └─> Soft delete account
       └─> Logout user
       └─> Redirect to login
```

---

## 🎯 Common Use Cases

### Use Case 1: Update Email

```
Profile → Edit Profile → Change email → Save
```

### Use Case 2: Change Profile Picture

```
Profile → Edit Profile → Change Photo → Select image → Save
```

### Use Case 3: Toggle Dark Mode

```
Profile → Toggle "Dark Mode" switch
```

### Use Case 4: View Institutions

```
Profile → Scroll to "My Institutions" section
```

### Use Case 5: Delete Account

```
Profile → Scroll to "Danger Zone" → Delete Account →
Enter password → Confirm → Logged out
```

---

## ⚠️ Important Notes

### For Users

- **Password Required**: You need your password to delete account
- **30-Day Window**: Contact support within 30 days to restore
- **Admin Rights**: Transfer admin rights before deletion
- **Photo Size**: Profile pictures are cropped to square (1:1)
- **Settings Persist**: Dark mode and notification preferences are saved locally

### For Admins

- Cannot delete account while being institution admin
- Must transfer admin rights first
- Clear error message guides you

### For Developers

- Profile uses React Query for caching
- Image uploads use multipart/form-data
- Soft delete preserves data integrity
- Settings stored in AsyncStorage
- Theme toggle updates entire app

---

## 🔐 Security Features

### Password Verification

- ✅ Required for account deletion
- ✅ Prevents accidental deletions
- ✅ Server-side validation

### Admin Protection

- ✅ Checks if user is institution admin
- ✅ Blocks deletion if admin
- ✅ Lists affected institutions

### Soft Delete

- ✅ Account marked as deleted
- ✅ Login prevented
- ✅ Data preserved
- ✅ 30-day restoration window

---

## 📝 Files Reference

### API Service

- `api/profile.js` - Profile API calls

### Screens

- `screens/ProfileScreen.js` - Main profile screen
- `screens/EditProfileScreen.js` - Edit profile
- `screens/DeleteAccountScreen.js` - Delete account
- `screens/AboutUsScreen.js` - About us info
- `screens/PrivacyPolicyScreen.js` - Privacy policy

### Navigation

- `App.js` - Profile tab configuration

---

## 🎨 UI Elements

### Components Used

- **Profile Picture**: 120x120 circle with border
- **Role Badge**: Small colored badge
- **Info Cards**: Clean white/themed cards
- **Toggle Switches**: For settings
- **Icon Buttons**: For social media
- **Danger Zone**: Red-bordered section

### Icons

- Profile tab: `person` / `person-outline`
- Edit: `create-outline`
- Delete: `trash-outline`
- Email: `mail-outline`
- Phone: `call-outline`
- Supervisor: `person-outline`
- Dark mode: `moon-outline`
- Notifications: `notifications-outline`
- About: `information-circle-outline`
- Privacy: `shield-checkmark-outline`

---

## 💡 Tips & Tricks

### For Best Experience

1. **Update profile picture** for better identification
2. **Enable notifications** to stay informed
3. **Use dark mode** to save battery
4. **Read privacy policy** to understand data usage
5. **Contact support** before deleting account

### For Developers

1. **Cache profile data** with React Query
2. **Invalidate queries** after updates
3. **Handle errors gracefully** with user-friendly messages
4. **Test image picker** on both iOS and Android
5. **Test soft delete flow** end-to-end

---

## 🎉 Summary

### What's New

- ✅ Profile tab replaces Settings tab
- ✅ Comprehensive profile management
- ✅ Image upload capability
- ✅ Account deletion with safety checks
- ✅ Settings integrated into profile
- ✅ About Us and Privacy Policy
- ✅ Social media links

### What's Better

- **More organized**: All user-related features in one place
- **More secure**: Password verification for critical actions
- **More informative**: Clear consequences and warnings
- **More flexible**: Easy profile updates with image support
- **More professional**: Polished UI with proper theming

---

**Ready to use! 🚀**
