import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

const SimpleCustomAlert = ({ visible, title, message, onClose, type = "success" }) => {
    
    // If not visible, don't render anything to save resources
    if (!visible) return null;

    // Determine colors based on type
    const isError = type === "error" || title?.toLowerCase().includes("error") || title?.toLowerCase().includes("failed");
    const primaryColor = isError ? "#FF3B30" : "#34C759"; // Red or Green
    const secondaryColor = isError ? "#FF6B6B" : "#66E07D";
    const iconSymbol = isError ? "!" : "✓";

    return (
        <Modal
            animationType="none" // explicitly disabled animation
            transparent={true}
            visible={visible}
            onRequestClose={onClose} // Android back button handler
            statusBarTranslucent={true} // Ensures it covers status bar area
        >
            {/* Overlay: Dimmed Background */}
            <View style={styles.overlay}>
                
                {/* Main Dialog Box */}
                <View style={styles.dialogContainer}>
                    
                    {/* Header / Icon Section */}
                    <View style={styles.iconRow}>
                        <LinearGradient
                            colors={[primaryColor, secondaryColor]}
                            style={styles.iconCircle}
                        >
                            <Text style={styles.iconText}>{iconSymbol}</Text>
                        </LinearGradient>
                    </View>

                    {/* Text Content */}
                    <View style={styles.contentContainer}>
                        <Text style={[styles.titleText, { color: primaryColor }]}>
                            {title}
                        </Text>
                        <Text style={styles.messageText}>
                            {message}
                        </Text>
                    </View>

                    {/* Button */}
                    <TouchableOpacity 
                        activeOpacity={0.8} 
                        onPress={onClose}
                        style={styles.buttonContainer}
                    >
                        <LinearGradient
                            colors={[primaryColor, secondaryColor]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark transparent background
        justifyContent: 'center', // Centers vertically
        alignItems: 'center',     // Centers horizontally
    },
    dialogContainer: {
        width: width * 0.85, // 85% of screen width
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20,
        elevation: 10, // Android Shadow
        shadowColor: '#000', // iOS Shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    iconRow: {
        alignItems: 'center',
        marginBottom: 15,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    iconText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    contentContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    titleText: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 1,
    }
});

export default SimpleCustomAlert;