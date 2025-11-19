import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants"; // 🆕 (NEW) 
const SendOtp = async (email) => {
  try {
    let token = await AsyncStorage.getItem("user_login_token");
    if (!token) {
      return { success: false, message: "No auth token found. Please generate token first." };
    }

    
    const baseUrl = Constants.expoConfig.extra.apiBaseUrl;
    console.log("Fetch Baseurl",baseUrl);

    // Prepare headers
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    // Prepare body
    const formdata = new FormData();
    formdata.append("UserNameTypeID", "2");
    formdata.append("UserName", email);
    formdata.append(
      "AuthInfo",
      JSON.stringify({
        SessionID: "123",
        IPaddress: "192.168.1.1",
        MACAddress: "123456",
        OSversion: "MAC",
      })
    );

    // Request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    // 
    const response = await fetch(`${baseUrl}/SendOTP`, requestOptions);

    const result = await response.text();
    console.log("Send OTP Result:", result);

    if (result.includes("INVALID_TOKEN") || result.includes("expire")) {
      return { success: false, message: "Token expired. Please regenerate token." };
    }

    // Alert ko hata kar object return kiya gaya hai
    return { success: true, message: "OTP sent Successfully!" };
    
  } catch (error) {
    console.error("Send OTP Error:", error);
    // Alert ko hata kar object return kiya gaya hai
    return { success: false, message: "Failed to send OTP. Please check your internet connection." };
  }
};

export default SendOtp;
