import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import CustomiseSpringButton from './CustomiseSpringButton';
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';


export default function DynamicFormTemplate({ email, slotId, bookingDate }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [finalResponse, setFinalResponse] = useState();
    const [errors, setErrors] = useState({});

    const initialFields = [
        { key: 'name', placeholder: 'Enter Name', label: 'Name', value: '' },
        { key: 'mobile', placeholder: 'Mobile Number', label: 'Mobile Number', prefix: '+91', value: '' },
        { key: 'email', placeholder: 'Email Address', label: 'Email Address', value: '' },
        { key: 'nationality', placeholder: 'Enter Nationality', label: 'Nationality', value: '' },
        { key: 'passportNumber', placeholder: 'Passport Number', label: 'Passport Number', value: '' },
        { key: 'address', placeholder: 'Address', label: 'Address', multiline: true, numberOfLines: 4, value: '' },
    ];

    const [sections, setSections] = useState([{ id: 1, fields: initialFields }]);
    const [nextId, setNextId] = useState(2);

    const addSection = () => {
        setSections([...sections, { id: nextId, fields: initialFields }]);
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

        // Update errors state
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };

            if (fieldKey === 'email') {
                if (!text) {
                    newErrors[sectionId] = { ...newErrors[sectionId], email: 'Email Address is required' };
                } else if (!/\S+@\S+\.\S+/.test(text)) {
                    newErrors[sectionId] = { ...newErrors[sectionId], email: 'Invalid email address' };
                } else {
                    if (newErrors[sectionId]) {
                        delete newErrors[sectionId].email;
                        if (Object.keys(newErrors[sectionId]).length === 0) {
                            delete newErrors[sectionId];
                        }
                    }
                }
            } else if (fieldKey === 'mobile') {
                if (!text) {
                    newErrors[sectionId] = { ...newErrors[sectionId], mobile: 'Mobile number is required' };
                } else if (!/^\d{10}$/.test(text)) {
                    newErrors[sectionId] = { ...newErrors[sectionId], mobile: 'Mobile number must be 10 digits' };
                } else {
                    if (newErrors[sectionId]) {
                        delete newErrors[sectionId].mobile;
                        if (Object.keys(newErrors[sectionId]).length === 0) {
                            delete newErrors[sectionId];
                        }
                    }
                }
            } else {
                if (newErrors[sectionId] && newErrors[sectionId][fieldKey]) {
                    delete newErrors[sectionId][fieldKey];
                    if (Object.keys(newErrors[sectionId]).length === 0) {
                        delete newErrors[sectionId];
                    }
                }
            }

            return newErrors;
        });
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





    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            const slots_id = slotId;
            const users_email = email;
            const slotBookingDate = bookingDate;
            const isActive = 1;

            const fieldsArray = sections.map(item => item.fields);
            const valuesObject = fieldsArray.map(fieldsArray => {
                const objectWithValues = fieldsArray.reduce((acc, field) => {
                    acc[field.key] = field.value;
                    return acc;
                }, {});

                // Adding slot_id and user_email to each object
                objectWithValues.slots_id = slots_id;
                objectWithValues.users_email = users_email;
                objectWithValues.slotBookingDate = slotBookingDate;
                objectWithValues.isActive = isActive;
                return objectWithValues;
            });

            console.log(valuesObject);
            const response = await axiosConfiguration.post('/slot/book', { bookingDetails: valuesObject });
            setFinalResponse(response.data);
            console.log('Response Data:', response.data);

            // Reset the form fields to initial state after successful submission
            setSections([{ id: 1, fields: initialFields }]);
            setNextId(2);
            setErrors({});
        } catch (error) {
            console.error('Error in fetching data:', error);
        } finally {
            setIsLoading(false);
            setModalVisible(true);
        }
    };



    return (
        <>
            {isLoading ? (
                <ActivityIndicator size="large" color="#4123d0" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.container}>
                    {sections.map((section, index) => (
                        <View key={section.id} style={styles.sectionContainer}>
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
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            placeholder='Enter Nationality'
                                            style={styles.input}
                                            value={section.fields.find(field => field.key === 'nationality').value}
                                            onChangeText={(text) => handleInputChange(text, section.id, 'nationality')}
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
                                        textAlignVertical='top' // Ensures text starts at the top
                                        value={section.fields.find(field => field.key === 'address').value}
                                        onChangeText={(text) => handleInputChange(text, section.id, 'address')}
                                    />
                                </View>
                                {errors[section.id] && errors[section.id].address && (
                                    <Text style={styles.error}>{errors[section.id].address}</Text>
                                )}
                            </View>

                            {
                                section.id !== 1 && (
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
                                )
                            }
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
                    <Modal isVisible={isModalVisible}>
                        <View style={{ height: '40%', borderRadius: 10, backgroundColor: '#fff', justifyContent: 'space-between' }}>
                            <View style={{ marginTop: 10 }}>
                                {finalResponse?.success ?
                                    (<>
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
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#666666' }}>{finalResponse?.message}</Text>
                                        </View>
                                    </>) : (
                                        <>
                                            <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 10, textAlign: 'center' }}>Booking Failed !</Text>
                                            <View style={{ alignItems: 'center' }}>
                                                <LottieView
                                                    source={require('../Lottie/failed.json')}
                                                    autoPlay
                                                    // loop={false}
                                                    style={{ height: 120, width: 120 }}
                                                />
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#666666' }}>{finalResponse?.message}</Text>
                                            </View>
                                        </>
                                    )}
                            </View>
                            <View style={{ alignItems: 'center', marginBottom: 35 }}>
                                <TouchableOpacity style={{
                                    padding: 5, backgroundColor: '#b32d00', width: 80,
                                    alignItems: 'center', justifyContent: 'center', borderRadius: 6,
                                }} onPress={() => setModalVisible(false)}>
                                    <Text style={{ color: '#fff', fontWeight: '700' }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
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
        marginBottom: 30,
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
    },
    input: {
        flex: 1,
        marginLeft: '5%',
        height: 40,
    },
    textAreaContainer: {
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 4,
        marginTop: 8,
        padding: 5,
        height: 80,
    },
    textArea: {
        flex: 1,
    },
    prefix: {
        textAlign: 'center',
        width: '25%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        height: 37,
        width: 130,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    submitContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
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
});
