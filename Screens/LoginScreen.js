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
        let pulseAnimation;
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
            pulseAnimation = Animated.loop(
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
        }

        // Cleanup function
        return () => {
            if (pulseAnimation) {
                pulseAnimation.stop();
            }
        };
    }, [visible]);

    if (!visible) return null;

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
                        // Prevent modal from closing when clicking inside
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

                        {/* Content */}
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

    // Custom Dialog States
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState('success');

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
                setDialogTitle("Error");
                setDialogMessage("Failed to retrieve a security token. Please check your connection.");
                setDialogType("error");
                setIsDialogVisible(true);
                return; // Stop execution
            }
            
            const response = await sendOTP(email);
            
            setDialogTitle(response.success ? "Success" : "Error");
            setDialogMessage(response.message);
            setDialogType(response.success ? "success" : "error");
            setIsDialogVisible(true);

            if (response.success) {
                setIsOtpSent(true);
                setErrMsg(''); // Clear previous errors
                setResetPressCount(0); // Reset resend counter
            }
        } catch (error) {
            console.error('Error in handleSendOTP:', error);
            setDialogTitle("Request Failed");
            setDialogMessage("An unexpected error occurred while sending OTP. Please try again.");
            setDialogType("error");
            setIsDialogVisible(true);
        } finally {
            setIsLoading(false);
        }
    }

    const handleValidateOtp = async () => {
        if (otp.length !== 6) {
            setDialogTitle("Invalid OTP");
            setDialogMessage("Please enter a valid 6-digit OTP.");
            setDialogType("error");
            setIsDialogVisible(true);
            return;
        }

        setIsLoading(true);
        try {
            const response = await validateOTP(email, otp);
            
            if (response.success) {
                setDialogTitle("Success");
                setDialogMessage("OTP validated successfully! Redirecting...");
                setDialogType("success");
                setIsDialogVisible(true);

                // Navigate after a short delay to let user see the success message
                setTimeout(() => {
                    setIsDialogVisible(false); // Hide dialog before navigating
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "CustomTabNavigator" }],
                    });
                }, 1500);
            } else {
                setDialogTitle("Validation Failed");
                setDialogMessage(response.message || "Invalid OTP. Please try again.");
                setDialogType("error");
                setIsDialogVisible(true);
                setErrMsg(response.message || "Invalid OTP. Please try again.");
            }
        } catch (e) {
            console.error("Error in validate otp:", e);
            setDialogTitle("Error");
            setDialogMessage("An unexpected error occurred during validation. Please try again.");
            setDialogType("error");
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
            <CustomAlertDialog
                visible={isDialogVisible}
                title={dialogTitle}
                message={dialogMessage}
                type={dialogType}
                onClose={() => setIsDialogVisible(false)}
            />

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
                                isDisabled={otp.length !== 6}
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
    
    // Modal styles (unchanged from your original code)
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
});