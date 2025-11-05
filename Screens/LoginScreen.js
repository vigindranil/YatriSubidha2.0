import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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

// import axiosConfiguration from "../Axios_BaseUrl_Token_SetUp/axiosConfiguration";

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
    const [errMsg, setErrMsg] = useState();
    const [reset, setReset] = useState(false)
    const [resetPressCount, setResetPressCount] = useState(0)
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('fetching');
        fetch("https://yatrisubidha.wb.gov.in/").catch(()=>{
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

    // This is for creating intentional dely
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // OTP handle Function   
    const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('user_login_token');
            setIsLoading(true);
            const token = await getToken();
            setIsLoading(false);
            console.log('token', token);
                if (!token) {
                alert("Failed to generate or retrieve token.");
                return;
                }

            // const response = await axiosConfiguration.post('/user/send-login-otp', { email });
            // console.log('Response Data:', response.data); 

            // if (response?.data?.success === true) {
                setIsOtp(true);
            // }
            await delay(2000);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setIsLoading(false);
        }
    }




    const otpValidate = (event) => {
        // console.log(typeof (event));
        if (event) {
            setIsOtpBtnActive(false);
            setOtp(event)
        }
        else {
            setIsOtpBtnActive(true);
            setOtp('');
        };
    }

    const handleValidateOtp = async () => {
       
      };
      

    useFocusEffect(
        useCallback(() => {
            const checkToken = async () => {
                const token = await AsyncStorage.getItem('user_login_token');
                if (token) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'CustomTabNavigator' }],
                    });
                }
            };
            checkToken();

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
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 10 }}>

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
                                <Text style={{ fontSize: 14, color: '#4d4d4d' }}>There might be some delay in receiving the One Time Password. OTP Will be expired in 15 minutes.</Text>
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
                                    // onPress={() => navigation.navigate('LoginOTPVerification')}
                                    onPress={handleSendOTP}
                                    title={'Send OTP'}
                                    btnHeight={50}
                                    btnWidth={screenWidth * .93}
                                    bfrPrsColor={['#563bde', '#4325da']}//['#33cc33', '#248f24']
                                    aftPrsColor={['#4123d0', '#3c21c4']}// ['#29a329', '#1f7a1f']
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

const styles = StyleSheet.create({})