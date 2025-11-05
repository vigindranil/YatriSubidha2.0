import { StyleSheet, Text, View, SafeAreaView, Pressable, Dimensions, TouchableOpacity, TextInput, Image, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const BasicFormTemplate = ({ visible, onClose }) => {
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    return (
        <View>
            {/* ============= Body Section Start ============= */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ marginTop: 20, width: '90%', marginLeft: '5%', }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollViewContent}>

                    <View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: '#737373', fontSize: 16, fontWeight: '600', }}>Name<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                            <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                <TextInput
                                    placeholder='Enter Name'
                                    style={{ marginLeft: '2.5%', width: '97.5%', height: 40 }} />
                            </View>
                        </View>


                        <View style={{ marginTop: 15, flexDirection: 'row' }}>
                            <View style={{ width: '47%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373', }}>Mobile Number<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ textAlign: 'center', width: '30%' }}>+91</Text>
                                    <TextInput
                                        placeholder='Mobile Number'
                                        style={{ marginLeft: '5%', width: '95%', height: 40 }} />
                                </View>
                            </View>
                            <View style={{ width: '6%' }}></View>
                            <View style={{ width: '47%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Email Address<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                    <TextInput
                                        placeholder='Email Address'
                                        style={{ marginLeft: '5%', width: '95%', height: 40 }} />
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 15, flexDirection: 'row' }}>
                            <View style={{ width: '47%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Nationality<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                    <TextInput
                                        placeholder={"Enter Nationality"}
                                        style={{ width: '95%', height: 40, marginLeft: '5%' }} />
                                </View>
                            </View>
                            <View style={{ width: '6%' }}></View>
                            <View style={{ width: '47%' }}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#737373' }}>Passport Number<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                                <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>

                                    <TextInput
                                        placeholder={"Passport Number"}
                                        style={{ width: '95%', height: 40, marginLeft: '5%' }} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Address<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                            <View style={styles.textAreaContainer}>
                                <TextInput
                                    multiline={true}
                                    numberOfLines={4}
                                    style={styles.textArea}
                                    placeholder="Address"
                                    textAlignVertical="top" // Ensures text starts at the top
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: '#737373', fontSize: 16, fontWeight: '600', }}>Intended Travel Date<Text style={{ color: 'red', fontWeight: 'bold', fontSize: 17 }}> *</Text></Text>
                            <View style={{ height: 40, borderWidth: .5, borderColor: '#666666', borderRadius: 4, marginTop: 8, flexDirection: 'row' }}>
                                <TextInput
                                    placeholder='Enter Name'
                                    style={{ marginLeft: '2.5%', width: '97.5%', height: 40 }} />
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
                            <TouchableOpacity >

                                <LinearGradient
                                    colors={['#006600', '#00e64d']} // You can change these colors to your desired gradient
                                    start={[0, 1]}
                                    end={[0, 0]}
                                    style={{
                                        backgroundColor: '#ffdb4d', height: 37, width: 130, borderRadius: 5,
                                        alignItems: 'center', marginTop: 10, elevation: 4, alignItems: 'center', justifyContent: 'center'
                                    }}>
                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Submit</Text>
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
                                        backgroundColor: '#ffdb4d', height: 37, width: 130, borderRadius: 5,
                                        alignItems: 'center', marginTop: 10, elevation: 4, alignItems: 'center', justifyContent: 'center'
                                    }}>
                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Back</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ height: 100 }}></View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default BasicFormTemplate

const styles = StyleSheet.create({
    scrollViewContent: {
        marginTop: 20,
        marginBottom: 100,
        paddingBottom: 16,
    },
    gradient: {
        marginTop: 5,
        width: 180,
        height: 2,
        borderRadius: 10,
    },
    inputContainer: {
        marginTop: 15,
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#737373',
    },
    textAreaContainer: {
        height: 110,
        borderWidth: 0.5,
        borderColor: '#666666',
        borderRadius: 4,
        marginTop: 8,
        padding: 5,
    },
    textArea: {
        height: '100%',
        justifyContent: 'flex-start',
        textAlignVertical: 'top', // Ensures text starts at the top
    },
})