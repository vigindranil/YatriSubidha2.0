import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, StatusBar } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import ColorEffectButton from '../ToolComponents/ColorEffectButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
const LoginScreenIntro = ({ navigation }) => {
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;

    useFocusEffect(
        useCallback(() => {
            const checkLogin = async () => {
                const token = await AsyncStorage.getItem('user_login_token');
                const userData = await AsyncStorage.getItem('user_data');
                
                if (token && userData) {
                    console.log("✅ Auto login success");
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'CustomTabNavigator' }],
                    });
                }
            };
            checkLogin();
        }, [])
    );
    return (
        <LinearGradient colors={["#ccdcff", "#ccdcff", "#ccdcff"]} style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 40, height: 40, width: 40, marginLeft: 15 }}>
                <AntDesign name="arrowleft" size={30} color="#4d4d4d" />
            </TouchableOpacity>
            <View style={{ marginTop: 10 }}>
                <View style={{ alignItems: "center" }}>
                    <Text
                        style={{
                            fontWeight: "700",
                            fontSize: 25,
                            color: '#4f4f4f',
                            marginTop: 60
                        }}
                    >
                        Make your travel easy
                    </Text>
                    <View style={{ marginTop: 50, marginBottom: 25 }}>
                        <ColorEffectButton
                            onPress={() => navigation.navigate('LoginScreen')}
                            btnHeight={60}
                            btnWidth={350}
                            btnTittle={'Login Now !'}
                        />
                    </View>
                    <View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: '3%',
                            width: '94%',
                            alignItems: 'center',
                            marginTop: 60
                        }}>
                            <View style={{ width: "15%", alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require("../Images/DigiLockerImage/slotBook.png")}
                                    style={{
                                        height: 50,
                                        width: 50,
                                    }}
                                />
                            </View>
                            <View style={{ width: '81%', marginLeft: '4%' }}>
                                <Text style={{
                                    fontWeight: "600",
                                    color: '#666666',
                                    fontSize: 16,

                                }}>
                                    Book a slot for faster clearance
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: '3%',
                            width: '94%',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                            <View style={{ width: "15%", alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require("../Images/DigiLockerImage/simIcon.png")}
                                    style={{
                                        height: 50,
                                        width: 50,
                                    }}
                                />
                            </View>
                            <View style={{ width: '81%', marginLeft: '4%' }}>
                                <Text style={{
                                    fontWeight: "600",
                                    color: '#666666',
                                    fontSize: 16,

                                }}>
                                    Mobile Sim purchase support
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: '3%',
                            width: '94%',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                            <View style={{ width: "15%", alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require("../Images/DigiLockerImage/currencyExchange.png")}
                                    style={{
                                        height: 50,
                                        width: 50,
                                    }}
                                />
                            </View>
                            <View style={{ width: '81%', marginLeft: '4%' }}>
                                <Text style={{
                                    fontWeight: "600",
                                    color: '#666666',
                                    fontSize: 16,

                                }}>
                                    Online Currency Exchange support
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: '3%',
                            width: '94%',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                            <View style={{ width: "15%", alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require("../Images/DigiLockerImage/cabBooking-second.png")}
                                    style={{
                                        height: 55,
                                        width: 50,
                                        resizeMode: 'contain'
                                    }}
                                />
                            </View>
                            <View style={{ width: '81%', marginLeft: '4%' }}>
                                <Text style={{
                                    fontWeight: "600",
                                    color: '#666666',
                                    fontSize: 16,

                                }}>
                                    Cab booking at pre-defined government rates
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: '3%',
                            width: '94%',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                            <View style={{ width: "15%", alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require("../Images/DigiLockerImage/medicalIcon.png")}
                                    style={{
                                        height: 50,
                                        width: 50,
                                    }}
                                />
                            </View>
                            <View style={{ width: '81%', marginLeft: '4%' }}>
                                <Text style={{
                                    fontWeight: "600",
                                    color: '#666666',
                                    fontSize: 16,

                                }}>
                                    Medical Transit support
                                </Text>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginLeft: '3%',
                            width: '94%',
                            alignItems: 'center',
                            marginTop: 15
                        }}>
                            <View style={{ width: "15%", alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    source={require("../Images/DigiLockerImage/waiting.png")}
                                    style={{
                                        height: 50,
                                        width: 50,
                                    }}
                                />
                            </View>
                            <View style={{ width: '81%', marginLeft: '4%' }}>
                                <Text style={{
                                    fontWeight: "600",
                                    color: '#666666',
                                    fontSize: 16,

                                }}>
                                    Accessing Priority Waiting Area/Lounges with free high-speed internet
                                </Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
        </LinearGradient>
    )
}

export default LoginScreenIntro

const styles = StyleSheet.create({})