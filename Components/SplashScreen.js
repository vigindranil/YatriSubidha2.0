import {
    View,
    Text,
    StyleSheet,
    Animated,
    Image,
    Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";

const SplashScreen = ({ navigation }) => {
    // Create an animated value
    const translateX = useRef(new Animated.Value(-100)).current; // Start outside the screen on the left

    // Get the screen width
    const screenWidth = Dimensions.get("window").width;

    // Animation function
    const startAnimation = () => {
        Animated.timing(translateX, {
            toValue: screenWidth, // Move to the right, beyond the screen width
            duration: 2000, // Duration in milliseconds
            useNativeDriver: true,
        }).start();
    };

    // Start the animation when the component mounts
    useEffect(() => {
        startAnimation();
    }, []);

    const [displayText, setDisplayText] = useState("");
    const cursorAnimation = useRef(new Animated.Value(0)).current;
    const text = "Yatri Subidha";
    const speed = 100;

    useEffect(() => {
        let currentIndex = 0;
        setDisplayText("");

        const type = () => {
            if (currentIndex < text.length) {
                setDisplayText((prev) => prev + text[currentIndex]);
                currentIndex += 1;
                setTimeout(type, speed);
            }
        };

        type();

        // Cursor animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(cursorAnimation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false,
                }),
                Animated.timing(cursorAnimation, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [text, speed, cursorAnimation]);

    const cursorOpacity = cursorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });

    useEffect(() => {
        const loadResources = async () => {
            // Simulate a loading process
            await new Promise((resolve) => setTimeout(resolve, 2000));
            // Navigate to the main screen
            navigation.replace("HomeScreenBeforeLogin"); // Replace 'MainScreen' with your next screen name
        };

        loadResources();
    }, [navigation]);

    return (
        <View
            style={{ backgroundColor: "#4123D0", width: "100%", height: "100%" }}
        >
            <Animated.View style={{ transform: [{ translateX }] }}>
                <Image
                    source={require("../Images/SplashIcon.png")}
                    style={{ width: 130, height: 130, marginTop: "70%", resizeMode: 'contain' }}
                />
            </Animated.View>
            <View style={{ alignItems: "center" }}>
                <Text
                    style={{
                        color: "white",
                        fontSize: 25,
                        fontFamily: "monospace",
                        marginTop: -25,
                    }}
                >
                    {displayText}
                </Text>
            </View>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({});
