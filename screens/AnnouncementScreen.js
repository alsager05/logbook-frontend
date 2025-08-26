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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements } from "../api/announcement";
import { useNavigation } from "@react-navigation/native";
import pic from "../assets/annoucement2.jpg";

export default function AnnouncementScreen() {
  const navigation = useNavigation();
  const currentYear = new Date().getFullYear();

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

  const { data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["announcementDetails"],
    queryFn: getAllAnnouncements,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}>
        <Text style={styles.dropdownButtonText}>
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
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}>
                <Text
                  style={[
                    styles.optionText,
                    selected === option && styles.selectedOption,
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

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filter by:</Text>
        <View style={styles.filtersContainer}>
          <View style={styles.dropdownsContainer}>
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
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F46E5"]}
            tintColor="#4F46E5"
          />
        }>
        {filteredAnnouncements?.map((announcement) => (
          <TouchableOpacity
            key={announcement._id}
            style={styles.announcementCard}
            onPress={() => handleAnnouncementPress(announcement)}>
            <Image
              source={pic}
              style={styles.announcementImage}
              resizeMode="cover"
            />
            <View style={styles.contentContainer}>
              <Text style={styles.date}>
                {new Date(announcement.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.title}>{announcement.title}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {announcement.body}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {filteredAnnouncements?.length === 0 && (
          <Text style={styles.noResults}>
            No announcements found for selected period
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterSection: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
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
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
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
