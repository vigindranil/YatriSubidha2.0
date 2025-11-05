// components/PressableButton.js

import React, { useState } from 'react';
import { Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomiseSpringButton({ onPress, title, btnHeight, btnWidth, bfrPrsColor, aftPrsColor, btnTxtColor, btnTxtSize, isDisabled }) {
    const scale = useSharedValue(1);
    const elevation = useSharedValue(5);
    const gradientTransition = useSharedValue(0);
    const [isPressed, setIsPressed] = useState(false)

    const handlePressIn = () => {
        scale.value = withSpring(0.9, { stiffness: 200, damping: 10 });
        elevation.value = withSpring(2);
        gradientTransition.value = withTiming(1, { duration: 100 });
        setIsPressed(true);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { stiffness: 200, damping: 10 });
        elevation.value = withSpring(5);
        setIsPressed(false);
        gradientTransition.value = withTiming(0, { duration: 100 });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            elevation: elevation.value,
        };
    });

    const startColors = bfrPrsColor;
    const endColors = aftPrsColor; // Slightly darker gradient for pressed state

    return (
        <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={isDisabled ? isDisabled : false}
        >
            <Animated.View style={[styles.button, animatedStyle, { width: btnWidth, height: btnHeight, opacity: isDisabled ? 0.7 : 1 }]}>
                <Animated.View style={StyleSheet.absoluteFill}>
                    <LinearGradient
                        colors={isPressed ? endColors : startColors}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
                <Text style={{
                    color: btnTxtColor ? btnTxtColor : '#fff',
                    fontSize: btnTxtSize ? btnTxtSize : 17,
                    fontWeight: '700',
                }}>{title}</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 2,
        overflow: 'hidden', // Ensure the gradient doesn't overflow the button's border radius

    }
});
