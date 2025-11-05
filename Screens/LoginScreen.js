import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Modal } from 'react-native' // Modal ko import karein
import React, { useCallback, useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginSpringButton from '../ToolComponents/LoginSpringButton';
import { Entypo } from '@expo/vector-icons'; // <--- YAHAN SPELLING THEEK KAR DI GAYI HAI
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { getToken } from '../Axios_BaseUrl_Token_SetUp/getToken';
import { setToken } from '../Axios_BaseUrl_Token_SetUp/setToken';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../Redux/setUserInfo';
import sendOTP from "../Axios_BaseUrl_Token_SetUp/sendOtp.js"
import { validateOTP } from "../Axios_BaseUrl_Token_SetUp/ValidateOtp.js"

// Custom Dialog Component
const CustomAlertDialog = ({ visible, title, message, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalMessage}>{message}</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                        <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};


const LoginScreen = ({ navigation }) => {
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get('window').width;
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isOtpBtnActive, setIsOtpBtnActive] = useState(true);
    const [isOtp, setIsOtp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [reset, setReset] = useState(false)
    const [resetPressCount, setResetPressCount] = useState(0)
    const dispatch = useDispatch();

    // Custom Dialog ke liye States
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');


    useEffect(() => {
        console.log('fetching');
        fetch("https://yatrisubidha.wb.gov.in/").catch(() => {
            console.log('error');
        });
        console.log('token');
    }, []);

    const validateEmail = (event) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(event)) {
            setIsValid(false);
            setEmail(event);
        }
        else {
            setIsValid(true);
            setEmail('');
        }
    };

    // OTP handle Function - Updated to use Custom Dialog
    const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            // Clear both token and user_data to prevent auto-login before OTP validation
            await AsyncStorage.removeItem('user_login_token');
            await AsyncStorage.removeItem('user_data');
            const token = await getToken();
            if (!token) {
                setDialogTitle("Error");
                setDialogMessage("Failed to generate or retrieve token.");
                setIsDialogVisible(true);
                setIsLoading(false);
                return;
            }
            
            const response = await sendOTP(email);

            setDialogTitle(response.success ? "Success" : "Error");
            setDialogMessage(response.message);
            setIsDialogVisible(true);

            if (response.success) {
                setIsOtp(true);
            } else {
                setIsOtp(false);
            }
        } catch (error) {
            console.error('Error in handleSendOTP:', error);
            setDialogTitle("Error");
            setDialogMessage("An unexpected error occurred. Please try again.");
            setIsDialogVisible(true);
        } finally {
            setIsLoading(false);
        }
    }


    console.log("otp", otp);


    const otpValidate = (event) => {
        if (event) {
            setIsOtpBtnActive(false);
            setOtp(event);
        }
        else {
            setIsOtpBtnActive(true);
            setOtp('');
        };
    }
    
    // THEEK KIYA HUA FUNCTION
    const handleValidateOtp = async () => {
        setIsLoading(true);
        try {
            console.log("🔹 In the validate OTP function...");
            const response = await validateOTP(email, otp);
            
            if (response.success) {
                console.log("OTP validated successfully");
                // Navigation se pehle success ka dialog dikha sakte hain (optional)
                setDialogTitle("Success!");
                setDialogMessage(response.message);
                setIsDialogVisible(true);

                // Thodi der baad navigate karein ya dialog ke OK button par
                setTimeout(() => {
                    setIsDialogVisible(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "CustomTabNavigator" }],
                    });
                }, 1500); // 1.5 second baad

            } else {
                console.log(" OTP validation failed");
                setDialogTitle("Validation Failed");
                setDialogMessage(response.message);
                setIsDialogVisible(true);
            }
        } catch (e) {
            console.error("in the validate otp error", e);
            setDialogTitle("Error");
            setDialogMessage("An unexpected error occurred. Please try again.");
            setIsDialogVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const checkLogin = async () => {
                const token = await AsyncStorage.getItem("user_login_token");
                const userData = await AsyncStorage.getItem("user_data");

                if (token && userData) {
                    console.log("✅ Auto login success");
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "CustomTabNavigator" }],
                    });
                }
            };
            checkLogin();
        }, [reset])
    );

    const handleReset = () => {
        setEmail('');
        setOtp('');
        setIsValid(true);
        setIsOtpBtnActive(true);
        setIsOtp(false);
        setIsLoading(false);
        setErrMsg('');
        setResetPressCount(0);
        setReset(!reset);
    };

    return (
        <LinearGradient colors={["#ccdcff", "#ccdcff", "#ccdcff"]} style={{ flex: 1 }}>
            <CustomAlertDialog
                visible={isDialogVisible}
                title={dialogTitle}
                message={dialogMessage}
                onClose={() => setIsDialogVisible(false)}
            />

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 40, height: 40, width: 40, marginLeft: 15 }}>
                <AntDesign name="arrowleft" size={30} color="#4d4d4d" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', marginTop: windowHeight / 5, marginBottom: 5, }}>
                <Text style={{
                    fontSize: 26, fontWeight: '700',
                    color: '#4d4d4d', textAlign: 'center'
                }}>Sign In to your account!</Text>

                <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 14, fontWeight: '600', color: isOtp ? '#0000b3' : '#595959' }}>
                    {isOtp ?
                        "An One Time Password has been sent to your Email for verification"
                        :
                        isLoading ? "Sending OTP..." : "An One Time Password will be sent to your Email for verification"
                    }
                </Text>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#4123d0" style={{ marginTop: 20 }} />
                ) : (
                    isOtp ? (
                        <>
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontSize: 14, color: '#737373', marginLeft: 15 }}>Enter One Time Password</Text>
                                <View style={{ height: 40, width: 360, borderWidth: .5, marginHorizontal: 15, borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                    <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <Entypo name="lock" size={24} color="#737373" />
                                    </View>
                                    <TextInput
                                        onChangeText={otpValidate}
                                        style={{ width: 280, height: 40 }}
                                        placeholder='One Time Password'
                                        inputMode='numeric'
                                        maxLength={6}
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
                                {errMsg ? (<View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: '#ff0000', textAlign: 'center', fontWeight: '600', fontSize: 15 }}>{errMsg}</Text>

                                    {resetPressCount < 1 ? (
                                        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                            <TouchableOpacity
                                                onPress={handleReset}
                                                style={{ padding: 6, width: 100, backgroundColor: '#4123d0', borderRadius: 5, marginRight: 7, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Reset</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleSendOTP();
                                                    setResetPressCount((count) => count + 1);
                                                }}
                                                style={{ padding: 6, width: 100, backgroundColor: '#4123d0', borderRadius: 5, marginLeft: 7, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Resend OTP</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={handleReset}
                                            style={{ padding: 6, width: 100, backgroundColor: '#4123d0', borderRadius: 5, marginLeft: 7, alignItems: 'center', justifyContent: 'center', marginVertical: 5 }}>
                                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Reset</Text>
                                        </TouchableOpacity>
                                    )}

                                </View>) :
                                    resetPressCount < 1 ?
                                        (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleSendOTP();
                                                    setResetPressCount((count) => count + 1);
                                                }}
                                                style={{ padding: 5 }}>
                                                <Text style={{ color: '#ff0000', textAlign: 'center', fontWeight: '600', fontSize: 15, marginVertical: 10 }}>Resend One Time Password</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                                                <TouchableOpacity
                                                    onPress={handleReset}
                                                    style={{ padding: 6, width: 100, backgroundColor: '#4123d0', borderRadius: 5, marginRight: 7, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Reset</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                <Text style={{ fontSize: 14, color: '#4d4d4d', textAlign: 'center' }}>There might be some delay in receiving the One Time Password. OTP Will be expired in 15 minutes.</Text>
                            </View>

                            <View style={{ marginTop: 25 }}>
                                <LoginSpringButton
                                    onPress={handleValidateOtp}
                                    title={'Validate'}
                                    btnHeight={50}
                                    btnWidth={screenWidth * .93}
                                    bfrPrsColor={['#563bde', '#4325da']}
                                    aftPrsColor={['#4123d0', '#3c21c4']}
                                    btnTxtColor={'#fff'}
                                    btnTxtSize={20}
                                    isDisabled={isOtpBtnActive}
                                />
                            </View>
                        </>

                    ) : (
                        <>
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontSize: 14, color: '#737373', marginLeft: 15 }}>Enter Email Address</Text>
                                <View style={{ height: 40, width: 360, borderWidth: .5, marginHorizontal: 15, borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                    <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                                        <MaterialCommunityIcons name="email" size={24} color="#737373" />
                                    </View>
                                    <TextInput
                                        onChangeText={validateEmail}
                                        style={{ width: 280, height: 40 }}
                                        placeholder='Email Address'
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 25 }}>
                                <LoginSpringButton
                                    onPress={handleSendOTP}
                                    title={'Send OTP'}
                                    btnHeight={50}
                                    btnWidth={screenWidth * .93}
                                    bfrPrsColor={['#563bde', '#4325da']}
                                    aftPrsColor={['#4123d0', '#3c21c4']}
                                    btnTxtColor={'#fff'}
                                    btnTxtSize={18}
                                    isDisabled={isValid}
                                />
                            </View>
                        </>
                    )

                )}
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        </LinearGradient >
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '85%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    modalButton: {
        backgroundColor: '#4123d0',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})