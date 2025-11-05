import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const TopSlidingCardComponent = ({ imgName, cardTitle, cardBodyTxt, firstImgHeight, firstImgWidth, SecondImgHeight, SecondImgWidth }) => {
    return (
        <View style={{
            height: 140, width: 240,
            backgroundColor: '#fff', marginLeft: 20,
            borderRadius: 7, elevation: 2
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 8 }}>
                <View>
                    <Image source={imgName} style={{ height: firstImgHeight, width: firstImgWidth, resizeMode: "contain" }} />
                </View>
                <View>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: '#4123d0' }}>{cardTitle}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#666666' }}>{cardBodyTxt}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end', marginRight: 20 }}>
                <Image source={imgName} style={{ height: SecondImgHeight, width: SecondImgWidth, opacity: 0.2, resizeMode: "contain" }} />
            </View>
            {/* <View>
                <Text style={{ fontSize: 11, textAlign: 'center', marginBottom: 10, color: '#8c8c8c' }}>Unique Identification Authority of India(UIDAI)</Text>
            </View> */}
        </View>
    )
}

export default TopSlidingCardComponent

const styles = StyleSheet.create({})