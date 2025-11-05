import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import BookedSlotListComponent from '../Components/BookedSlotListComponent'
import { useFocusEffect } from '@react-navigation/native';
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MyAllBookingHistory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bookingHistory, setBookingHistory] = useState();

    useFocusEffect(
        React.useCallback(() => {
            const getStorageDataAndBookingHistory = async () => {
                setIsLoading(true)
                try {
                    const getEmail = await AsyncStorage.getItem('user_login_email');
                    const response = await axiosConfiguration.post('/user/individual-all-booking-history', { email: getEmail });
                    if (response?.data?.success === true) {
                        setBookingHistory(response?.data?.result);
                        console.log('booking History', response?.data?.result)
                    }
                } catch (error) {
                    console.error('Failed to retrieve token:', error);
                }
                finally {
                    setIsLoading(false)
                }
            };
            getStorageDataAndBookingHistory();

        }, [])
    );
    const renderBookingHistory = ({ item }) => {
        return <BookedSlotListComponent bookingHistory={item} />;
    };
    return (
        <View style={{ marginHorizontal: 5, marginTop: 10 }}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '800', marginBottom: 10, marginTop: 7, color: '#4d4d4d' }}>Slot Booking History</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#4123d0" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={bookingHistory}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderBookingHistory}
                    keyExtractor={(item) => item.slotBookingDate.toString()}
                    contentContainerStyle={styles.flatListContentContainer}
                />
            )}
        </View>
    )
}

export default MyAllBookingHistory

const styles = StyleSheet.create({
    flatListContentContainer: {
        paddingBottom: 50,
    },
})