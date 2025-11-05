import { StyleSheet, Text, View, Alert, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SingleMenuCard from './SingleMenuCard'
import { useNavigation } from '@react-navigation/native'

const MenuListComponent = () => {
    // Define unique colors for each service category
    const serviceColors = {
        // Row 1 - Transportation & Logistics
        bookSlot: '#6366F1',        // Indigo
        eCarts: '#8B5CF6',          // Purple
        luggage: '#EC4899',         // Pink

        // Row 2 - Security & Support
        security: '#EF4444',        // Red
        waiting: '#F59E0B',         // Amber
        support: '#10B981',         // Emerald

        // Row 3 - Food & Health
        meal: '#06B6D4',            // Cyan
        medical: '#3B82F6',         // Blue
        health: '#8B5CF6',          // Purple

        // Row 4 - Travel Services
        cab: '#F59E0B',             // Amber
        currency: '#10B981',        // Emerald
        hotel: '#EC4899',           // Pink

        // Row 5 - Additional Services
        flight: '#6366F1',          // Indigo
        sim: '#EF4444',             // Red
    };

    const navigation = useNavigation();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogService, setDialogService] = useState('');

    const handleCardPress = (serviceName) => {
        if (serviceName === 'Book Slot') {
            navigation.navigate('StackNavigatorBooking', { screen: 'DateWiseSlotListScreen' });
        } else {
            setDialogService(serviceName);
            setDialogVisible(true);
        }
    };

    return (
        <View style={menuStyles.container}>
            <Modal
                transparent
                visible={dialogVisible}
                animationType="fade"
                onRequestClose={() => setDialogVisible(false)}
            >
                <View style={menuStyles.modalOverlay}>
                    <View style={menuStyles.modalCard}>
                        <View style={menuStyles.modalHeader}>
                            <Text style={menuStyles.modalTitle}>Coming Soon</Text>
                            <Text style={menuStyles.modalSubtitle}>"{dialogService}" will be available shortly.</Text>
                        </View>
                        <View style={menuStyles.modalBody}>
                            <Text style={menuStyles.modalBodyText}>We are working hard to bring this service to you. Please check back later or explore other services in the meantime.</Text>
                        </View>
                        <View style={menuStyles.modalActions}>
                            <TouchableOpacity style={[menuStyles.dialogButton, { backgroundColor: '#f0f0f5' }]} onPress={() => setDialogVisible(false)}>
                                <Text style={[menuStyles.dialogButtonText, { color: '#595959' }]}>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[menuStyles.dialogButton, { backgroundColor: '#4123d0' }]} onPress={() => { setDialogVisible(false); navigation.navigate('StackNavigatorBooking', { screen: 'DateWiseSlotListScreen' }); }}>
                                <Text style={[menuStyles.dialogButtonText, { color: '#fff' }]}>Go to Book Slot</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Text style={menuStyles.sectionTitle}>Our Utility Services</Text>
            
            <View style={menuStyles.gridContainer}>
                {/* Row 1 - Transportation & Logistics */}
                <View style={menuStyles.row}>
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/slotBook.png')} 
                        name={'Book Slot'} 
                        height={35}
                        accentColor={serviceColors.bookSlot}
                        onPress={() => handleCardPress('Book Slot')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/ekart.png')} 
                        name={'E-Carts Services'} 
                        height={35}
                        accentColor={serviceColors.eCarts}
                        onPress={() => handleCardPress('E-Carts Services')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/luggage.png')} 
                        name={'Luggage Movement'} 
                        height={35}
                        accentColor={serviceColors.luggage}
                        onPress={() => handleCardPress('Luggage Movement')}
                    />
                </View>

                {/* Row 2 - Security & Support */}
                <View style={menuStyles.row}>
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/security.png')} 
                        name={'Security Clearance'} 
                        height={35}
                        accentColor={serviceColors.security}
                        onPress={() => handleCardPress('Security Clearance')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/waiting.png')} 
                        name={'Priority Waiting Area'} 
                        height={35}
                        accentColor={serviceColors.waiting}
                        onPress={() => handleCardPress('Priority Waiting Area')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/helper.png')} 
                        name={'Dedicated Support'} 
                        height={35}
                        accentColor={serviceColors.support}
                        onPress={() => handleCardPress('Dedicated Support')}
                    />
                </View>

                {/* Row 3 - Food & Health */}
                <View style={menuStyles.row}>
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/fastFoodApp.png')} 
                        name={'Meal Booking'} 
                        height={35}
                        accentColor={serviceColors.meal}
                        onPress={() => handleCardPress('Meal Booking')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/medicalIcon.png')} 
                        name={'Medical Transit'} 
                        height={35}
                        accentColor={serviceColors.medical}
                        onPress={() => handleCardPress('Medical Transit')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/healthIcon.png')} 
                        name={'Health Staff'} 
                        height={35}
                        accentColor={serviceColors.health}
                        onPress={() => handleCardPress('Health Staff')}
                    />
                </View>

                {/* Row 4 - Travel Services */}
                <View style={menuStyles.row}>
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/cabBooking.jpg')} 
                        name={'Cab Booking'} 
                        height={35}
                        accentColor={serviceColors.cab}
                        onPress={() => handleCardPress('Cab Booking')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/currencyExchange.png')} 
                        name={'Currency Exchange'} 
                        height={34} 
                        width={34}
                        accentColor={serviceColors.currency}
                        onPress={() => handleCardPress('Currency Exchange')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/hotelIcon.png')} 
                        name={'Hotel Booking'} 
                        height={35}
                        accentColor={serviceColors.hotel}
                        onPress={() => handleCardPress('Hotel Booking')}
                    />
                </View>

                {/* Row 5 - Additional Services */}
                <View style={menuStyles.row}>
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/flightIcon.png')} 
                        name={'Flight Booking'} 
                        height={35}
                        accentColor={serviceColors.flight}
                        onPress={() => handleCardPress('Flight Booking')}
                    />
                    <SingleMenuCard 
                        img={require('../Images/DigiLockerImage/simIcon.png')} 
                        name={'Mobile Sim'} 
                        height={35}
                        accentColor={serviceColors.sim}
                        onPress={() => handleCardPress('Mobile Sim')}
                    />
                    <View style={menuStyles.emptyCard} />
                </View>
            </View>
        </View>
    )
}

export default MenuListComponent

const menuStyles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        backgroundColor: 'transparent',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalCard: {
        width: '88%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6
    },
    modalHeader: {
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1f1f1f'
    },
    modalSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: '#6b7280'
    },
    modalBody: {
        marginTop: 6,
    },
    modalBodyText: {
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20
    },
    modalActions: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    dialogButton: {
        height: 38,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    dialogButtonText: {
        fontSize: 14,
        fontWeight: '800'
    },
    sectionTitle: {
        color: '#1A1A1A',
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 20,
        letterSpacing: 0.3,
        paddingHorizontal: 4,
    },
    gridContainer: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 16,
    },
    emptyCard: {
        height: 100,
        width: '30%',
    },
})