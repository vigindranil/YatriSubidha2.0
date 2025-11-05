// RadioInput.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioInput = ({ options, selectedValue, onValueChange }) => {
    return (
        <View style={styles.container}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={styles.optionContainer}
                    onPress={() => onValueChange(option.value)}
                >
                    <View style={styles.radioCircle}>
                        {selectedValue === option.value && <View style={styles.selectedRb} />}
                    </View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#777',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4123d0',
    },
    optionLabel: {
        marginLeft: 10,
        fontSize: 16,
        color: '#737373',
    },
});

export default RadioInput;
