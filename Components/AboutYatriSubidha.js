import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const AboutYatriSubidha = () => {
    return (
        <View style={{ height: 120 }}>
            <Text style={{ color: '#595959', fontSize: 14, marginBottom: 10, marginLeft: 10, fontWeight: '700' }}>About Yatri Subidaha</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{
                    height: 60, width: 140, borderRadius: 50,
                    borderWidth: .5, padding: 10, alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row',
                    borderColor: '#737373',
                    marginLeft: 15
                }}>
                    <Image source={require('../Images/DigiLockerImage/aboutIcon.png')} style={{ height: 22, width: 22, resizeMode: 'contain', marginRight: 15 }} />
                    <Text style={{ color: '#404040', fontSize: 14, fontWeight: '500' }}>About</Text>
                </View>

                <View style={{
                    height: 60, width: 140, borderRadius: 50,
                    borderWidth: .5, padding: 10, alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row',
                    borderColor: '#737373',
                    marginLeft: 15
                }}>
                    <Image source={require('../Images/DigiLockerImage/faqIcon.png')} style={{ height: 22, width: 22, resizeMode: 'contain', marginRight: 15 }} />
                    <Text style={{ color: '#404040', fontSize: 14, fontWeight: '500' }}>FAQs</Text>
                </View>

                <View style={{
                    height: 60, width: 140, borderRadius: 50,
                    borderWidth: .5, padding: 10, alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row',
                    borderColor: '#737373',
                    marginLeft: 15
                }}>
                    <Image source={require('../Images/DigiLockerImage/statisticsIcon.png')} style={{ height: 22, width: 22, resizeMode: 'contain', marginRight: 15 }} />
                    <Text style={{ color: '#404040', fontSize: 14, fontWeight: '500' }}>Statistics</Text>
                </View>

                <View style={{
                    height: 60, width: 140, borderRadius: 50,
                    borderWidth: .5, padding: 10, alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row',
                    borderColor: '#737373',
                    marginLeft: 15
                }}>
                    <Image source={require('../Images/DigiLockerImage/termsIcon.png')} style={{ height: 22, width: 22, resizeMode: 'contain', marginRight: 15 }} />
                    <Text style={{ color: '#404040', fontSize: 14, fontWeight: '500' }}>Terms</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default AboutYatriSubidha

const styles = StyleSheet.create({})