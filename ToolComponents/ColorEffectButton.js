import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';

const ColorEffectButton = ({ btnWidth, btnHeight, btnTittle, onPress }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.circle),
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.circle),
            useNativeDriver: true,
        }).start(() => {
            // Reset animations
            scaleAnim.setValue(0);
            opacityAnim.setValue(1);
        });
    };

    const animatedStyle = {
        transform: [{ scaleX: scaleAnim }],
        opacity: opacityAnim,
    };

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={[styles.button, {
            width: btnWidth,
            height: btnHeight,
        }]}>
            <View style={styles.container}>
                <Animated.View style={[styles.inner, animatedStyle]} />
                <Text style={styles.text}>{btnTittle}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4123d0',
        borderRadius: 60,
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    inner: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#a192ed',
        // left: '0%',
        transform: [{ translateX: '50%' }],
        width: '100%', // Ensuring the width is 100% to allow scaling
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: 1,
    },
});

export default ColorEffectButton;
