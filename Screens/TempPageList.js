import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const TempPageList = ({ navigation }) => {
    return (
        <View style={{ marginTop: 100, marginLeft: 20 }}>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('LoginScreen')}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('HomeScreenBeforeLogin')}>
                <Text>HomeScreenBeforeLogin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('DateWiseSlotListScreen')}>
                <Text>Slot Book Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('SlotBookFormScreen')}>
                <Text>Slot Book form  Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('OverlayView')}>
                <Text>Demo design</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate('TestRange')}>
                <Text>Test Range</Text>
            </TouchableOpacity>
        </View>
    )
}

export default TempPageList

const styles = StyleSheet.create({})