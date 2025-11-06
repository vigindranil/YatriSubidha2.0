import { StyleSheet, StatusBar, Text, View, TouchableOpacity, Pressable, TextInput, FlatList, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
// *** HIGHLIGHT: AsyncStorage ko import kiya gaya hai ***
import AsyncStorage from '@react-native-async-storage/async-storage';

// Aapke asli token functions ko import kiya gaya hai
import { getToken } from '../Axios_BaseUrl_Token_SetUp/getToken';
import { fetchAndSetAuthToken } from '../Axios_BaseUrl_Token_SetUp/setToken';

// Aapke project ka component
import SlotBookingCard from '../Components/SlotBookingCard';


const DateWiseSlotListScreen = ({ navigation }) => {
    // State variables
    const [journeyType, setJourneyType] = useState('Arrival');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formattedDate, setFormattedDate] = useState(formatDateToYMD(new Date()));
    const [slotList, setSlotList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [todaysDate, setTodaysDate] = useState('');

    // YYYY-MM-DD format mein date ke liye
    function formatDateToYMD(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // *** HIGHLIGHT: Journey type ko local DB mein save karne ka function ***
    const saveJourneyType = async (type) => {
        try {
            await AsyncStorage.setItem('selectedJourneyType', type);
            console.log(`Journey Type '${type}' local DB mein save ho gaya hai.`);
        } catch (e) {
            console.error('Journey Type save karne mein error aaya:', e);
        }
    };

    const dateWiseSlotDetails = async (date, type) => {
        setIsLoading(true);
        setSlotList([]);
        try {
            const apiType = type === 'Arrival' ? '2' : '1';
            console.log(`API Call Shuru: Date='${date}', Type='${apiType}' (${type})`);
            let authToken = await getToken();
            if (!authToken) {
                authToken = await fetchAndSetAuthToken();
            }
            const formData = new FormData();
            formData.append('UserID', '2');
            formData.append('Type', apiType);
            formData.append('JourneyDate', date);
            formData.append('AuthInfo', '{}');
            const res = await fetch('https://yatrisubidha.wb.gov.in/service/GetAvailableSlotByDate', {
                method: 'POST',
                headers: { 'Authorization': authToken || '', 'Accept': 'application/json' },
                body: formData,
            });
            console.log(`API Response Status: ${res.status}`);
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`HTTP Error: ${res.status}`);
            }
            const rawResponse = await res.json();
            const items = rawResponse?.Data || rawResponse?.data || rawResponse || [];
            if (!Array.isArray(items)) {
                console.warn('API se array nahi mila:', rawResponse);
                setSlotList([]);
                return;
            }
            const normalized = items.map((it, idx) => ({
                id: it.SlotID || idx.toString(), name: it.SlotNameEng || 'Unnamed Slot',
                capacity: Number(it.SlotCapacity || 0), slot_count: Number(it.BookingCount || 0),
                timing: it.TimeRangeEng || 'N/A',
            }));
            setSlotList(normalized);
        } catch (error) {
            console.error('Data fetch karte waqt error:', error);
            setSlotList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = new Date(selectedDate);
            setDate(currentDate);
            setFormattedDate(formatDateToYMD(currentDate));
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const today = new Date();
            const formattedToday = formatDateToYMD(today);
            setTodaysDate(formattedToday);
            setFormattedDate(formattedToday);
            setDate(today);

            // *** HIGHLIGHT: Screen load hote hi saved Journey Type ko load karega ***
            const loadJourneyType = async () => {
                try {
                    const savedType = await AsyncStorage.getItem('selectedJourneyType');
                    if (savedType !== null) {
                        setJourneyType(savedType);
                        console.log(`Local DB se Journey Type load hua: '${savedType}'`);
                    }
                } catch (e) {
                    console.error('Journey type load karne mein error aaya:', e);
                }
            };
            loadJourneyType();
        }, [])
    );

    useEffect(() => {
        if (formattedDate && journeyType) {
            dateWiseSlotDetails(formattedDate, journeyType);
        }
    }, [formattedDate, journeyType]);

    const renderSlotItem = ({ item }) => {
        return <SlotBookingCard slot={item} intendedDate={formattedDate} />;
    };

    const minimumDate = new Date();
    const maximumDate = new Date();
    maximumDate.setDate(minimumDate.getDate() + 30);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Slot Availability</Text>
            </View>
            <Pressable style={styles.bodyContainerWrapper} onPress={() => setIsDropdownOpen(false)}>
                <View style={styles.bodyContainer}>
                    {/* Journey Type Dropdown */}
                    <View style={styles.inputContainerWithPrompt}>
                        <Text style={styles.datePrompt}>Select Journey Type</Text>
                        <View style={styles.journeyTypeDropdownContainer}>
                            <TouchableOpacity onPress={() => setIsDropdownOpen(!isDropdownOpen)} style={styles.customInputButton}>
                                <View style={styles.customInputButtonInner}>
                                    <View style={styles.dateIconWrap}><Ionicons name="swap-vertical" size={18} color="#4123d0" /></View>
                                    <Text style={styles.customInputText}>{journeyType}</Text>
                                    <AntDesign name={isDropdownOpen ? "up" : "down"} size={14} color="#737373" />
                                </View>
                            </TouchableOpacity>
                            {isDropdownOpen && (
                                <View style={styles.dropdownMenu}>
                                    <TouchableOpacity style={styles.dropdownItem} onPress={() => {
                                        setJourneyType('Arrival');
                                        saveJourneyType('Arrival');  
                                        setIsDropdownOpen(false);
                                    }}>
                                        <Text style={styles.dropdownItemText}>Arrival</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.dropdownItem, { borderBottomWidth: 0 }]} onPress={() => {
                                        setJourneyType('Departure');
                                        saveJourneyType('Departure'); 
                                        setIsDropdownOpen(false);
                                    }}>
                                        <Text style={styles.dropdownItemText}>Departure</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    {/* Date Picker */}
                    <View style={styles.inputContainerWithPrompt}>
                        <Text style={styles.datePrompt}>Select A Date For Checking Availability</Text>
                        <Pressable onPress={() => setShowDatePicker(true)} style={styles.customInputButton}>
                            <View style={styles.customInputButtonInner}>
                                <View style={styles.dateIconWrap}><AntDesign name="calendar" size={18} color="#4123d0" /></View>
                                <TextInput value={formattedDate} style={styles.customInputText} editable={false} />
                                <AntDesign name="down" size={14} color="#737373" />
                            </View>
                        </Pressable>
                        <Modal animationType="fade" transparent={true} visible={showDatePicker} onRequestClose={() => setShowDatePicker(false)}>
                            <View style={styles.datePickerModalOverlay}>
                                <View style={styles.datePickerCard}>
                                    <View style={styles.datePickerHeader}>
                                        <Text style={styles.datePickerTitle}>Select a date</Text>
                                        <Text style={styles.datePickerSubtitle}>Choose within the next 30 days</Text>
                                    </View>
                                    <DateTimePicker value={date} mode="date" display="inline" minimumDate={minimumDate} maximumDate={maximumDate} onChange={handleDateChange} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                    <View style={{ marginVertical: 15, marginTop: 25 }}>
                        <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#595959' }}>
                            {todaysDate === formattedDate ? `Status of Today (${journeyType})` : `Status of ${formattedDate} (${journeyType})`}
                        </Text>
                    </View>
                     {isLoading ? (
                        <ActivityIndicator size="large" color="#4123d0" style={{ marginTop: 20 }} />
                    ) : Array.isArray(slotList) && slotList.length === 0 ? (
                        <View style={{ alignItems: 'center', marginTop: 30, paddingHorizontal: 16 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#737373', textAlign: 'center' }}>No Slots Available</Text>
                            <Text style={{ marginTop: 8, fontSize: 14, color: '#8c8c8c', textAlign: 'center' }}>
                                No slots are available for {journeyType.toLowerCase()} on {formattedDate}. Please try another date.
                            </Text>
                        </View>
                    ) : (
                        <FlatList data={slotList} showsVerticalScrollIndicator={false} renderItem={renderSlotItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.flatListContentContainer} />
                    )}
                </View>
            </Pressable>
        </View>
    );
};

