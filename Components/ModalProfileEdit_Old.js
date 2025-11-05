import { StyleSheet, Text, View, Pressable, Dimensions, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ModalProfileEdit = ({ visible, onClose }) => {
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();

    // State variables for each input field
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [nationality, setNationality] = useState('');
    const [address, setAddress] = useState('');

    const handleUpdateProfile = async () => {
        try {
            console.log(nationality);
            const response = await axiosConfiguration.post('/user/add-profile-details', { name: fullName, mobile: mobileNumber, email: email, passport: passportNumber, nationality: nationality, address: address });
            // console.log(response);
        } catch (error) {

        }
    }

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

            } catch (error) {

            }
        }

        if (visible) {
            getEmailAndProfileDetails();
        }

    }, [visible])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>

                <Pressable
                    onPress={(event) => event.stopPropagation()}
                    style={{ flex: 1, marginTop: 60, backgroundColor: '#fff' }}>


                    {/* ============= Body Section Start ============= */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ marginTop: 20, width: '90%', marginLeft: '5%', }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollViewContent}>

                            <View style={{ height: 80, backgroundColor: '#4123d0', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                                <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>Update Profile Details</Text>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={{ color: '#737373', fontSize: 16, fontWeight: '600', }}>Full Name<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                    <TextInput
                                        placeholder='Enter Name'
                                        style={{ marginLeft: '2.5%', width: '97.5%', height: 40 }}
                                        value={fullName}
                                        onChangeText={setFullName}
                                    />
                                </View>
                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <View style={{ width: '47%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373', }}>Mobile Number<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                    <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                        <TextInput
                                            placeholder='Enter Contact Number'
                                            style={{ marginLeft: '5%', width: '95%', height: 40 }}
                                            value={mobileNumber}
                                            onChangeText={setMobileNumber}
                                        />
                                    </View>
                                </View>
                                <View style={{ width: '6%' }}></View>
                                <View style={{ width: '47%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Email<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                    <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                        <TextInput
                                            placeholder='Enter Email'
                                            style={{ marginLeft: '5%', width: '95%', height: 40 }}
                                            value={email}
                                            onChangeText={setEmail}
                                            editable={false}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <View style={{ width: '47%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Gender<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                    <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, justifyContent: 'center', alignItems: 'center' }}>
                                        <Picker
                                            selectedValue={nationality}
                                            style={{ height: 40, width: '100%' }}
                                            onValueChange={(itemValue, itemIndex) => setNationality(itemValue)}
                                        >
                                            <Picker.Item label="Select Here" value="" />
                                            <Picker.Item label="Male" value="Male" />
                                            <Picker.Item label="Female" value="Female" />
                                        </Picker>
                                    </View>
                                </View>

                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <View style={{ width: '47%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Passport Number<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                    <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                        <TextInput
                                            placeholder={"Enter Passport Number"}
                                            style={{ width: '95%', height: 40, marginLeft: '5%' }}
                                            value={passportNumber}
                                            onChangeText={setPassportNumber}
                                        />
                                    </View>
                                </View>
                                <View style={{ width: '6%' }}></View>
                                <View style={{ width: '47%' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Nationality<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                    <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, justifyContent: 'center', alignItems: 'center' }}>
                                        <Picker
                                            selectedValue={nationality}
                                            style={{ height: 40, width: '100%' }}
                                            onValueChange={(itemValue, itemIndex) => setNationality(itemValue)}
                                        >
                                            <Picker.Item label="Select Here" value="" />
                                            <Picker.Item label="India" value="India" />
                                            <Picker.Item label="Bangladesh" value="Bangladesh" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Address</Text>
                                <View style={styles.textAreaContainer}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        style={styles.textArea}
                                        placeholder="Type your message here..."
                                        textAlignVertical="top" // Ensures text starts at the top
                                        value={address}
                                        onChangeText={setAddress}
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
                                <TouchableOpacity
                                    onPress={handleUpdateProfile}
                                >
                                    <LinearGradient
                                        colors={['#4123d0', '#563bde']} // You can change these colors to your desired gradient
                                        start={[0, 1]}
                                        end={[0, 0]}
                                        style={{
                                            backgroundColor: '#ffdb4d', height: 37, width: 130, borderRadius: 20,
                                            alignItems: 'center', marginTop: 10, elevation: 4, alignItems: 'center', justifyContent: 'center'
                                        }}>
                                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Update</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onClose}
                                >

                                    <LinearGradient
                                        colors={['#990000', '#e60000']} // You can change these colors to your desired gradient
                                        start={[0, 1]}
                                        end={[0, 0]}
                                        style={{
                                            marginLeft: 15,
                                            backgroundColor: '#ffdb4d', height: 37, width: 130, borderRadius: 20,
                                            alignItems: 'center', marginTop: 10, elevation: 4, alignItems: 'center', justifyContent: 'center'
                                        }}>
                                        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Close</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginBottom: 20 }}></View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Pressable>
            </TouchableOpacity>
        </Modal>
    );
};

export default ModalProfileEdit;

const styles = StyleSheet.create({
    scrollViewContent: {
        paddingBottom: 20,
    },
    inputContainer: {
        marginTop: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#737373',
    },
    textAreaContainer: {
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 4,
        marginTop: 8,
        flexDirection: 'row',
        padding: 5,
    },
    textArea: {
        height: 80,
        justifyContent: "flex-start",
        width: '100%',
    },
});
