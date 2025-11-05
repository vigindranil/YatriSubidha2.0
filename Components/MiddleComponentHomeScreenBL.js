import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
<Feather name="user-check" size={24} color="black" />
const MiddleComponentHomeScreenBL = () => {
    return (
        <LinearGradient
            colors={['#acb4fc', '#f9c2c7']} // Colors for the gradient
            start={{ x: 0, y: 0 }} // Start point (left)
            end={{ x: 1, y: 0 }} // End point (right)
            style={[styles.gradient, { flexDirection: 'row' }]}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#e6e9fe', height: 46, width: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }}>
                    <Text> <Feather name="user-check" size={24} color="#595959" /></Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: 'black', fontWeight: '700' }}>2.88 Million </Text>
                    <Text>Registered Users</Text>
                </View>
            </View>
            <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#e6e9fe', height: 46, width: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }}>
                    <Text> <Ionicons name="document-attach-outline" size={24} color="#595959" /></Text>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ color: 'black', fontWeight: '700' }}>2.88 Million </Text>
                    <Text>Issued Documents</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

export default MiddleComponentHomeScreenBL

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80, // Adjust the height as needed
        marginHorizontal: 10,
        borderRadius: 10

    },
    text: {
        color: 'white',
        fontSize: 24,
    },
})