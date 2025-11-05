import { StyleSheet, StatusBar, Text, View, TouchableOpacity, Pressable, TextInput, FlatList, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomiseSpringButton from '../ToolComponents/CustomiseSpringButton';
import SlotBookingCard from '../Components/SlotBookingCard';
import axiosConfiguration from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
import { getToken } from '../Axios_BaseUrl_Token_SetUp/getToken';
import { fetchAndSetAuthToken } from '../Axios_BaseUrl_Token_SetUp/setToken';

const DateWiseSlotListScreen = ({ navigation }) => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const formatDateToYMD = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formattedDate, setFormattedDate] = useState(formatDateToYMD(new Date()));

    const [slotList, setSlotList] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [todaysDate, setTodaysDate] = useState();
    const dateWiseSlotDetails = async (date) => {
        setIsLoading(true);
        try {
            console.log('Slot API input date:', date);
            let authToken = await getToken();
            console.log('Auth token:', authToken);
            if (!authToken) {
                try {
                    authToken = await fetchAndSetAuthToken();
                } catch (e) {
                    console.log('Auth token fetch failed');
                }
            }
            console.log('Slot API will send:', {
                UserID: '"2"',
                JourneyDate: `"${date}"`,
                AuthInfo: '"{}"',
            });
            // Build raw multipart body to mirror curl exactly
            const boundary = '----rnformboundary7MA4YWxkTrZu0gW';
            const multipartBody = [
                `--${boundary}`,
                'Content-Disposition: form-data; name="UserID"',
                '',
                '"2"',
                `--${boundary}`,
                'Content-Disposition: form-data; name="JourneyDate"',
                '',
                `"${date}"`,
                `--${boundary}`,
                'Content-Disposition: form-data; name="AuthInfo"',
                '',
                '"{}"',
                `--${boundary}--`,
                ''
            ].join('\r\n');
            console.log('Slot API raw multipart body:', multipartBody);

            const res = await fetch('https://yatrisubidha.wb.gov.in/service/GetAvailableSlotByDate', {
                method: 'POST',
                headers: {
                    'Authorization': authToken || '',
                    'Accept': 'application/json, text/plain, */*',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                    'Referer': 'https://yatrisubidha.wb.gov.in/',
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                },
                body: multipartBody,
            });

            // Debug: status and headers
            console.log('Slot API status:', res.status);
            console.log('Slot API headers:', Object.fromEntries(res.headers.entries()));

            if (!res.ok) {
                const text = await res.text();
                console.log('Slot API non-OK body:', text);
                throw new Error(`HTTP ${res.status}: ${text}`);
            }

            const contentType = res.headers.get('content-type') || '';
            const rawBodyText = contentType.includes('application/json') ? null : await res.text();
            let raw = contentType.includes('application/json') ? await res.json() : JSON.parse(rawBodyText || '{}');
            console.log('Slot API raw JSON:', raw);
            let items = [];
            if (Array.isArray(raw)) items = raw;
            else if (Array.isArray(raw?.data)) items = raw.data;
            else if (Array.isArray(raw?.Data)) items = raw.Data;
            else if (Array.isArray(raw?.result)) items = raw.result;
            else if (Array.isArray(raw?.data?.data)) items = raw.data.data;
            else if (Array.isArray(raw?.data?.Data)) items = raw.data.Data;
            else if (Array.isArray(raw?.Data?.data)) items = raw.Data.data;
            else if (Array.isArray(raw?.data?.result)) items = raw.data.result;
            else if (Array.isArray(raw?.data?.slots)) items = raw.data.slots;
            else if (Array.isArray(raw?.data)) items = raw.data;
            console.log('Slot API items array length:', Array.isArray(items) ? items.length : 'not array');

            // If empty, try alternative payload styles to match server quirks
            if (!Array.isArray(items) || items.length === 0) {
                console.log('Retry 1: multipart without quotes');
                const boundary2 = '----rnformboundaryAltBndry0';
                const multipartBody2 = [
                    `--${boundary2}`,
                    'Content-Disposition: form-data; name="UserID"',
                    '',
                    '2',
                    `--${boundary2}`,
                    'Content-Disposition: form-data; name="JourneyDate"',
                    '',
                    `${date}`,
                    `--${boundary2}`,
                    'Content-Disposition: form-data; name="AuthInfo"',
                    '',
                    '{}',
                    `--${boundary2}--`,
                    ''
                ].join('\r\n');
                const res2 = await fetch('https://yatrisubidha.wb.gov.in/service/GetAvailableSlotByDate', {
                    method: 'POST',
                    headers: {
                        'Authorization': authToken || '',
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                        'Referer': 'https://yatrisubidha.wb.gov.in/',
                        'Origin': 'https://yatrisubidha.wb.gov.in',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-Type': `multipart/form-data; boundary=${boundary2}`,
                    },
                    body: multipartBody2,
                });
                console.log('Retry 1 status:', res2.status);
                const ct2 = res2.headers.get('content-type') || '';
                const raw2 = ct2.includes('application/json') ? await res2.json() : JSON.parse(await res2.text() || '{}');
                console.log('Retry 1 raw JSON:', raw2);
                let items2 = Array.isArray(raw2?.data) ? raw2.data : Array.isArray(raw2) ? raw2 : [];
                if (items2.length === 0) {
                    console.log('Retry 2: application/x-www-form-urlencoded');
                    const urlBody = `UserID=${encodeURIComponent('"2"')}&JourneyDate=${encodeURIComponent(`"${date}"`)}&AuthInfo=${encodeURIComponent('"{}"')}`;
                    const res3 = await fetch('https://yatrisubidha.wb.gov.in/service/GetAvailableSlotByDate', {
                        method: 'POST',
                        headers: {
                            'Authorization': authToken || '',
                            'Accept': 'application/json, text/plain, */*',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                            'Referer': 'https://yatrisubidha.wb.gov.in/',
                            'Origin': 'https://yatrisubidha.wb.gov.in',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        },
                        body: urlBody,
                    });
                    console.log('Retry 2 status:', res3.status);
                    const ct3 = res3.headers.get('content-type') || '';
                    const raw3 = ct3.includes('application/json') ? await res3.json() : JSON.parse(await res3.text() || '{}');
                    console.log('Retry 2 raw JSON:', raw3);
                    items2 = Array.isArray(raw3?.data) ? raw3.data : Array.isArray(raw3) ? raw3 : [];
                }

                if (Array.isArray(items2) && items2.length > 0) {
                    items = items2;
                }
            }

            const normalized = (items || []).map((it, idx) => ({
                id: it.SlotID ?? it.SlotId ?? it.slotId ?? it.id ?? idx,
                name: it.SlotNameEng ?? it.SlotName ?? it.slot_name ?? it.name ?? 'Slot',
                capacity: Number(it.SlotCapacity ?? it.capacity ?? it.Capacity ?? it.total ?? it.TotalCapacity ?? 0),
                slot_count: Number(it.BookingCount ?? it.slot_count ?? it.Booked ?? it.booked ?? it.Occupied ?? 0),
                timing: it.TimeRangeEng ?? it.timing ?? it.Time ?? it.time ?? it.SlotTime ?? it.slot_timing ?? '',
            }));

            console.log('Normalized slots:', normalized);
            setSlotList(normalized);

        } catch (error) {
            console.error('Error fetching data:', error?.response?.data || error?.message || error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const currentDate = new Date(selectedDate);
            const formatted = formatDateToYMD(currentDate);
            console.log('Date picker selectedDate:', selectedDate, 'formatted:', formatted);
            setDate(currentDate);
            setFormattedDate(formatted);
            dateWiseSlotDetails(formatted);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const today = new Date();
            const formattedToday = formatDateToYMD(today);
            console.log('Focus effect requesting date:', formattedToday);
            setTodaysDate(formattedToday);
            setFormattedDate(formattedToday);
            dateWiseSlotDetails(formattedToday);
        }, [])
    );

    const renderSlotItem = ({ item }) => {
        return <SlotBookingCard slot={item} intendedDate={formattedDate} />;
    };

    const minimumDate = new Date();
    const maximumDate = new Date();
    maximumDate.setDate(minimumDate.getDate() + 30);

    return (
        <View style={styles.container}>
            {/* ============header section============= */}
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>Slot Availability</Text>
            </View>
            {/* ============header section end ============= */}

            {/* ============Body section start ============= */}
            <View style={styles.bodyContainer}>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.datePrompt}>Select A Date For Checking Availability</Text>
                </View>

                {/* ============ Date Picker Section================== */}
                <View style={styles.dateInputContainer}>
                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={styles.datePressable}
                    >
                        <View style={styles.datePressableInner}>
                            <View style={styles.dateIconWrap}>
                                <AntDesign name="calendar" size={18} color="#4123d0" />
                            </View>
                            <TextInput value={formattedDate} style={styles.dateTextInput} editable={false} />
                            <AntDesign name="down" size={14} color="#737373" />
                        </View>
                    </Pressable>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showDatePicker}
                        onRequestClose={() => setShowDatePicker(false)}
                    >
                        <View style={styles.datePickerModalOverlay}>
                            <View style={styles.datePickerCard}>
                                <View style={styles.datePickerHeader}>
                                    <Text style={styles.datePickerTitle}>Select a date</Text>
                                    <Text style={styles.datePickerSubtitle}>Choose within the next 30 days</Text>
                                </View>
                                <View style={{ paddingHorizontal: 6, paddingTop: 6 }}>
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        minimumDate={minimumDate}
                                        maximumDate={maximumDate}
                                        onChange={handleDateChange}
                                        style={{ alignSelf: 'center' }}
                                    />
                                </View>
                                <View style={styles.datePickerActions}>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)} style={[styles.actionButton, { backgroundColor: '#f0f0f5' }]}> 
                                        <Text style={[styles.actionButtonText, { color: '#595959' }]}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { setShowDatePicker(false); dateWiseSlotDetails(formattedDate); }} style={[styles.actionButton, { backgroundColor: '#4123d0' }]}> 
                                        <Text style={[styles.actionButtonText, { color: '#fff' }]}>Apply</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                {/* ============ Date Picker Section end ================== */}
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#595959' }}>
                        {todaysDate == formattedDate ? "Status of Today" : "Status of " + formattedDate}

                    </Text>
                </View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#4123d0" style={{ marginTop: 20 }} />
                ) : Array.isArray(slotList) && slotList.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 30, paddingHorizontal: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#737373', textAlign: 'center' }}>No slots available</Text>
                        <Text style={{ marginTop: 8, fontSize: 14, color: '#8c8c8c', textAlign: 'center' }}>
                            No slots are available on {formattedDate}. Please try another date.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={slotList}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderSlotItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.flatListContentContainer}
                    />
                )}
            </View>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        </View>
    );
};

