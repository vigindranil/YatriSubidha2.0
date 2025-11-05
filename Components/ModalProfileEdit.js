import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Dimensions,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { setUserInfo } from '../Redux/setUserInfo';
import { useDispatch } from 'react-redux';

const RadioInput = ({ options, selectedValue, onValueChange }) => {
    return (
        <View style={styles.radioContainer}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        styles.radioButton,
                        selectedValue === option.value && styles.selectedRadio,
                    ]}
                    onPress={() => onValueChange(option.value)}
                >
                    <View
                        style={[
                            styles.radioInner,
                            selectedValue === option.value && styles.selectedInner,
                        ]}
                    >
                        {selectedValue === option.value && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const ModalProfileEdit = ({ visible, onClose }) => {
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // State variables for each input field
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [nationality, setNationality] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);

    const handleSuccessMessage = () => {
        setSuccessMessage(true);
        setTimeout(() => {
            setSuccessMessage(false);
            // console.log('Success message displayed after 2 seconds');
            onClose();
        }, 2300);
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await axiosConfiguration.post(
                '/user/add-profile-details',
                {
                    name: fullName,
                    mobile: mobileNumber,
                    email: email,
                    passport: passportNumber,
                    nationality: nationality,
                    address: address,
                    gender: gender, // Include gender in the request
                }
            );
            // Handle the response if needed
            if (response.data.success) {
                handleSuccessMessage();
                await setUserInfo(dispatch);
            }

        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    useEffect(() => {
        const getEmailAndProfileDetails = async () => {
            try {
                const getEmail = await AsyncStorage.getItem('user_login_email');
                setEmail(getEmail);
                const response = await axiosConfiguration.post(
                    '/user/get-profile-details',
                    { email: getEmail }
                ); // Replace with your API endpoint
                const data = response.data.response;
                setFullName(data.name);
                setMobileNumber(data.mobile);
                setPassportNumber(data.passport);
                setNationality(data.nationality);
                setAddress(data.address);
                setGender(data.gender || ''); // Set the gender if available
            } catch (error) {
                console.error('Error fetching profile details:', error);
            }
        };

        if (visible) {
            getEmailAndProfileDetails();
        }
    }, [visible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            {successMessage ? (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{
                        backgroundColor: '#fff', height: 250,
                        marginHorizontal: 10, borderRadius: 10
                    }}>
                        <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 10, textAlign: 'center' }}>Success !</Text>
                        <View style={{ alignItems: 'center' }}>
                            <LottieView
                                source={
                                    require('../Lottie/sucess.json')
                                }
                                autoPlay
                                // loop={false}
                                style={{ height: 120, width: 120 }}
                            />
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#666666' }}>Profile Details Updated</Text>
                        </View>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onClose}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <Pressable
                        onPress={(event) => event.stopPropagation()}
                        style={{ flex: 1, marginTop: 60, backgroundColor: '#fff' }}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ marginTop: 20, paddingBottom: 30, width: '90%', marginLeft: '5%' }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollViewContent}
                            >
                                <View
                                    style={{
                                        height: 80,
                                        borderRadius: 8,
                                        backgroundColor: '#4123d0',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 20,
                                    }}
                                >
                                    <Text
                                        style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}
                                    >
                                        Update Profile Details
                                    </Text>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text
                                        style={{ color: '#737373', fontSize: 16, fontWeight: '600' }}
                                    >
                                        Full Name
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 17,
                                            }}
                                        >
                                            {' '}
                                            *
                                        </Text>
                                    </Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder="Enter Name"
                                            style={styles.textInput}
                                            value={fullName}
                                            onChangeText={setFullName}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                    <View style={{ width: '47%' }}>
                                        <Text
                                            style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}
                                        >
                                            Mobile Number
                                            <Text
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    fontSize: 17,
                                                }}
                                            >
                                                {' '}
                                                *
                                            </Text>
                                        </Text>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                placeholder="Mobile Number"
                                                keyboardType='numeric'
                                                style={styles.textInput}
                                                value={mobileNumber}
                                                onChangeText={setMobileNumber}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '6%' }}></View>
                                    <View style={{ width: '47%' }}>
                                        <Text
                                            style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}
                                        >
                                            Email
                                            <Text
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    fontSize: 17,
                                                }}
                                            >
                                                {' '}
                                                *
                                            </Text>
                                        </Text>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                placeholder="Email ID"
                                                style={styles.textInput}
                                                value={email}
                                                onChangeText={setEmail}
                                                numberOfLines={1}
                                                ellipsizeMode='tail'
                                                editable={false}
                                            />
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.label}>
                                        Gender
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 17,
                                            }}
                                        >
                                            {' '}
                                            *
                                        </Text>
                                    </Text>
                                    <RadioInput
                                        options={[
                                            { label: 'Male', value: 'Male' },
                                            { label: 'Female', value: 'Female' },
                                            { label: 'Other', value: 'Other' },
                                        ]}
                                        selectedValue={gender}
                                        onValueChange={setGender}
                                    />
                                </View>

                                <View
                                    style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <View style={{ width: '47%' }}>
                                        <Text style={styles.label}>
                                            Passport Number
                                            <Text
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    fontSize: 17,
                                                }}
                                            >
                                                {' '}
                                                *
                                            </Text>
                                        </Text>
                                        <View style={styles.inputContainer}>
                                            <TextInput
                                                placeholder="Passport Number"
                                                style={styles.textInput}
                                                value={passportNumber}
                                                onChangeText={setPassportNumber}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ width: '6%' }}></View>
                                    <View style={{ width: '47%' }}>
                                        <Text style={styles.label}>
                                            Nationality
                                            <Text
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                    fontSize: 16,
                                                }}
                                            >
                                                {' '}
                                                *
                                            </Text>
                                        </Text>
                                        <View style={{
                                            backgroundColor: '#F1F1F1',
                                            borderRadius: 8,
                                            marginTop: 10,
                                            justifyContent: 'center'
                                        }}>
                                            <Picker
                                                selectedValue={nationality}
                                                onValueChange={(itemValue) =>
                                                    setNationality(itemValue)
                                                }
                                                style={[styles.picker, { height: 48 }]}
                                            >
                                                <Picker.Item label="Select Nationality" value="" />
                                                <Picker.Item label="India" value="India" />
                                                <Picker.Item label="Bangladesh" value="Bangladesh" />
                                                <Picker.Item label="United States" value="United States" />
                                                <Picker.Item label="Canada" value="Canada" />
                                                <Picker.Item label="United Kingdom" value="United Kingdom" />
                                                {/* Add more countries as needed */}
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.label}>
                                        Address
                                        <Text
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                                fontSize: 17,
                                            }}
                                        >
                                            {' '}
                                            *
                                        </Text>
                                    </Text>
                                    <View style={{
                                        backgroundColor: '#F1F1F1',
                                        paddingVertical: 10,
                                        paddingHorizontal: 15,
                                        borderRadius: 8,
                                        marginTop: 10,
                                    }}>
                                        <TextInput
                                            placeholder="Enter Address"
                                            style={{
                                                color: '#737373',
                                                fontSize: 16,
                                                textAlignVertical: 'top',
                                            }}
                                            value={address}
                                            onChangeText={setAddress}
                                            multiline={true}
                                            numberOfLines={5}
                                        />
                                    </View>
                                </View>

                                <View style={{ marginTop: 30 }}>
                                    <TouchableOpacity
                                        onPress={handleUpdateProfile}
                                        style={{
                                            marginLeft: '1%',
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        <LinearGradient
                                            colors={['#6516f3', '#4123d0']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingVertical: 15,
                                                paddingHorizontal: 20,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    color: '#ffffff',
                                                }}
                                            >
                                                Update
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        style={{
                                            marginLeft: '1%',
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        <LinearGradient
                                            colors={['#ff0000', '#b30000']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingVertical: 15,
                                                paddingHorizontal: 20,
                                                borderRadius: 8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    color: '#ffffff',
                                                }}
                                            >
                                                Cancel
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </Pressable>
                </TouchableOpacity>
            )}
        </Modal>
    );
};

export default ModalProfileEdit;

const styles = StyleSheet.create({
    label: {
        color: '#737373',
        fontSize: 16,
        fontWeight: '600',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#737373',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedInner: {
        borderColor: '#4123d0',
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4123d0',
    },
    radioLabel: {
        marginLeft: 5,
        color: '#737373',
        fontWeight: '600',
    },
    inputContainer: {
        backgroundColor: '#F1F1F1',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    textInput: {
        color: '#737373',
        fontSize: 16,
    },
    picker: {
        color: '#737373',
    },
    scrollViewContent: {
        paddingBottom: 100,
    },
});
