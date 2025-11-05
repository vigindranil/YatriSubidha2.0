import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosConfiguration from "../Axios_BaseUrl_Token_SetUp/axiosConfiguration";
import { setUser } from "./userSlice";


export const setUserInfo = async (dispatch) => {
    try {
        const getEmail = await AsyncStorage.getItem('user_login_email');
        const response = await axiosConfiguration.post('/user/get-profile-details', { email: getEmail }); // Replace with your API endpoint
        const data = response.data.response;
        const userData = {
            emailRedux: getEmail,
            profileImageRedux: data.image,
            nameRedux: data.name,
        };
        // Update Redux state
        dispatch(setUser(userData));
    } catch (error) {
        console.error('Failed to store the userData', error);
    }

}