export default DateWiseSlotListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    headerTitleContainer: {
        width: '100%',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0099cc',
    },
    bodyContainer: {
        marginLeft: '2.5%',
        width: '95%',
        flex: 1,
    },
    datePrompt: {
        marginBottom: 5,
        fontSize: 15,
        fontWeight: '600',
        color: '#595959',
    },
    dateInputContainer: {
        borderWidth: 0,
        padding: 0,
        borderRadius: 8,
        marginTop: 8,
        marginBottom: 10,
    },
    datePressable: {
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#f7f7fb',
        borderWidth: 1,
        borderColor: '#e6e6f0',
    },
    datePressableInner: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    dateIconWrap: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#efeefe',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    dateTextInput: {
        marginLeft: 4,
        flex: 1,
        fontWeight: '700',
        color: '#404040'
    },
    flatListContentContainer: {
        paddingBottom: 20,
    },
    datePickerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    datePickerCard: {
        width: '88%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        elevation: 6
    },
    datePickerHeader: {
        paddingHorizontal: 6,
        paddingVertical: 4
    },
    datePickerTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#262626'
    },
    datePickerSubtitle: {
        fontSize: 12,
        color: '#8c8c8c',
        marginTop: 2
    },
    datePickerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 6,
        paddingVertical: 8
    },
    actionButton: {
        height: 36,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '800'
    }
});
