import { SafeAreaView, StyleSheet, Text, View, Image, Pressable, ScrollView, Animated, Easing } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ServiceScreen = ({ navigation }) => {
    const [highlightedId, setHighlightedId] = useState(null);
    // const navigation = useNavigation();

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const services = [
        { id: 'BookSlots', title: 'Book Slots for faster clearance', image: require('../Images/DigiLockerImage/slotBook.png') },
        { id: 'E-Carts Service', title: 'E-Carts Service', image: require('../Images/DigiLockerImage/ekart.png') },
        { id: 'LuggageMovement', title: 'Luggage movement Service', image: require('../Images/DigiLockerImage/flightIcon.png') },
        { id: 'SecurityClearence', title: 'Facilitation to Security clearence', image: require('../Images/DigiLockerImage/security.png') },
        { id: 'PriorityWaiting', title: 'Priority Waiting Area/Lounges', image: require('../Images/DigiLockerImage/waiting.png') },
        { id: 'DedicatedSupport', title: 'Dedicated support personal', image: require('../Images/DigiLockerImage/helper.png') },
        { id: 'MealBooking', title: 'Meal Booking', image: require('../Images/DigiLockerImage/fastFoodApp.png') },
        { id: 'MedicalTransit', title: 'Medical Transit', image: require('../Images/DigiLockerImage/medicalIcon.png') },
        { id: 'HealthStaff', title: 'Health Staff', image: require('../Images/DigiLockerImage/healthIcon.png') },
        { id: 'CabBooking', title: 'Cab booking', image: require('../Images/DigiLockerImage/cabBooking.jpg') },
        { id: 'CurrencyExchange', title: 'Currency exchange', image: require('../Images/DigiLockerImage/currencyExchange.png') },
        { id: 'HotelBooking', title: 'Hotel Booking', image: require('../Images/DigiLockerImage/hotelIcon.png') },
        { id: 'FlightBooking', title: 'Flight Booking', image: require('../Images/DigiLockerImage/flightIcon.png') },
        { id: 'MobileSim', title: 'Mobile Sim', image: require('../Images/DigiLockerImage/simIcon.png') },
    ];

    const handlePress = (id) => {
        setHighlightedId(id);

        Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 50,
                easing: Easing.cubic,
                useNativeDriver: true,
            }).start();
        });

        if (id === 'BookSlots') {
            navigation.navigate('StackNavigatorBooking', { screen: 'DateWiseSlotListScreen' });
            return;
        }

        navigation.navigate('TempPageList', { id });
    };

    useFocusEffect(
        React.useCallback(() => {
            // Reset the highlightedId state when the screen gains focus
            setHighlightedId(null);
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 20, marginVertical: 10, textAlign: 'center', fontWeight: '700' }}>Our Services</Text>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 12 }}>
                {services.map(service => (
                    <Pressable
                        key={service.id}
                        onPress={() => handlePress(service.id)}
                        style={[
                            styles.serviceItem,
                            highlightedId === service.id && styles.highlighted
                        ]}
                    >
                        <Animated.View style={[styles.iconContainer, { transform: [{ scale: highlightedId === service.id ? scaleAnim : 1 }] }]}>
                            <Image source={service.image} style={styles.icon} />
                        </Animated.View>
                        <View style={styles.textContainer}>
                            <View style={styles.textRow}>
                                <Text style={[
                                    styles.text,
                                    highlightedId === service.id && styles.highlightedText
                                ]}>
                                    {service.title}
                                </Text>
                                <Ionicons
                                    name="chevron-forward-circle"
                                    size={22}
                                    color={highlightedId === service.id ? '#00b300' : '#0073e6'}
                                    style={styles.iconArrow}
                                />
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    serviceItem: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    highlighted: {
        backgroundColor: '#e6f0ff',
        marginLeft: 12,
        marginRight: 12,
        borderColor: '#0073e6',
    },
    iconContainer: {
        width: '20%',
        alignItems: 'center',

    },
    icon: {
        height: 42,
        width: 42,
        justifyContent: 'center',
        resizeMode: 'contain'
    },
    textContainer: {
        width: '80%',
    },
    textRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontSize: 17,
        fontWeight: '600',
        width: '85%',
        color: '#404040',
    },
    highlightedText: {
        color: '#0073e6',
    },
    iconArrow: {
        textAlign: 'center',
        width: '15%',
    },
});

export default ServiceScreen;
