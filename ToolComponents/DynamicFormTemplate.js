import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator,
    TouchableOpacity, Modal, Pressable // Added Modal and Pressable for the dialog
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomiseSpringButton from './CustomiseSpringButton';
import RNPickerSelect from 'react-native-picker-select';

// =================================================================
//  1. COPIED CUSTOM DIALOG COMPONENT FROM LOGIN SCREEN
// =================================================================
const CustomAlertDialog = ({ visible, title, message, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.dialogContainer}>
                    <Text style={styles.dialogTitle}>{title}</Text>
                    <Text style={styles.dialogMessage}>{message}</Text>
                    <TouchableOpacity style={styles.dialogButton} onPress={onClose}>
                        <Text style={styles.dialogButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Modal>
    );
};
// =================================================================


export default function DynamicFormTemplate({ slotId, bookingDate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [loggedInUserEmail, setLoggedInUserEmail] = useState('');

    // =================================================================
    //  2. REPLACED OLD MODAL STATES WITH NEW DIALOG STATES
    // =================================================================
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    // =================================================================

    const getInitialFields = () => [
        { key: 'name', placeholder: 'Enter Name', label: 'Name', value: '' },
        { key: 'mobile', placeholder: 'Mobile Number', label: 'Mobile Number', prefix: '+91', value: '' },
        { key: 'email', placeholder: 'Email Address', label: 'Email Address', value: '' },
        { key: 'nationality', placeholder: 'Select Nationality', label: 'Nationality', value: '' },
        { key: 'passportNumber', placeholder: 'Passport Number', label: 'Passport Number', value: '' },
        { key: 'address', placeholder: 'Address', label: 'Address', multiline: true, numberOfLines: 4, value: '' },
    ];

    const [sections, setSections] = useState([{ id: 1, fields: getInitialFields() }]);
    const [nextId, setNextId] = useState(2);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('user_data');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    const userEmail = userData.username;

                    if (userEmail) {
                        setLoggedInUserEmail(userEmail);
                        setSections(currentSections => {
                            const newSections = [...currentSections];
                            if (newSections.length > 0) {
                                newSections[0] = {
                                    ...newSections[0],
                                    fields: newSections[0].fields.map(field => {
                                        if (field.key === 'email') {
                                            return { ...field, value: userEmail };
                                        }
                                        return field;
                                    })
                                };
                            }
                            return newSections;
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load user data into form:", error);
            }
        };

        loadUserData();
    }, []);

    const nationalityOptions = [
        { label: 'Indian', value: 'Indian' },
        { label: 'Bangladeshi', value: 'Bangladeshi' },
        { label: 'Nepali', value: 'Nepali' },
        { label: 'Sri Lankan', value: 'Sri Lankan' },
        { label: 'Pakistani', value: 'Pakistani' },
        { label: 'Bhutani', value: 'Bhutani' },
        { label: 'Afghan', value: 'Afghan' },
        { label: 'Burmese', value: 'Burmese' },
        { label: 'Chinese', value: 'Chinese' },
    ];

    const addSection = () => {
        const newFields = getInitialFields();
        const emailField = newFields.find(field => field.key === 'email');
        if (emailField && loggedInUserEmail) {
            emailField.value = loggedInUserEmail;
        }
        setSections([...sections, { id: nextId, fields: newFields }]);
        setNextId(nextId + 1);
    };

    const removeSection = (id) => {
        if (sections.length > 1) {
            setSections(sections.filter(section => section.id !== id));
            setErrors(prevErrors => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[id];
                return updatedErrors;
            });
        }
    };

    const handleInputChange = (text, sectionId, fieldKey) => {
        setSections(sections.map(section => {
            if (section.id === sectionId) {
                return {
                    ...section,
                    fields: section.fields.map(field => {
                        if (field.key === fieldKey) {
                            return { ...field, value: text };
                        }
                        return field;
                    })
                };
            }
            return section;
        }));

        const newErrors = { ...errors };
        if (!newErrors[sectionId]) newErrors[sectionId] = {};

        if (fieldKey === 'name') {
            if (!text) newErrors[sectionId].name = 'Name is required'; else delete newErrors[sectionId].name;
        } else if (fieldKey === 'email') {
            if (!text) newErrors[sectionId].email = 'Email Address is required';
            else if (!/\S+@\S+\.\S+/.test(text)) newErrors[sectionId].email = 'Invalid email address';
            else delete newErrors[sectionId].email;
        } else if (fieldKey === 'mobile') {
            if (!text) newErrors[sectionId].mobile = 'Mobile number is required';
            else if (!/^\d{10}$/.test(text)) newErrors[sectionId].mobile = 'Mobile number must be 10 digits';
            else delete newErrors[sectionId].mobile;
        } else {
            if (!text && ['nationality', 'passportNumber', 'address'].includes(fieldKey)) {
                newErrors[sectionId][fieldKey] = `${fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)} is required`;
            } else if (newErrors[sectionId][fieldKey]) {
                delete newErrors[sectionId][fieldKey];
            }
        }

        if (Object.keys(newErrors[sectionId]).length === 0) {
            delete newErrors[sectionId];
        }
        setErrors(newErrors);
    };

    const validate = () => {
        const newErrors = {};
        sections.forEach(section => {
            const sectionErrors = {};
            section.fields.forEach(field => {
                if (!field.value) {
                    sectionErrors[field.key] = `${field.label} is required`;
                } else if (field.key === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
                    sectionErrors[field.key] = 'Invalid email address';
                } else if (field.key === 'mobile' && !/^\d{10}$/.test(field.value)) {
                    sectionErrors[field.key] = 'Mobile number must be 10 digits';
                }
            });
            if (Object.keys(sectionErrors).length > 0) {
                newErrors[section.id] = sectionErrors;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // =================================================================
    //  3. MODIFIED handleSubmit TO USE THE NEW DIALOG
    // =================================================================
    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }
        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem("user_login_token");
            if (!token) {
                setDialogTitle("Authentication Error");
                setDialogMessage("Token not found. Please log in again.");
                setIsDialogVisible(true);
                setIsLoading(false);
                return;
            }

            const passengerInformation = sections.map(section => {
                const passenger = {};
                section.fields.forEach(field => {
                    if (field.key === 'name') passenger.FullName = field.value;
                    if (field.key === 'address') passenger.Address = field.value;
                    if (field.key === 'nationality') passenger.Nationality = field.value;
                    if (field.key === 'mobile') passenger.MobileNo = field.value;
                    if (field.key === 'email') passenger.EmailID = field.value;
                    if (field.key === 'passportNumber') passenger.PassportNo = field.value;
                });
                passenger.DOB = "1995-06-15";
                passenger.Gender = "M";
                passenger.PassportValidUpto = "2028-01-12";
                passenger.VisaNo = "N/A";
                passenger.VisaValidUpto = "2028-07-29";
                return passenger;
            });

            const formdata = new FormData();
            formdata.append("PassengerInformation", JSON.stringify(passengerInformation));
            formdata.append("PrefferedSlotID", slotId);
            formdata.append("JourneyDate", bookingDate);
            formdata.append("AuthInfo", JSON.stringify({ SessionID: "123", IPaddress: "192.168.1.1", MACAddress: "123456", OSversion: "MAC" }));
            formdata.append("Type", "2");

            const myHeaders = new Headers();
            myHeaders.append("Authorization", token);

            const requestOptions = { method: "POST", headers: myHeaders, body: formdata, redirect: "follow" };

            const response = await fetch("https://yatrisubidha.wb.gov.in/service/savePassengerSlotBooking", requestOptions);
            const resultText = await response.text();

            let resultJson;
            try {
                resultJson = JSON.parse(resultText);
            } catch (e) {
                throw new Error("Server returned an invalid response.");
            }

            if (resultJson.status === 0) {
                setDialogTitle("Success!");
                setDialogMessage(resultJson.message || "Booking saved successfully!");
                setIsDialogVisible(true);
                setSections([{ id: 1, fields: getInitialFields() }]);
                setNextId(2);
                setErrors({});
            } else if (resultText.includes("INVALID_TOKEN") || resultText.includes("expire")) {
                setDialogTitle("Session Expired");
                setDialogMessage("Your session has expired. Please log in again.");
                setIsDialogVisible(true);
            } else {
                setDialogTitle("Booking Failed");
                setDialogMessage(resultJson.message || "Failed to save booking. Please try again.");
                setIsDialogVisible(true);
            }

        } catch (error) {
            console.error('Error in saving booking:', error);
            setDialogTitle("Error");
            setDialogMessage("An unexpected error occurred. Please check your connection and try again.");
            setIsDialogVisible(true);
        } finally {
            setIsLoading(false);
        }
    };
    // =================================================================

    return (
        <>
            <CustomAlertDialog
                visible={isDialogVisible}
                title={dialogTitle}
                message={dialogMessage}
                onClose={() => setIsDialogVisible(false)}
            />

            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#4123d0" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    {sections.map((section) => (
                        <View key={section.id} style={styles.sectionContainer}>
                            {/* All TextInput and other form elements are here */}
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.label}>Name<Text style={styles.required}> *</Text></Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder='Enter Name'
                                        style={styles.input}
                                        value={section.fields.find(field => field.key === 'name').value}
                                        onChangeText={(text) => handleInputChange(text, section.id, 'name')}
                                    />
                                </View>
                                {errors[section.id] && errors[section.id].name && (
                                    <Text style={styles.error}>{errors[section.id].name}</Text>
                                )}
                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <View style={{ width: '47%' }}>
                                    <Text style={styles.label}>Mobile Number<Text style={styles.required}> *</Text></Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.prefix}>+91</Text>
                                        <TextInput
                                            placeholder='Mobile Number'
                                            style={styles.input}
                                            value={section.fields.find(field => field.key === 'mobile').value}
                                            onChangeText={(text) => handleInputChange(text, section.id, 'mobile')}
                                            keyboardType="numeric"
                                            maxLength={10}
                                        />
                                    </View>
                                    {errors[section.id] && errors[section.id].mobile && (
                                        <Text style={styles.error}>{errors[section.id].mobile}</Text>
                                    )}
                                </View>
                                <View style={{ width: '6%' }}></View>
                                <View style={{ width: '47%' }}>
                                    <Text style={styles.label}>Email Address<Text style={styles.required}> *</Text></Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder='Email Address'
                                            style={styles.input}
                                            value={section.fields.find(field => field.key === 'email').value}
                                            onChangeText={(text) => handleInputChange(text, section.id, 'email')}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    {errors[section.id] && errors[section.id].email && (
                                        <Text style={styles.error}>{errors[section.id].email}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={{ marginTop: 15, flexDirection: 'row' }}>
                                <View style={{ width: '47%' }}>
                                    <Text style={styles.label}>Nationality<Text style={styles.required}> *</Text></Text>
                                    <View style={styles.pickerContainer}>
                                        <RNPickerSelect
                                            onValueChange={(value) => handleInputChange(value, section.id, 'nationality')}
                                            items={nationalityOptions}
                                            style={pickerSelectStyles}
                                            value={section.fields.find(f => f.key === 'nationality').value}
                                            placeholder={{ label: 'Select Nationality', value: '' }}
                                            useNativeAndroidPickerStyle={false}
                                        />
                                    </View>
                                    {errors[section.id] && errors[section.id].nationality && (
                                        <Text style={styles.error}>{errors[section.id].nationality}</Text>
                                    )}
                                </View>
                                <View style={{ width: '6%' }}></View>
                                <View style={{ width: '47%' }}>
                                    <Text style={styles.label}>Passport Number<Text style={styles.required}> *</Text></Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder='Passport Number'
                                            style={styles.input}
                                            value={section.fields.find(field => field.key === 'passportNumber').value}
                                            onChangeText={(text) => handleInputChange(text, section.id, 'passportNumber')}
                                        />
                                    </View>
                                    {errors[section.id] && errors[section.id].passportNumber && (
                                        <Text style={styles.error}>{errors[section.id].passportNumber}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Address<Text style={styles.required}> *</Text></Text>
                                <View style={styles.textAreaContainer}>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={4}
                                        style={styles.textArea}
                                        placeholder='Address'
                                        textAlignVertical='top'
                                        value={section.fields.find(field => field.key === 'address').value}
                                        onChangeText={(text) => handleInputChange(text, section.id, 'address')}
                                    />
                                </View>
                                {errors[section.id] && errors[section.id].address && (
                                    <Text style={styles.error}>{errors[section.id].address}</Text>
                                )}
                            </View>

                            {section.id !== 1 && (
                                <View style={styles.removeButtonContainer}>
                                    <CustomiseSpringButton
                                        onPress={() => removeSection(section.id)}
                                        title={'Remove'}
                                        btnHeight={35}
                                        btnWidth={100}
                                        bfrPrsColor={['#ff0000', '#e60000']}
                                        aftPrsColor={['#e60000', '#990000']}
                                        btnTxtColor={'#fff'}
                                        btnTxtSize={15}
                                    />
                                </View>
                            )}
                        </View>
                    ))}
                    <View style={styles.buttonContainer}>
                        <CustomiseSpringButton
                            onPress={addSection}
                            title={'Add One'}
                            btnHeight={35}
                            btnWidth={100}
                            bfrPrsColor={['#563bde', '#4325da']}
                            aftPrsColor={['#4123d0', '#3c21c4']}
                            btnTxtColor={'#fff'}
                            btnTxtSize={15}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomiseSpringButton
                            onPress={handleSubmit}
                            title={'Submit'}
                            btnHeight={40}
                            btnWidth={350}
                            bfrPrsColor={['#563bde', '#4325da']}
                            aftPrsColor={['#4123d0', '#3c21c4']}
                            btnTxtColor={'#fff'}
                            btnTxtSize={18}
                        />
                    </View>

                    {/* The old Lottie modal has been removed */}
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    sectionContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 20,
    },
    inputWrapper: {
        marginTop: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#737373',
    },
    required: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 17,
    },
    inputContainer: {
        height: 40,
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 4,
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    pickerContainer: {
        height: 40,
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 4,
        marginTop: 8,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        height: 40,
    },
    textAreaContainer: {
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 4,
        marginTop: 8,
        padding: 5,
        height: 80,
        backgroundColor: '#fff',
    },
    textArea: {
        flex: 1,
    },
    prefix: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    removeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },

    // =================================================================
    //  4. ADDED DIALOG STYLES AND REMOVED OLD MODAL STYLES
    // =================================================================
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialogContainer: {
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
    dialogTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    dialogMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    dialogButton: {
        backgroundColor: '#4123d0',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    dialogButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // =================================================================
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: 'black',
        height: 40,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: 'black',
        height: 40,
    },
    placeholder: {
        color: '#999',
    },
});