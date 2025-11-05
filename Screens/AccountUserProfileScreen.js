import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Image,
    Modal,
    ScrollView,
    Pressable,
    Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import ModalProfileEdit from "../Components/ModalProfileEdit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosConfiguration, { baseURL } from "../Axios_BaseUrl_Token_SetUp/axiosConfiguration";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/userSlice";
import { setUserInfo } from "../Redux/setUserInfo";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AccountUserProfileScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [ImageModalVisible, setImageModalVisible] = useState(false);

    // State variables for each input field
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [nationality, setNationality] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [triggerRefresh, setTriggerRefresh] = useState(false);

    const dispatch = useDispatch();

    const { emailRedux, profileImageRedux, nameRedux } = useSelector((state) => state.user);
    // console.log('Redux data', emailRedux, profileImageRedux, nameRedux);
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setTriggerRefresh(!triggerRefresh);
    };

    useEffect(() => {
        const getEmailAndProfileDetails = async () => {
            try {
                const getEmail = await AsyncStorage.getItem('user_login_email');
                setEmail(getEmail);
                const response = await axiosConfiguration.post('/user/get-profile-details', { email: getEmail }); // Replace with your API endpoint
                const data = response.data.response;
                setFullName(data.name);
                setMobileNumber(data.mobile);
                setPassportNumber(data.passport);
                setNationality(data.nationality);
                setAddress(data.address);
                setGender(data.gender || ''); // Set the gender if available
                setProfileImage(data.image || '');
                setProfileImageUrl(`${baseURL}/uploads/${data.image}`);

            } catch (error) {
                console.error('Error fetching profile details:', error);
            }
        };

        getEmailAndProfileDetails();

    }, [triggerRefresh]);

    const uploadImage = async (uri) => {
        try {
            const getEmail = await AsyncStorage.getItem('user_login_email');
            let formData = new FormData();
            formData.append('email', getEmail);
            formData.append('presentProfilePicture', profileImage);
            formData.append('avatar', {
                uri,
                name: 'profile.jpg',
                type: 'image/jpeg'
            });

            const response = await axiosConfiguration.post('/user/add-profile-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                Alert.alert('Success', 'Profile image uploaded successfully!');
                setTriggerRefresh(!triggerRefresh);
                await setUserInfo(dispatch);
            } else {
                Alert.alert('Error', 'Failed to upload profile image.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload profile image.');
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            setImageModalVisible(false);
            await uploadImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            setImageModalVisible(false);
            await uploadImage(result.assets[0].uri);
        }
    };

    const deleteImageFromDB = async () => {
        const response = await axiosConfiguration.post('/user/delete-profile-image', { filename: profileImage, email: email });
        // You might want to check the response or handle errors here
    };

    const handleDeleteImage = async () => {
        setAvatar(null);
        await deleteImageFromDB();
        await setUserInfo(dispatch);
        setImageModalVisible(false);
        setTriggerRefresh(!triggerRefresh);
    };

    const deleteImage = () => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", onPress: handleDeleteImage
                },
            ]
        );
        setImageModalVisible(false);
    };
    // console.log("Profile Image", profileImage);
    return (
        <>
            <View style={{ position: 'relative' }}>
                <View style={{ marginTop: -40, overflow: 'hidden', height: 175, transform: [{ scaleX: 1.4 }], }}>
                    <View
                        style={{
                            marginTop: -70,
                            backgroundColor: "#4123D0",
                            height: 235,
                            transform: [{ rotate: '-6deg' }],
                            borderBottomStartRadius: 385,
                            borderBottomEndRadius: 385,
                            overflow: "hidden",
                        }}
                    >

                    </View>
                </View>
                <View
                    // onPress={() => setImageModalVisible(true)}
                    style={{
                        backgroundColor: "white",
                        height: 160,
                        width: 160,
                        borderRadius: 160 / 2,
                        position: "absolute",
                        top: windowHeight * .04,
                        left: windowWidth * 0.30,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >

                    <Image
                        source={
                            avatar ? { uri: avatar } :
                                profileImage ? { uri: profileImageUrl } :
                                    require('../Images/DemoProfileImage.png')
                        }
                        style={{ height: 160, width: 160, borderRadius: 80 }}
                    />

                    <TouchableOpacity
                        onPress={() => setImageModalVisible(true)}
                        style={{
                            position: 'absolute',
                            top: windowHeight * .14,
                            left: windowWidth * 0.28,
                        }}>
                        <LinearGradient
                            colors={['#b3b3ff', '#fff', '#b3b3ff']} // Replace with your desired colors
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                height: 42,
                                width: 42,
                                borderRadius: 21,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Entypo name="camera" size={27} color="#7575a3" />
                        </LinearGradient>
                    </TouchableOpacity>


                </View>
            </View>

            <Text style={{
                fontSize: 20,
                color: "black",
                marginTop: "17%",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "#666666",
            }}
            >

                {fullName}
            </Text>
            <View style={{ flexDirection: 'row', position: 'relative', alignItems: 'center', marginTop: 10, justifyContent: 'center' }}>
                <View style={{
                    backgroundColor: "#4DC067",
                    height: 23,
                    width: 80,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <AntDesign
                        name="check"
                        size={13}
                        color="white"
                    />
                    <Text style={{ color: "white" }}> Verified</Text>
                </View>
                <TouchableOpacity
                    onPress={openModal}
                    style={{ position: 'absolute', right: "8%" }}>
                    <MaterialCommunityIcons
                        name="pencil-box-multiple-outline"
                        size={24}
                        color={"#595959"}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ marginVertical: 10 }} showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        marginTop: "5%",
                        height: 450,
                        width: "90%",
                        marginLeft: "5%",
                        borderRadius: 20,
                        elevation: 5,
                        marginTop: 15
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            marginTop: "10%",
                            borderBottomWidth: 0.5,
                            paddingBottom: "3%",
                            borderBottomColor: "#D8D8D8",
                        }}
                    >
                        <View style={{ width: '30%', marginRight: '4%', alignItems: 'flex-end' }}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 16,
                                color: "#666666",
                            }}
                            >
                                Email
                            </Text>
                        </View>
                        <View style={{ width: '6%' }}><Text style={{ fontWeight: '700' }}>:</Text></View>
                        <View style={{ width: '60%' }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: "0.5%",
                                    color: "#595959",
                                }}
                            >
                                {email}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            marginTop: "8%",
                            borderBottomWidth: 0.5,
                            paddingBottom: "3%",
                            borderBottomColor: "#D8D8D8",
                        }}
                    >
                        <View style={{ width: '30%', marginRight: '4%', alignItems: 'flex-end' }}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 16,
                                color: "#666666",
                            }}
                            >
                                Mobile
                            </Text>
                        </View>
                        <View style={{ width: '6%' }}><Text style={{ fontWeight: '700' }}>:</Text></View>
                        <View style={{ width: '60%' }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: "0.5%",
                                    color: "#595959",
                                }}
                            >
                                {mobileNumber}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            marginTop: "8%",
                            borderBottomWidth: 0.5,
                            paddingBottom: "3%",
                            borderBottomColor: "#D8D8D8",
                        }}
                    >
                        <View style={{ width: '30%', marginRight: '4%', alignItems: 'flex-end' }}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 16,
                                color: "#666666",
                            }}
                            >
                                Gender
                            </Text>
                        </View>
                        <View style={{ width: '6%' }}><Text style={{ fontWeight: '700' }}>:</Text></View>
                        <View style={{ width: '60%' }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: "0.5%",
                                    color: "#595959",
                                }}
                            >
                                {gender}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            marginTop: "8%",
                            borderBottomWidth: 0.5,
                            paddingBottom: "3%",
                            borderBottomColor: "#D8D8D8",
                        }}
                    >
                        <View style={{ width: '30%', marginRight: '4%', alignItems: 'flex-end' }}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 16,
                                color: "#666666",
                            }}
                            >
                                Passport
                            </Text>
                        </View>
                        <View style={{ width: '6%' }}><Text style={{ fontWeight: '700' }}>:</Text></View>
                        <View style={{ width: '60%' }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: "0.5%",
                                    color: "#595959",
                                }}
                            >
                                {passportNumber}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            marginTop: "8%",
                            borderBottomWidth: 0.5,
                            paddingBottom: "3%",
                            borderBottomColor: "#D8D8D8",
                        }}
                    >
                        <View style={{ width: '30%', marginRight: '4%', alignItems: 'flex-end' }}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 15,
                                color: "#666666",
                            }}
                            >
                                Nationality
                            </Text>
                        </View>
                        <View style={{ width: '6%' }}><Text style={{ fontWeight: '700' }}>:</Text></View>
                        <View style={{ width: '60%' }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginTop: "0.5%",
                                    color: "#595959",
                                }}
                            >
                                {nationality}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: 'center',
                            marginTop: "8%",
                            // borderBottomWidth: 0.5,
                            paddingBottom: "3%",
                            borderBottomColor: "#D8D8D8",
                        }}
                    >
                        <View style={{ width: '30%', marginRight: '4%', alignItems: 'flex-end' }}>
                            <Text style={{
                                fontWeight: "700",
                                fontSize: 15,
                                color: "#666666",
                            }}
                            >
                                Address
                            </Text>
                        </View>
                        <View style={{ width: '6%' }}><Text style={{ fontWeight: '700' }}>:</Text></View>
                        <View style={{ width: '60%', height: 100, flex: 1, paddingRight: 10 }}>
                            <Text
                                ellipsizeMode='tail'
                                numberOfLines={5}
                                style={{
                                    fontSize: 12,
                                    marginTop: "0.5%",
                                    color: "#595959"
                                }}>
                                {address}
                            </Text>
                        </View>
                    </View>










                </View>
                <Text
                    style={{
                        fontWeight: "bold",
                        marginTop: "5%",
                        marginLeft: "8%",
                        fontSize: 16,
                        color: "#666666",
                        marginBottom: "3%",
                    }}
                >
                    Quick Link
                </Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ width: "95%" }}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View
                        style={{ height: 50, width: 100, marginRight: 10, marginLeft: 15 }}
                    >
                        <View
                            style={{
                                borderColor: "black",
                                borderWidth: 0.5,
                                width: "150%",
                                borderRadius: 30,
                                borderColor: "#666666",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ flexDirection: "row" }}
                                onPress={() => navigation.navigate("BookingHistory")}
                            // onPress={() => navigation.navigate("Collabe")}
                            >
                                <MaterialCommunityIcons
                                    name="account"
                                    size={24}
                                    color="#666666"
                                />
                                <Text
                                    style={{
                                        paddingTop: "2%",
                                        paddingLeft: "0.1%",
                                        color: "#666666",
                                    }}
                                >
                                    Accountdetails
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{ height: 50, width: 100, marginRight: 10, marginLeft: 50 }}
                    >
                        <View
                            style={{
                                borderColor: "black",
                                borderWidth: 0.5,
                                width: "150%",
                                borderRadius: 30,
                                borderColor: "#666666",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ flexDirection: "row" }}
                                onPress={() => navigation.navigate("Bookingdetails")}
                            >
                                <MaterialCommunityIcons
                                    name="account"
                                    size={24}
                                    color="#666666"
                                />
                                <Text
                                    style={{
                                        paddingTop: "2%",
                                        paddingLeft: "0.1%",
                                        color: "#666666",
                                    }}
                                >
                                    Accountdetails
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{ height: 50, width: 100, marginRight: 10, marginLeft: 50 }}
                    >
                        <View
                            style={{
                                borderColor: "black",
                                borderWidth: 0.5,
                                width: "150%",
                                borderRadius: 30,
                                borderColor: "#666666",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ flexDirection: "row" }}
                                onPress={() => navigation.navigate("Collabe")}
                            >
                                <MaterialCommunityIcons
                                    name="account"
                                    size={24}
                                    color="#666666"
                                />
                                <Text
                                    style={{
                                        paddingTop: "2%",
                                        paddingLeft: "0.1%",
                                        color: "#666666",
                                    }}
                                >
                                    Accountdetails
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{ height: 50, width: 100, marginRight: 10, marginLeft: 50 }}
                    >
                        <View
                            style={{
                                borderColor: "black",
                                borderWidth: 0.5,
                                width: "150%",
                                borderRadius: 30,
                                borderColor: "#666666",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ flexDirection: "row" }}

                            >
                                <MaterialCommunityIcons
                                    name="account"
                                    size={24}
                                    color="#666666"
                                />
                                <Text
                                    style={{
                                        paddingTop: "2%",
                                        paddingLeft: "0.1%",
                                        color: "#666666",
                                    }}
                                >
                                    Accountdetails
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{ height: 50, width: 100, marginRight: 10, marginLeft: 50 }}
                    >
                        <View
                            style={{
                                borderColor: "black",
                                borderWidth: 0.5,
                                width: "150%",
                                borderRadius: 30,
                                borderColor: "#666666",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ flexDirection: "row" }}
                                onPress={() => navigation.navigate("BookingHistorycomp")}
                            >
                                <MaterialCommunityIcons
                                    name="account"
                                    size={24}
                                    color="#666666"
                                />
                                <Text
                                    style={{
                                        paddingTop: "2%",
                                        paddingLeft: "0.1%",
                                        color: "#666666",
                                    }}
                                >
                                    Accountdetails
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{ height: 50, width: 100, marginRight: 50, marginLeft: 50 }}
                    >
                        <View
                            style={{
                                borderColor: "black",
                                borderWidth: 0.5,
                                width: "150%",
                                borderRadius: 30,
                                borderColor: "#666666",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ flexDirection: "row" }}

                            >
                                <MaterialCommunityIcons
                                    name="account"
                                    size={24}
                                    color="#666666"
                                />
                                <Text
                                    style={{
                                        paddingTop: "2%",
                                        paddingLeft: "0.1%",
                                        color: "#666666",
                                    }}
                                >
                                    Accountdetails
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </ScrollView >
            <StatusBar barStyle="light-content" backgroundColor="#4123D0" translucent={true} />
            <ModalProfileEdit visible={modalVisible} onClose={closeModal} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={ImageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                {/* Semi-transparent background */}
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent background
                }}>
                    {/* Modal Content */}
                    <View style={{
                        width: '90%',  // Adjust the width as needed
                        backgroundColor: '#fff',
                        borderRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                        padding: 20, // Add padding for better spacing
                    }}>
                        <TouchableOpacity onPress={() => setImageModalVisible(false)} style={{
                            position: 'absolute',
                            top: 15,
                            right: 15,
                        }}>
                            <MaterialIcons name="close" size={25} color="#b30000" />
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', fontSize: 20, marginTop: 40, fontWeight: '700', color: '#4123d0' }}>Choose Image</Text>
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Image
                                source={
                                    avatar ?
                                        { uri: avatar }
                                        :
                                        profileImage ? { uri: profileImageUrl } : require('../Images/DemoProfileImage.png')
                                }
                                style={{ height: 300, width: 300 }}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', marginBottom: 5, marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={pickImage} style={{
                                flexDirection: 'row',
                                alignItems: 'center', paddingVertical: 4, paddingHorizontal: 13, backgroundColor: '#4123d0',
                                borderRadius: 18
                            }}>
                                <MaterialIcons name="photo-library" size={18} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', marginLeft: 3 }}>Upload from Gallery</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto} style={{
                                flexDirection: 'row', marginLeft: 5,
                                alignItems: 'center', paddingVertical: 4, paddingHorizontal: 13, backgroundColor: '#4123d0',
                                borderRadius: 18
                            }}>
                                <MaterialIcons name="photo-camera" size={18} color="#fff" />
                                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', marginLeft: 3 }}>Take a Photo</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={deleteImage} style={{
                                flexDirection: 'row', marginTop: 5, width: 130, alignItems: 'center', justifyContent: 'center',
                                paddingVertical: 3, paddingHorizontal: 5, backgroundColor: '#b30000',
                                borderRadius: 18
                            }}>
                                <Text> <MaterialIcons name="delete" size={18} color="#fff" /></Text>
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 3 }}>Delete Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </>
    );
};

export default AccountUserProfileScreen;

const styles = StyleSheet.create({});
