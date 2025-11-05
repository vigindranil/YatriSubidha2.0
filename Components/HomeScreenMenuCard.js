import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { AntDesign } from '@expo/vector-icons';
const HomeScreenMenuCard = ({ cardColorArray,
    buttonColorArray, cardHeight,
    CardTitle, cardSecondTitle, CardTittleColor, buttonTxtColor,
    slotQnty, secondTitleBodyContent, slotQntyColor }) => {
    return (
        <LinearGradient
            colors={cardColorArray}
            start={[0, 1]}
            end={[0, 0]}
            style={{ height: cardHeight, width: "46%", marginLeft: '3%', borderRadius: 6, marginTop: 10, flexDirection: 'row', alignItems: 'center' }}
        >
            {CardTitle &&
                <Text style={{
                    fontSize: 22, color: CardTittleColor ? CardTittleColor : '#fff', fontWeight: 'bold',
                    position: 'absolute',
                    top: 0,
                    left: 10,
                }}>{CardTitle}</Text>

            }

            {CardTitle ?
                <LinearGradient
                    colors={buttonColorArray}
                    start={[0, 1]}
                    end={[0, 0]}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        height: 35,
                        width: 110,
                        bottom: 15,
                        right: 15,
                        backgroundColor: 'red',
                        borderRadius: 20
                    }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: buttonTxtColor }}>Book Slot </Text>
                    <AntDesign name="arrowright" size={18} color={buttonTxtColor} />
                </LinearGradient>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontSize: 13, color: CardTittleColor ? CardTittleColor : '#fff', fontWeight: 'bold'
                        }}
                    >{cardSecondTitle}</Text>
                    <Text style={{
                        fontSize: 20, color: CardTittleColor ? CardTittleColor : '#fff', fontWeight: 'bold',
                    }}>{secondTitleBodyContent && secondTitleBodyContent}</Text>
                    <View style={{ height: 20, width: 50, marginTop: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 15 }}>
                        <Text style={{
                            fontSize: 15, color: slotQntyColor ? slotQntyColor : '#fff', fontWeight: 'bold',
                        }}>{slotQnty && slotQnty}</Text>
                    </View>
                </View>
            }
        </LinearGradient>
    )
}

export default HomeScreenMenuCard

const styles = StyleSheet.create({})