export default DateWiseSlotListScreen;

 const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight || 20, },
    headerContainer: { width: '100%', alignItems: 'center', paddingBottom: 10, },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#0099cc', },
    bodyContainerWrapper: { flex: 1, },
    bodyContainer: { flex: 1, paddingHorizontal: 10, },
    inputContainerWithPrompt: { marginTop: 10, },
    datePrompt: { marginBottom: 8, fontSize: 15, fontWeight: '600', color: '#595959', },
    journeyTypeDropdownContainer: { position: 'relative', zIndex: 10, },
    customInputButton: { borderRadius: 10, backgroundColor: '#f7f7fb', borderWidth: 1, borderColor: '#e6e6f0', },
    customInputButtonInner: { paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    dateIconWrap: { height: 28, width: 28, borderRadius: 14, backgroundColor: '#efeefe', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    customInputText: { flex: 1, fontWeight: '700', color: '#404040', fontSize: 16, },
    dropdownMenu: { position: 'absolute', top: '100%', width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e6e6f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, marginTop: 4, },
    dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f5', },
    dropdownItemText: { fontSize: 16, fontWeight: '600', color: '#595959', },
    flatListContentContainer: { paddingBottom: 20, },
    datePickerModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
    datePickerCard: { width: '88%', backgroundColor: '#fff', borderRadius: 12, padding: 10, },
    datePickerHeader: { paddingBottom: 10, },
    datePickerTitle: { fontSize: 16, fontWeight: '800', color: '#262626' },
    datePickerSubtitle: { fontSize: 12, color: '#8c8c8c', marginTop: 2 }
});