import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginSpringButton from '../ToolComponents/LoginSpringButton';
import { Entypo } from '@expo/vector-icons';
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

const LoginScreen = ({ navigation }) => {
    const windowHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get('window').width;
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [resetPressCount, setResetPressCount] = useState(0)
    const [reset, setReset] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        // Initial fetch, can be kept or removed based on necessity
        fetch("https://yatrisubidha.wb.gov.in/").catch((err) => {
            console.log('Network check error:', err);
        });
    }, []);

    const validateEmail = (text) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmail(text);
        if (emailRegex.test(text)) {
            setIsValidEmail(true);
        } else {
            setIsValidEmail(false);
        }
    };

    const handleSendOTP = async () => {
        if (!isValidEmail) return;
        
        setIsLoading(true);
        try {
            // Clear previous login data to ensure a fresh login
            await AsyncStorage.multiRemove(['user_login_token', 'user_data']);
            
            const token = await getToken();
            if (!token) {
                Alert.alert(
                    "Error",
                    "Failed to retrieve a security token. Please check your connection.",
                    [{ text: "OK" }]
                );
                return; // Stop execution
            }
            
            const response = await sendOTP(email);
            
            Alert.alert(
                response.success ? "Success" : "Error",
                response.message,
                [{ text: "OK" }]
            );

            if (response.success) {
                setIsOtpSent(true);
                setErrMsg(''); // Clear previous errors
                setResetPressCount(0); // Reset resend counter
            }
        } catch (error) {
            console.error('Error in handleSendOTP:', error);
            Alert.alert(
                "Request Failed",
                "An unexpected error occurred while sending OTP. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setIsLoading(false);
        }
    }

    const handleValidateOtp = async () => {
        if (otp.length !== 4) {
            Alert.alert(
                "Invalid OTP",
                "Please enter a valid 6-digit OTP.",
                [{ text: "OK" }]
            );
            return;
        }

        setIsLoading(true);
        try {
            const response = await validateOTP(email, otp);
            
            if (response.success) {
                Alert.alert(
                    "Success",
                    "OTP validated successfully!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: "CustomTabNavigator" }],
                                });
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    "Validation Failed",
                    response.message || "Invalid OTP. Please try again.",
                    [{ text: "OK" }]
                );
                setErrMsg(response.message || "Invalid OTP. Please try again.");
            }
        } catch (e) {
            console.error("Error in validate otp:", e);
            Alert.alert(
                "Error",
                "An unexpected error occurred during validation. Please try again.",
                [{ text: "OK" }]
            );
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
                    console.log("✅ Auto login successful");
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
        setIsValidEmail(false);
        setIsOtpSent(false);
        setIsLoading(false);
        setErrMsg('');
        setResetPressCount(0);
        setReset(!reset);
    };

    return (
        <LinearGradient colors={["#ccdcff", "#e6eeff", "#ccdcff"]} style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 40, height: 40, width: 40, marginLeft: 15, position: 'absolute', zIndex: 1 }}>
                <AntDesign name="arrowleft" size={30} color="#4d4d4d" />
            </TouchableOpacity>
            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
                <Text style={{ fontSize: 26, fontWeight: '700', color: '#4d4d4d', textAlign: 'center', marginBottom: 20 }}>
                    Sign In to your account!
                </Text>

                <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 14, fontWeight: '600', color: isOtpSent ? '#0000b3' : '#595959' }}>
                    {isOtpSent 
                        ? "An One Time Password has been sent to your Email for verification"
                        : "An One Time Password will be sent to your Email for verification"
                    }
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#4123d0" style={{ marginTop: 20 }} />
                ) : !isOtpSent ? (
                    <>
                        <Text style={styles.inputLabel}>Enter Email Address</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialCommunityIcons name="email" size={24} color="#737373" />
                            </View>
                            <TextInput
                                onChangeText={validateEmail}
                                style={styles.textInput}
                                placeholder='Email Address'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                value={email}
                            />
                        </View>
                        <View style={{ marginTop: 25 }}>
                            <LoginSpringButton
                                onPress={handleSendOTP}
                                title={'Send OTP'}
                                btnHeight={50}
                                btnWidth={screenWidth * .9}
                                bfrPrsColor={['#563bde', '#4325da']}
                                aftPrsColor={['#4123d0', '#3c21c4']}
                                btnTxtColor={'#fff'}
                                btnTxtSize={18}
                                isDisabled={!isValidEmail}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.inputLabel}>Enter One Time Password</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <Entypo name="lock" size={24} color="#737373" />
                            </View>
                            <TextInput
                                onChangeText={setOtp}
                                style={styles.textInput}
                                placeholder='One Time Password'
                                keyboardType='numeric'
                                maxLength={6}
                                value={otp}
                            />
                        </View>

                        {errMsg && (
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <Text style={styles.errorText}>{errMsg}</Text>
                            </View>
                        )}
                        
                        <View style={styles.resendContainer}>
                            {resetPressCount < 1 ? (
                                <TouchableOpacity onPress={() => { handleSendOTP(); setResetPressCount(c => c + 1); }}>
                                    <Text style={styles.resendText}>Resend One Time Password</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={{color: '#737373'}}>You can resend OTP once.</Text>
                            )}
                             <TouchableOpacity onPress={handleReset} style={{marginTop: 10}}>
                                <Text style={styles.resetLink}>Use another email? Reset</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.infoText}>
                            There might be some delay in receiving the OTP. It will expire in 15 minutes.
                        </Text>
                        
                        <View style={{ marginTop: 25 }}>
                            <LoginSpringButton
                                onPress={handleValidateOtp}
                                title={'Validate'}
                                btnHeight={50}
                                btnWidth={screenWidth * .9}
                                bfrPrsColor={['#563bde', '#4325da']}
                                aftPrsColor={['#4123d0', '#3c21c4']}
                                btnTxtColor={'#fff'}
                                btnTxtSize={20}
                                isDisabled={otp.length !== 4}
                            />
                        </View>
                    </>
                )}
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        </LinearGradient >
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    // Input and other component styles
    inputLabel: {
        fontSize: 14,
        color: '#737373',
        alignSelf: 'flex-start',
        marginLeft: 5,
        marginBottom: 8,
    },
    inputContainer: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#B0B0B0',
        borderRadius: 8,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    iconWrapper: {
        height: '100%',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    errorText: {
        color: '#ff0000',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15
    },
    resendContainer: {
        marginVertical: 15,
        alignItems: 'center'
    },
    resendText: {
        color: '#0055ff',
        fontWeight: '600',
        fontSize: 15,
    },
    resetLink: {
        color: '#4123d0',
        fontWeight: '700'
    },
    infoText: {
        fontSize: 14,
        color: '#4d4d4d',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 10,
    },
});