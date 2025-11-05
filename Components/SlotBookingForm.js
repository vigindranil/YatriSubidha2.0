import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomiseSpringButton from '../ToolComponents/CustomiseSpringButton';

export default function SlotBookingForm() {
    const initialFields = [
        { key: 'name', placeholder: 'Enter Name', label: 'Name' },
        { key: 'mobile', placeholder: 'Mobile Number', label: 'Mobile Number', prefix: '+91' },
        { key: 'email', placeholder: 'Email Address', label: 'Email Address' },
        { key: 'nationality', placeholder: 'Enter Nationality', label: 'Nationality' },
        { key: 'passport', placeholder: 'Passport Number', label: 'Passport Number' },
        { key: 'address', placeholder: 'Address', label: 'Address', multiline: true, numberOfLines: 4 },
        { key: 'travelDate', placeholder: 'Enter Intended Travel Date', label: 'Intended Travel Date' },
    ];

    const [sections, setSections] = useState([{ id: 1, fields: initialFields, date: new Date(), showDatePicker: false, textDate: 'DD/MM/YYYY' }]);
    const [nextId, setNextId] = useState(2);

    const addSection = () => {
        setSections([...sections, { id: nextId, fields: initialFields, date: new Date(), showDatePicker: false, textDate: 'DD/MM/YYYY' }]);
        setNextId(nextId + 1);
    };

    const removeSection = (id) => {
        if (sections.length > 1) {
            setSections(sections.filter(section => section.id !== id));
        }
    };
    //========================= Date Picker Section Start==================================================//
    const onChangeDate = (event, selectedDate, sectionId) => {
        const newSections = sections.map(section => {
            if (section.id === sectionId) {
                section.showDatePicker = false;
                const currentDate = selectedDate || section.date;
                section.date = currentDate;
                let tempDate = new Date(currentDate);
                section.textDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
            }
            return section;
        });
        setSections(newSections);
    };

    const showDatePicker = (sectionId) => {
        const newSections = sections.map(section => {
            if (section.id === sectionId) {
                section.showDatePicker = true;
            }
            return section;
        });
        setSections(newSections);
    };
    //========================= Date Picker Section End ==================================================//
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {sections.map((section, index) => (
                <View key={section.id} style={styles.sectionContainer}>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.label}>Name<Text style={styles.required}> *</Text></Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='Enter Name'
                                style={styles.input} />
                        </View>
                    </View>

                    <View style={{ marginTop: 15, flexDirection: 'row' }}>
                        <View style={{ width: '47%' }}>
                            <Text style={styles.label}>Mobile Number<Text style={styles.required}> *</Text></Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.prefix}>+91</Text>
                                <TextInput
                                    placeholder='Mobile Number'
                                    style={styles.input} />
                            </View>
                        </View>
                        <View style={{ width: '6%' }}></View>
                        <View style={{ width: '47%' }}>
                            <Text style={styles.label}>Email Address<Text style={styles.required}> *</Text></Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Email Address'
                                    style={styles.input} />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 15, flexDirection: 'row' }}>
                        <View style={{ width: '47%' }}>
                            <Text style={styles.label}>Nationality<Text style={styles.required}> *</Text></Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Enter Nationality'
                                    style={styles.input} />
                            </View>
                        </View>
                        <View style={{ width: '6%' }}></View>
                        <View style={{ width: '47%' }}>
                            <Text style={styles.label}>Passport Number<Text style={styles.required}> *</Text></Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Passport Number'
                                    style={styles.input} />
                            </View>
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
                            />
                        </View>
                    </View>

                    <View>
                        <Text style={styles.label}>Intended Travel Date<Text style={styles.required}> *</Text></Text>
                        <View style={{ borderWidth: .5, padding: 5, borderRadius: 4, marginTop: 8, borderColor: '#666666' }}>
                            <Pressable
                                onPress={() => showDatePicker(section.id)}
                                style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <AntDesign name="calendar" size={22} color="#737373" />
                                <TextInput value={section.textDate} style={{ marginLeft: 10 }} editable={false} />
                            </Pressable>
                        </View>
                        {section.showDatePicker && (
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={section.date}
                                mode='date'
                                is24Hour={true}
                                display='default'
                                onChange={(event, selectedDate) => onChangeDate(event, selectedDate, section.id)}
                            />
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
                    bfrPrsColor={['#1a8cff', '#0073e6']}
                    aftPrsColor={['#0080ff', '#004d99']}
                    btnTxtColor={'#fff'}
                    btnTxtSize={15}
                />
            </View>
            <View style={styles.buttonContainer}>
                <CustomiseSpringButton
                    title={'Submit'}
                    btnHeight={40}
                    btnWidth={350}
                    bfrPrsColor={['#1a8cff', '#0073e6']}
                    aftPrsColor={['#0080ff', '#004d99']}
                    btnTxtColor={'#fff'}
                    btnTxtSize={18}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
        justifyContent: 'center',
        marginTop: 15,
    }
});
