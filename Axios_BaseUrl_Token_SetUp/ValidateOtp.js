import AsyncStorage from "@react-native-async-storage/async-storage";

 
 
export const validateOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      // Alert ki jagah object return karein
      return { success: false, message: "Please enter both email and OTP." };
    }

    const token = await AsyncStorage.getItem("user_login_token");
    if (!token) {
      // Alert ki jagah object return karein
      return { success: false, message: "Auth token not found. Please generate OTP first." };
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const formdata = new FormData();
    formdata.append("UserName", email);
    formdata.append("OTP", otp);
    formdata.append(
      "AuthInfo",
      JSON.stringify({
        SessionID: "123",
        IPaddress: "192.168.1.1",
        MACAddress: "123456",
        OSversion: "MAC",
      })
    );

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    const response = await fetch(
      "https://yatrisubidha.wb.gov.in/service/ValidateOTP",
      requestOptions
    );

    const resultText = await response.text();
    let parsedResult;

    try {
      parsedResult = JSON.parse(resultText);
    } catch (err) {
      console.error("Failed to parse response:", err);
      // Alert ki jagah object return karein
      return { success: false, message: "Invalid response from server." };
    }

    // --- Yahan har condition ek object return karegi ---

    if (parsedResult?.error?.code === "INVALID_TOKEN") {
      return { success: false, message: "Token expired! Please generate a new one." };

    } else if (parsedResult?.error?.code === "OTP_EXPIRED") {
      return { success: false, message: parsedResult.error.message || "OTP expired. Please try again." };

    } else if (parsedResult?.status === 0) {
      // Success case
      try {
        await AsyncStorage.setItem("user_data", JSON.stringify(parsedResult.data));
        console.log("User data saved:", parsedResult.data);
      } catch (storageError) {
        console.error("Failed to save user data:", storageError);
        return { success: false, message: "Could not save user data. Please try again." };
      }
      return { success: true, message: parsedResult.message || "OTP validated successfully!" };

    } else {
      // **Yeh block galat OTP aur dusre errors ko handle karega**
      return { success: false, message: parsedResult?.message || "The OTP you entered is incorrect." };
    }
  } catch (error) {
    console.error("Validate OTP Error:", error);
    // General error ke liye bhi object return karein
    return { success: false, message: "Failed to validate OTP. Please check your internet connection." };
  }
};