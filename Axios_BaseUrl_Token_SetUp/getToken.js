import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('user_login_token');
        
        if (token !== null) {
            // If token exists, return it directly
            console.log('Token retrieved successfully', token);
            return token;
        } else {
            // If no token, proceed to generate one
            try {
                // setIsLoading(true);

                const form = new FormData();
                form.append("UserName", "admin");
                form.append("Password", "Vyoma@123");
                form.append("AuthInfo", "{}");
            
                console.log("Requesting auth token...");
            
                const res = await fetch("https://yatrisubidha.wb.gov.in/service/GenerateAuthTokenV1", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    Connection: "keep-alive",
                  },
                  body: form
                });
            
                const data = await res.json();
                console.log("TOKEN RESPONSE:", data);
            
                if (data?.status !== 0) {
                  alert(data?.error?.message || "Login failed");
                  return null; // Exit if login fails
                }
            
                const generatedToken = data.data.authorization.token;
                await AsyncStorage.setItem("user_login_token", generatedToken); // Store the new token
            
                console.log("New token generated and stored successfully", generatedToken);
            
                // Return the newly generated token
                return generatedToken;
            
            } catch (err) {
                console.log("ERROR:", err);
                alert("No internet or server timeout");
                return null; // Return null if error occurs
            } finally {
                // setIsLoading(false);
            }
        }
    } catch (error) {
        console.error('Failed to retrieve the token', error);
        return "Error in getting token"; // Return null in case of an error
    }
};

