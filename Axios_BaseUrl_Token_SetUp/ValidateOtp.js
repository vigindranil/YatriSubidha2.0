import AsyncStorage from "@react-native-async-storage/async-storage";

export const validateOTP = async (email, otp) => {
  try {
     if (!email || !otp) {
      return { success: false, message: "Please enter both email and OTP." };
    }

    const token = await AsyncStorage.getItem("user_login_token");
     if (!token) {
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
        IPaddress: "192.1.1",
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
       return { success: false, message: "Invalid response from server." };
    }

     if (parsedResult?.error?.code === "INVALID_TOKEN") {
      return { success: false, message: "Token expired! Please generate a new one." };
    } else if (parsedResult?.error?.code === "OTP_EXPIRED") {
      return { success: false, message: parsedResult.error.message || "OTP expired. Please try again." };
    } else if (parsedResult?.status === 0) {
      // Success ke case me, pehle data save karein
      try {
        await AsyncStorage.setItem("user_data", JSON.stringify(parsedResult.data));
        console.log("User data saved:", parsedResult.data);
      } catch (storageError) {
        console.error("Failed to save user data:", storageError);
        // Data save na hone par bhi error message return karein
        return { success: false, message: "Could not save user data. Please try again." };
      }
      // Fir success object return karein
      return { success: true, message: parsedResult.message || "OTP validated successfully!" };
    } else {
      // Baaki sabhi errors ke liye
      return { success: false, message: parsedResult?.message || "OTP validation failed." };
    }
  } catch (error) {
    console.error("Validate OTP Error:", error);
    // General catch block ke liye bhi object return karein
    return { success: false, message: "Failed to validate OTP. Please try again." };
  }
};