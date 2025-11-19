import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator, Modal, Animated } from 'react-native'
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

// Premium Custom Dialog Component - Simple without typing animation
const CustomAlertDialog = ({ visible, title, message, onClose, type = "success" }) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const fadeValue = useRef(new Animated.Value(0)).current;
    const slideValue = useRef(new Animated.Value(50)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            // Reset animations
            scaleValue.setValue(0);
            fadeValue.setValue(0);
            slideValue.setValue(50);
            
            // Start entrance animations
            Animated.parallel([
                Animated.spring(scaleValue, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeValue, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideValue, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            // Icon pulse animation
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseValue, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseAnimation.start();

            // Cleanup function
            return () => {
                pulseAnimation.stop();
            };
        }
    }, [visible]);

    if (!visible) return null;

    const isSuccess = type === "success" || title.toLowerCase().includes("success");
    const isError = type === "error" || title.toLowerCase().includes("error") || title.toLowerCase().includes("failed");
    
    const primaryColor = isError ? "#FF3B30" : "#34C759";
    const secondaryColor = isError ? "#FF6B6B" : "#66E07D";
    const iconEmoji = isError ? "⚠️" : "✓";
    const iconBgColor = isError ? "#FFE5E5" : "#E5F9E5";

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: fadeValue }]}>
                <Pressable style={styles.modalOverlayPressable} onPress={onClose}>
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                transform: [
                                    { scale: scaleValue },
                                    { translateY: slideValue }
                                ],
                            },
                        ]}
                        onStartShouldSetResponder={() => true}
                    >
                        {/* Decorative Header Bar */}
                        <LinearGradient
                            colors={[primaryColor, secondaryColor]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.modalHeaderBar}
                        >
                            <View style={styles.headerDots}>
                                <View style={styles.headerDot} />
                                <View style={styles.headerDot} />
                                <View style={styles.headerDot} />
                            </View>
                        </LinearGradient>

                        {/* Animated Icon Container */}
                        <Animated.View
                            style={[
                                styles.iconContainer,
                                { 
                                    backgroundColor: iconBgColor,
                                    transform: [{ scale: pulseValue }]
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={[primaryColor, secondaryColor]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.iconGradient}
                            >
                                <Text style={styles.iconText}>{iconEmoji}</Text>
                            </LinearGradient>
                        </Animated.View>

                        {/* Content - Direct display without typing */}
                        <View style={styles.contentContainer}>
                            <Text style={[styles.modalTitle, { color: primaryColor }]}>
                                {title}
                            </Text>
                            <Text style={styles.modalMessage}>{message}</Text>
                        </View>

                        {/* Action Button */}
                        <TouchableOpacity
                            style={styles.modalButtonWrapper}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[primaryColor, secondaryColor]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.modalButton}
                            >
                                <Text style={styles.modalButtonText}>OK</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Decorative Corner Elements */}
                        <View style={[styles.cornerTopLeft, { borderColor: primaryColor }]} />
                        <View style={[styles.cornerBottomRight, { borderColor: primaryColor }]} />
                    </Animated.View>
                </Pressable>
            </Animated.View>
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
    const [dialogType, setDialogType] = useState('success');


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

    // OTP handle Function
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
                setDialogType("error");
                setIsDialogVisible(true);
                setIsLoading(false);
                return;
            }
            
            const response = await sendOTP(email);

            setDialogTitle(response.success ? "Success" : "Error");
            setDialogMessage(response.message);
            setDialogType(response.success ? "success" : "error");
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
            setDialogType("error");
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
    
   // Validate OTP Function
const handleValidateOtp = async () => {
    setIsLoading(true);
    console.log("🔹 Starting OTP Validation...");
    
    try {
        console.log("🔹 Validating OTP...");
        const response = await validateOTP(email, otp);
        
        console.log("📦 Validation Response:", response);
        
        if (response.success) {
            console.log(" OTP validated successfully");
            
            // IMPORTANT: Set dialog states BEFORE showing dialog
            setDialogType("success");
            setDialogTitle("Success");
            setDialogMessage("OTP validated successfully!");
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Now show the dialog
            setIsDialogVisible(true);
            console.log("Dialog should be visible now");

            setTimeout(() => {
                console.log(" Navigating to home...");
                navigation.reset({
                    index: 0,
                    routes: [{ name: "CustomTabNavigator" }],
                });
            }, 1500); 
        } else {
            console.log("OTP validation failed:", response.message);
            setDialogType("error");
            setDialogTitle("Validation Failed");
            setDialogMessage(response.message || "Invalid OTP. Please try again.");
            
            await new Promise(resolve => setTimeout(resolve, 100));
            setIsDialogVisible(true);
        }
    } catch (e) {
        console.error(" Error in validate otp:", e);
        setDialogType("error");
        setDialogTitle("Error");
        setDialogMessage("An unexpected error occurred. Please try again.");
        
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsDialogVisible(true);
    } finally {
        setIsLoading(false);
        console.log("Validation process completed");
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
                type={dialogType}
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
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    modalOverlayPressable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '88%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 15,
    },
    modalHeaderBar: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        paddingLeft: 20,
    },
    headerDots: {
        flexDirection: 'row',
        gap: 8,
    },
    headerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignSelf: 'center',
        marginTop: -45,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    iconGradient: {
        flex: 1,
        borderRadius: 41,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 44,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666666',
        lineHeight: 24,
        paddingHorizontal: 8,
    },
    modalButtonWrapper: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    modalButton: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 70,
        left: 20,
        width: 24,
        height: 24,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderTopLeftRadius: 6,
        opacity: 0.25,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        width: 24,
        height: 24,
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomRightRadius: 6,
        opacity: 0.25,
    },
})