import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'

const DrawerHomeScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: '10.6%' }}>
                <LinearGradient
                    colors={['#0099e6', '#0077b3']}
                    style={{ flex: 1 }}
                    start={[0, 0]}
                    end={[0, 1]}
                />
            </View>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('HomeScreenBeforeLogin')}>
                    <Text>HomeScreenBeforeLogin</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('DateWiseSlotListScreen')}>
                    <Text>Slot Book Screen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('OverlayView')}>
                    <Text>Demo design</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('TestRange')}>
                    <Text>Test Range</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DrawerHomeScreen

const styles = StyleSheet.create({})