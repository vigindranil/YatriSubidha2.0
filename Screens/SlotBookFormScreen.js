import { SafeAreaView, StatusBar, StyleSheet, Text, View, Pressable, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DynamicFormTemplate from '../ToolComponents/DynamicFormTemplate';

const SlotBookFormScreen = ({ navigation, route }) => {
    const { slotId, slot, bookingDate, slotTime ,journeyType} = route.params;
    const [email, setEmail] = useState(null);


    useEffect(() => {
        const getStorageData = async () => {
            try {
                const getEmail = await AsyncStorage.getItem('user_login_email');
                // console.log(getEmail);
                setEmail(getEmail);
            } catch (error) {
                console.error('Failed to retrieve token:', error);
            }
        };
        getStorageData();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', marginBottom: 5, paddingBottom: 50 }}>
                <View style={{ alignItems: 'center', paddingBottom: 8, marginTop: 5 }}>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: '#0066cc', marginTop: 5 }}>{slot}</Text>
                    <Text style={{ color: '#737373', fontWeight: '600' }}>[ {bookingDate} , {slotTime} ]</Text>
                                        <Text style={{ color: '#737373', fontWeight: '600' }}>[ {journeyType}]</Text>
                </View>
                <View style={{ marginBottom: 5 }}>
                    {/* <DynamicFormTemplateTwo /> */}
                    {/* <DynamicFormTemplateThree /> */}
                    {/* <DynamicFormTemplateFour /> */}
                    <DynamicFormTemplate email={email} slotId={slotId} bookingDate={bookingDate} />
                </View>
            </View>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        </View>
    );
};

export default SlotBookFormScreen;

const styles = StyleSheet.create({});
