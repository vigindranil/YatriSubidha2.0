import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Using FontAwesome for icons
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../Redux/userSlice';
import { baseURL } from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';
const items1 = [
    { id: '1', icon: 'car', text: 'Drive' },
    { id: '2', icon: 'history', text: 'My Booking History', routeName: 'MyAllBookingHistory' },
    { id: '3', icon: 'user-plus', text: 'Nominee' },
    { id: '4', icon: 'cogs', text: 'Settings' },
];

const items2 = [
    { id: '1', icon: 'qrcode', text: 'Scan Qr' },
    { id: '2', icon: 'history', text: 'My Activity' },
];

const items3 = [
    { id: '1', icon: 'question-circle', text: 'Help' },
    { id: '2', icon: 'info-circle', text: 'About' },
];

const AccountScreen = ({ navigation }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState();
    const dispatch = useDispatch();
    const { emailRedux, profileImageRedux, nameRedux } = useSelector((state) => state.user);
    // console.log('Account Screen Redux data', emailRedux, profileImageRedux, nameRedux);
    const profileImageUrl = `${baseURL}/uploads/${profileImageRedux}`;
    const handlePress = (route) => {
        navigation.navigate(route);
    };

    const handleLogout = () => {
        setModalVisible(true);
    };

    const confirmLogout = async () => {
        setModalVisible(false);
        await AsyncStorage.removeItem('user_login_token');
        await AsyncStorage.removeItem('user_login_email');
        dispatch(clearUser());
        navigation.reset({
            index: 1,
            routes: [{ name: 'HomeScreenBeforeLogin' }],
        });
    };

    useFocusEffect(
        useCallback(() => {
            const getEmail = async () => {
                const email = await AsyncStorage.getItem('user_login_email');
                setEmail(email);
            };
            getEmail();
        }, [])
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#f0f5f5" }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.profileList}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AccountUserProfileScreen')}
                        style={styles.row}>
                        <Image
                            source={profileImageRedux ? { uri: profileImageUrl } : require("../Images/DemoProfileImage.png")}
                            style={styles.image}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{nameRedux ? nameRedux : 'User'}</Text>
                            <View style={styles.verifiedContainer}>
                                <Text style={{ fontSize: 13 }}>{email}</Text>
                                <Icon name="check-circle" size={16} color="green" style={styles.badge} />
                            </View>
                        </View>
                        <Icon name="chevron-right" size={24} color="#666666" style={styles.arrow} />
                    </TouchableOpacity>
                </View>

                <View style={styles.basicDetails}>
                    {items1.map((item1, index) => (
                        <TouchableOpacity
                            key={item1.id}
                            style={[styles.itemContainer, index === items1.length - 1 && styles.lastItem]}
                            onPress={() => handlePress(item1.routeName)}
                        >
                            <Icon name={item1.icon} size={20} color="#666666" style={styles.itemIcon} />
                            <Text style={styles.itemText}>{item1.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.userActivity}>
                    {items2.map((item2, index) => (
                        <TouchableOpacity
                            key={item2.id}
                            style={[styles.itemContainer, index === items2.length - 1 && styles.lastItem]}
                            onPress={() => handlePress(item2.text)}
                        >
                            <Icon name={item2.icon} size={20} color="#666666" style={styles.itemIcon} />
                            <Text style={styles.itemText}>{item2.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.helpAboutSection}>
                    {items3.map((item3, index) => (
                        <TouchableOpacity
                            key={item3.id}
                            style={[styles.itemContainer, index === items3.length - 1 && styles.lastItem]}
                            onPress={() => handlePress(item3.text)}
                        >
                            <Icon name={item3.icon} size={20} color="#666666" style={styles.itemIcon} />
                            <Text style={styles.itemText}>{item3.text}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Icon name="sign-out" size={20} color="#e60000" style={styles.itemIcon} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <Modal isVisible={isModalVisible}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Logout</Text>
                        <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.modalButtonYes]} onPress={confirmLogout}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalButtonNo]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>App Version - 1.0</Text>
                </View>
            </ScrollView>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        </View>
    );
};

export default AccountScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f0f5f5",
        paddingBottom: 20, // Padding for better visibility of the last items
    },
    profileList: {
        marginTop: 25,
        marginHorizontal: 20,
        width: '89%',
        height: 90,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        borderColor: "#999999",
        borderWidth: 0.4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: '100%',
    },
    image: {
        width: 50,
        height: 50,
        marginLeft: 15,
        borderRadius: 25,
        resizeMode: 'contain'
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 15,
    },
    text: {
        fontSize: 16,
    },
    verifiedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    badge: {
        marginLeft: 5,
    },
    arrow: {
        fontSize: 20,
        marginRight: 5,
    },
    basicDetails: {
        marginTop: 30,
        marginHorizontal: 20,
        width: '89%',
        borderRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        borderColor: "#999999",
        borderWidth: 0.4,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomColor: '#ccc',
    },
    lastItem: {
        borderBottomWidth: 0, // Remove border from the last item
    },
    itemIcon: {
        marginRight: 15,
        backgroundColor: '#e0e0e0', // Background for icons
        padding: 8, // Padding around the icon
        borderRadius: 50, // Circular background
    },
    itemText: {
        color: "#595959",
        fontSize: 16,
    },
    userActivity: {
        marginTop: 30,
        marginHorizontal: 20,
        width: '89%',
        borderRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        borderColor: "#999999",
        borderWidth: 0.4,
    },
    helpAboutSection: {
        marginTop: 30,
        marginHorizontal: 20,
        width: '89%',
        borderRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        borderColor: "#999999",
        borderWidth: 0.4,
    },
    logoutSection: {
        marginTop: 30,
        marginHorizontal: 20,
        width: '89%',
        height: 70,
        borderRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        borderColor: "#999999",
        borderWidth: 0.4,
        paddingVertical: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    logoutText: {
        fontSize: 16,
        color: '#ff1a1a',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#595959'
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 12,
        color: '#666666'
    },
    modalButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        margin: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 4,
    },
    modalButtonYes: {
        backgroundColor: '#2196F3',
    },
    modalButtonNo: {
        backgroundColor: '#FF6347',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    versionContainer: {
        marginTop: 30,
        marginHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    versionText: {
        fontSize: 14,
        color: '#666666',
    },
});
