import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const SingleMenuCard = ({ img, name, height, width, accentColor = '#6366F1', onPress,clickable=false}) => {
    return (
        <TouchableOpacity style={styles.cardContainer} disabled={clickable} activeOpacity={0.8} onPress={onPress}>
            {/* Icon */}
            <View style={styles.iconWrap}>
                <Image
                    source={img}
                    style={{ height: height ? height : 40, width: width ? width : 40, resizeMode: 'contain' }}
                />
            </View>

            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>{name}</Text>

            {/* Bottom Accent */}
            <View style={[styles.bottomAccent, { backgroundColor: accentColor }]} />
        </TouchableOpacity>
    )
}

export default SingleMenuCard

const styles = StyleSheet.create({
    cardContainer: {
        height: 110,
        width: 110,
        marginTop: 10,
        elevation: 3,
        borderRadius: 15,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    iconWrap: {
        marginLeft: 14,
        marginTop: 10,
    },
    title: {
        fontSize: 12,
        marginLeft: 14,
        marginTop: 16,
        fontWeight: '700',
        color: '#4d4d4d',
    },
    bottomAccent: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 5,
    },
})