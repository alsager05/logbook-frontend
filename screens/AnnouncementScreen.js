import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { announcementService } from "../api/announcement";
import { useNavigation } from "@react-navigation/native";
import pic from "../assets/annoucement2.jpg";
import { useTheme } from "../contexts/ThemeContext";
import { useInstitution } from "../contexts/InstitutionContext";
import { AnnouncementListSkeleton } from "../loading-skeletons";

export default function AnnouncementScreen() {
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const { selectedInstitution } = useInstitution();

  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const years = ["All", currentYear.toString(), (currentYear - 1).toString()];
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { data, isFetching, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ["institutionAnnouncements", selectedInstitution?._id],
    queryFn: () =>
      announcementService.getInstitutionAnnouncements(selectedInstitution?._id),
    enabled: !!selectedInstitution?._id,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const themedStyles = createThemedStyles(theme);

  const filteredAnnouncements = data?.filter((announcement) => {
    // If no filters are selected, return all announcements
    if (selectedYear === "All" && selectedMonth === "All") {
      return true;
    }

    const announcementDate = new Date(announcement.createdAt);
    const announcementYear = announcementDate.getFullYear().toString();
    const announcementMonth = months[announcementDate.getMonth() + 1];

    // Apply year filter if selected
    if (selectedYear !== "All" && announcementYear !== selectedYear) {
      return false;
    }

    // Apply month filter if selected
    if (
      selectedMonth !== "All" &&
      months[announcementDate.getMonth() + 1] !== selectedMonth
    ) {
      return false;
    }

    return true;
  });

  const Dropdown = ({
    title,
    selected,
    options,
    visible,
    setVisible,
    onSelect,
  }) => (
    <View style={themedStyles.dropdownContainer}>
      <TouchableOpacity
        style={themedStyles.dropdownButton}
        onPress={() => setVisible(true)}>
        <Text style={themedStyles.dropdownButtonText}>
          {title}: {selected}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={themedStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={themedStyles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={themedStyles.optionButton}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}>
                <Text
                  style={[
                    themedStyles.optionText,
                    selected === option && themedStyles.selectedOption,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  const handleSearch = () => {
    // You can add additional search logic here if needed
    console.log("Searching for:", selectedYear, selectedMonth);
  };

  const handleAnnouncementPress = (announcement) => {
    navigation.navigate("AnnouncementDetails", { announcement });
  };

  // Show skeleton while initial loading (not refreshing)
  if (isLoading && !refreshing) {
    return <AnnouncementListSkeleton />;
  }

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.filterSection}>
        <Text style={themedStyles.filterTitle}>Filter by:</Text>
        <View style={themedStyles.filtersContainer}>
          <View style={themedStyles.dropdownsContainer}>
            <Dropdown
              title="Year"
              selected={selectedYear}
              options={years}
              visible={showYearPicker}
              setVisible={setShowYearPicker}
              onSelect={setSelectedYear}
            />
            <Dropdown
              title="Month"
              selected={selectedMonth}
              options={months}
              visible={showMonthPicker}
              setVisible={setShowMonthPicker}
              onSelect={setSelectedMonth}
            />
          </View>
          {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView
        style={themedStyles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }>
        {filteredAnnouncements?.map((announcement) => (
          <TouchableOpacity
            key={announcement._id}
            style={themedStyles.announcementCard}
            onPress={() => handleAnnouncementPress(announcement)}>
            <Image
              source={pic}
              style={themedStyles.announcementImage}
              resizeMode="cover"
            />
            <View style={themedStyles.contentContainer}>
              <Text style={themedStyles.date}>
                {new Date(announcement.createdAt).toLocaleDateString()}
              </Text>
              <Text style={themedStyles.title}>{announcement.title}</Text>
              <Text style={themedStyles.description} numberOfLines={2}>
                {announcement.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {filteredAnnouncements?.length === 0 && (
          <Text style={themedStyles.noResults}>
            No announcements found for selected period
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get("window").width;

const createThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    filterSection: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 10,
    },
    filtersContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    dropdownsContainer: {
      flex: 1,
      flexDirection: "row",
      gap: 10,
    },
    dropdownContainer: {
      flex: 1,
    },
    dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: theme.text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      width: "80%",
      maxHeight: "80%",
    },
    optionButton: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    optionText: {
      fontSize: 16,
      color: "#333",
    },
    selectedOption: {
      color: "#007AFF",
      fontWeight: "bold",
    },
    scrollView: {
      flex: 1,
      padding: 15,
    },
    announcementCard: {
      backgroundColor: theme.card,
      borderRadius: 15,
      marginBottom: 20,
      elevation: 3,
      shadowColor: theme.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    announcementImage: {
      width: 400,
      height: 200,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },
    contentContainer: {
      padding: 15,
      backgroundColor: theme.card,
    },
    date: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.text,
    },
    description: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 22,
    },
    noResults: {
      textAlign: "center",
      fontSize: 16,
      color: theme.textSecondary,
      marginTop: 20,
    },
    searchButton: {
      backgroundColor: "#007AFF",
      width: 44,
      height: 44,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
