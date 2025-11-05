import { SafeAreaView, StyleSheet, Text, View, Pressable, Image, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import SvgComponent from '../ToolComponents/SvgComponent';
import CustomiseSpringButton from '../ToolComponents/CustomiseSpringButton';


const LoginOTPVerification = ({ navigation }) => {
    const screenWidth = Dimensions.get('window').width;
    const [isMobile, setIsMobile] = useState(true);
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 35 }}>
                <Text style={{
                    fontSize: 30, fontWeight: '700',
                    color: '#4d4d4d', textAlign: 'center'
                }}>Verify OTP</Text>
                <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 15, fontWeight: '600', color: '#0077b3' }}>
                    An One Time Password has been sent to your Email</Text>


                <View style={{ marginTop: 30 }}>
                    <Text style={{ fontSize: 15, color: '#737373', marginLeft: 15 }}>Enter One Time Password</Text>
                    <View style={{ height: 40, width: 360, borderWidth: .5, marginHorizontal: 15, borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                        <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                            <Entypo name="lock" size={24} color="#737373" />
                        </View>
                        <TextInput
                            style={{ width: 280, height: 40 }}
                            placeholder='One Time Password'
                        />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity style={{ padding: 5 }}>
                        <Text style={{ color: '#ff0000', textAlign: 'center', fontWeight: '600', fontSize: 15 }}>Resend One Time Password</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, color: '#4d4d4d' }}>There might be some delay in receiving the One Time Password. OTP Will be expired in 15 minutes.</Text>
                </View>

                <View style={{ marginTop: 25 }}>
                    <CustomiseSpringButton title={'Validate'}
                        btnHeight={50}
                        btnWidth={200}
                        bfrPrsColor={['#1a8cff', '#0073e6']}
                        aftPrsColor={['#0080ff', '#004d99']}
                        btnTxtColor={'#fff'}
                        btnTxtSize={20}
                    />
                </View>

            </View>
        </View>
    )
}

export default LoginOTPVerification

const styles = StyleSheet.create({})