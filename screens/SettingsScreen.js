import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Colors = {
  primary: '#000000',
  background: '#FFFFFF',
  text: '#000000',
  textLight: '#666666',
  border: '#CCCCCC',
  inactive: '#888888',
}

const SettingsScreen = ({ navigation, onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    // Call the onLogout function passed from App.js
    onLogout();
  };

  const menuItems = [
    { 
      title: 'Profile', 
      icon: 'person-outline',
      type: 'link',
      action: () => navigation.navigate('Profile') 
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: (newValue) => {
        setNotificationsEnabled(newValue);
      },
      description: 'Receive updates and announcements'
    },
    { 
      title: 'Display Mode', 
      icon: 'moon-outline',
      type: 'link',
      action: () => navigation.navigate('DisplayMode') 
    },
    { 
      title: 'About', 
      icon: 'information-circle-outline',
      type: 'link',
      action: () => navigation.navigate('About') 
    },
    { 
      title: 'Contact Us', 
      icon: 'mail-outline',
      type: 'link',
      action: () => navigation.navigate('ContactUs') 
    },
    { 
      title: 'Logout', 
      icon: 'log-out-outline',
      type: 'link',
      action: handleLogout,
      textColor: '#FF3B30' // Red color for logout
    },
  ];

  const renderMenuItem = (item, index) => {
    if (item.type === 'switch') {
      return (
        <View key={index} style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name={item.icon} size={24} color={Colors.primary} style={styles.icon} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuText}>{item.title}</Text>
              {item.description && (
                <Text style={styles.descriptionText}>{item.description}</Text>
              )}
            </View>
          </View>
          <Switch
            trackColor={{ false: Colors.border, true: Colors.inactive }}
            thumbColor={item.value ? Colors.primary : Colors.background}
            ios_backgroundColor={Colors.border}
            onValueChange={item.onValueChange}
            value={item.value}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.menuItem}
        onPress={item.action}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons name={item.icon} size={24} color={Colors.primary} style={styles.icon} />
          <Text style={styles.menuText}>{item.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => renderMenuItem(item, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    flex: 1,
  },
  icon: {
    marginRight: 15,
    color: Colors.primary,
  },
  menuText: {
    fontSize: 16,
    color: Colors.text,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 2,
  },
});

export default SettingsScreen; 