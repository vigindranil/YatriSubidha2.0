import AsyncStorage from "@react-native-async-storage/async-storage";

 
const savePassengerBooking = async (bookingData) => {
  try {
     const token = await AsyncStorage.getItem("user_login_token");
    if (!token) {
      return { success: false, message: "Authentication token not found. Please log in again.", data: null };
    }

     const myHeaders = new Headers();
    myHeaders.append("Authorization", token);  

     const formdata = new FormData();
    formdata.append("PassengerInformation", JSON.stringify(bookingData.passengerInfo));
    formdata.append("PrefferedSlotID", bookingData.slotId);
    formdata.append("JourneyDate", bookingData.journeyDate);
    formdata.append(
      "AuthInfo",
      JSON.stringify({
        SessionID: "123",
        IPaddress: "192.168.1.1",
        MACAddress: "123456",
        OSversion: "MAC",
      })
    );
    formdata.append("Type", "2");  

     const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    // 5. Call the API
    const response = await fetch(
      "https://yatrisubidha.wb.gov.in/service/savePassengerSlotBooking",
      requestOptions
    );

    const result = await response.text();
    console.log("Booking Save Result:", result);

     if (result.includes("SUCCESS")) {
      return { success: true, message: "Booking saved successfully!", data: result };
    } else if (result.includes("INVALID_TOKEN") || result.includes("expire")) {
      return { success: false, message: "Session expired. Please log in again.", data: result };
    } else {
      return { success: false, message: "Failed to save booking.", data: result };
    }
  } catch (error) {
    console.error("Save Booking Error:", error);
    return {
      success: false,
      message: "An error occurred. Please check your internet connection.",
      data: null,
    };
  }
};

export default savePassengerBooking;
