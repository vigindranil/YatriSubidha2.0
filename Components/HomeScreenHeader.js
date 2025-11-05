import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreenHeader = ({ title }) => {
    const navigation = useNavigation();
    const [isPressed, setIsPressed] = useState(false);

    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                {/* <Pressable
                    onPress={() => navigation.goBack()}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                    style={({ pressed }) => [
                        styles.backButton,
                        { backgroundColor: pressed ? '#7c66e5' : '#4123d0' },
                    ]}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable> */}
                <Text style={styles.title}>{title}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4123d0',
        paddingTop: 25,
        paddingBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 5,

    },
    title: {
        marginLeft: 25,
        fontSize: 23,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default HomeScreenHeader;
