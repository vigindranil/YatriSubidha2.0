import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants"; // 🆕 (NEW) — For dynamic base URL from app.json

export default async function getSlotBookingDetails(
  userId = "7976",
  startDate = "2025-03-03",
  endDate = "2025-03-13",
) {
  try {
    const token = await AsyncStorage.getItem("user_login_token");
    if (!token) {
      throw new Error("Authentication token not found. Please log in again.");
    }

    //  Get Base URL from app.json (extra.apiBaseUrl)
    const baseUrl = Constants.expoConfig.extra.apiBaseUrl;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const formdata = new FormData();
    formdata.append("UserID", userId);
    formdata.append("StartDate", startDate);
    formdata.append("EndDate", endDate);
    formdata.append("AuthInfo", "{}");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    //  Replaced hardcoded URL with dynamic base URL
    const response = await fetch(`${baseUrl}/GetSlotBookingDetails`, requestOptions);

    let result = await response.json();
    console.log("Slot Booking Details Result:", result);  
    return result;

  } catch (error) {
    console.error("Error fetching slot booking details:", error);
    return { error: true, message: error.message || "Unknown error" };
  }
}

// Example usage (uncomment to test):
// getSlotBookingDetails();
