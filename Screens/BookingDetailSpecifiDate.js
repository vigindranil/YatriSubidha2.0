import React, { useEffect, useState, useRef } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    View,
    Image,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    Alert,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import axiosConfiguration from "../Axios_BaseUrl_Token_SetUp/axiosConfiguration";
import Feather from '@expo/vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";


const BookingDetailSpecificDate = ({ navigation, route }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const viewRefs = useRef({});

    
    const fetchData = async () => {
        try {
            const { date } = route.params;
            const formattedDate = moment(date).format('YYYY-MM-DD');
            const getEmail = await AsyncStorage.getItem('user_login_email');
            const response = await axiosConfiguration.post(
                "/user/specific-day-booking-details",
                {
                    email: getEmail,
                    date: date
                }
            );
            if (response.data.success) {
                setData(response.data.result);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    useEffect(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    const shareScreenshot = async (productId) => {
        try {
            const ref = viewRefs.current[productId];
            if (!ref) {
                throw new Error("View reference is null or undefined");
            }

            const uri = await captureRef(ref, {
                format: "png",
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert(
                    "Sharing Not Available",
                    "Sharing is not available on this device."
                );
            }
        } catch (error) {
            Alert.alert("Error", "Failed to share screenshot.");
            console.error(error);
        }
    };

    const downloadProductDetails = async (productId) => {
        try {
            const ref = viewRefs.current[productId];
            if (!ref) {
                throw new Error("View reference is null or undefined");
            }

            // Request permissions to access the media library
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission required",
                    "We need permission to save files to your gallery."
                );
                return;
            }

            // Capture the view as an image
            const uri = await captureRef(ref, {
                format: "jpg",
                quality: 1,
            });

            // Save the image to the gallery
            const asset = await MediaLibrary.createAssetAsync(uri);
            if (!asset) {
                throw new Error("Could not create asset");
            }

            Alert.alert(
                "Download successful!",
                "Product details have been saved to your gallery."
            );
        } catch (error) {
            console.error(error);
            Alert.alert(`Download failed!, An error occurred: ${error.message}`);
        }
    };

    const renderItem = ({ item }) => (
        <>
            <View
                style={{
                    borderRadius: 10,
                    marginTop: 17,
                    shadowOpacity: 0.1,
                    marginHorizontal: 15,
                    backgroundColor: '#f2f2f2',
                }}
                ref={(el) => {
                    viewRefs.current[item.id] = el;
                }}
            >
                <LinearGradient
                    colors={["#cce6ff", "#fff", "#ccccff"]}
                    start={{ x: 0.8, y: 0 }}
                    style={{
                        paddingHorizontal: 7,
                        borderRadius: 10,
                        paddingVertical: 10,
                        height: 180,
                        position: 'relative',
                        justifyContent: 'center'
                    }}
                >

                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: '61%',
                            width: 35,
                            height: 20,
                            borderBottomLeftRadius: 35 / 2,
                            borderBottomRightRadius: 35 / 2,
                            backgroundColor: "#f2f2f2",
                        }}
                    >
                    </View>


                    <View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: "#4d4d4d", fontSize: 14, marginLeft: 9, fontWeight: '700' }}> {item.slot_name} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: '2%' }}>
                            <Text style={{ color: "#4d4d4d", fontSize: 13, marginLeft: 9, fontWeight: '600' }}> Serial Number : </Text>
                            <Text style={{ color: "#4d4d4d", fontSize: 12, marginLeft: 9 }}>
                                {item.serial_number}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: "2%", marginTop: '2%' }}>
                            <Text><Ionicons name="person-sharp" size={15} color="#0088cc" /></Text>
                            <Text style={{ color: "#000033", fontSize: 14, marginLeft: 5, fontWeight: '600' }}>
                                {item.name}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                height: "12%",
                                marginTop: '2.5%',
                                borderRadius: 20,
                                width: "43%",
                                alignItems: "center",
                            }}
                        >
                            <AntDesign
                                name="calendar"
                                size={12}
                                color="#59b300"
                                style={{ marginLeft: "5%", marginTop: "1.5%" }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#666666",
                                    marginLeft: "2%",
                                    fontWeight: "500",
                                }}
                            >
                                Date :
                            </Text>
                            <Text style={{ fontSize: 12, color: "#4d0066", marginLeft: "2%", fontWeight: '500' }}>
                                {moment(item.slotBookingDate).format('YYYY-MM-DD')}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                marginTop: 7,
                                borderRadius: 20,
                                width: "43%",
                                alignItems: "center",
                                marginTop: '2.5%'
                            }}
                        >
                            <AntDesign
                                name="clockcircleo"
                                size={12}
                                color="#5c00e6"
                                style={{ marginLeft: "5%" }}
                            />
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#666666",
                                    marginLeft: "2%",
                                    fontWeight: "500",
                                }}
                            >
                                Time :
                            </Text>
                            <Text style={{ fontSize: 12, color: "#002233", marginLeft: "2%", fontWeight: '500' }}>
                                {item.slot_timing}
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            borderRadius: 20,
                            width: "40%",
                            alignItems: "center",
                            marginTop: '2.5%'
                        }}>


                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FontAwesome5
                                    name="passport"
                                    size={12}
                                    color="#b30047"
                                    style={{ marginLeft: "5%" }}
                                />
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: "#666666",
                                        marginLeft: "5%",
                                        fontWeight: '600'
                                    }}
                                >
                                    Passport No :
                                </Text>
                            </View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#4d001f",
                                    marginLeft: "5%",
                                    fontWeight: "500",
                                }}
                            >
                                {item.passportNumber}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderLeftColor: "#e6e6e6",
                            borderLeftWidth: 2,
                            borderStyle: "dashed",
                            position: "absolute",
                            marginTop: "9.5%",
                            marginLeft: "66.5%",
                            height: "75%",
                        }}
                    >
                        <View style={{ height: 90, width: 90, alignItems: "center" }}>

                            <Image
                                source={require("../Images/passport.png")}
                                style={{
                                    marginLeft: "70%",
                                    height: "110%",
                                    width: "83%",
                                    borderRadius: 5,
                                    marginTop: "1%",
                                }}
                            />
                        </View>
                    </View>

                    <View style={{
                        position: "absolute",
                        bottom: 0,
                        left: "61%",
                        width: 35,
                        height: 20,
                        borderTopLeftRadius: 35 / 2,
                        borderTopRightRadius: 35 / 2,
                        backgroundColor: "#f2f2f2",
                    }}
                    ></View>
                </LinearGradient >

            </View>
            <View style={{
                width: "90%",
                marginLeft: "5%",
                alignItems: 'flex-end'
            }}>
                <View style={{ flexDirection: 'row', paddingTop: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => downloadProductDetails(item.id)}
                        style={{ marginRight: 15 }}><Feather name="download" size={20} color="black" /></TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => shareScreenshot(item.id)}
                        style={{ marginRight: 10 }}><Feather name="share-2" size={20} color="black" /></TouchableOpacity>
                </View>
            </View>




        </>
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    return (
        <View style={{ paddingBottom: 20 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={({ id }) => id.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

export default BookingDetailSpecificDate;

const styles = StyleSheet.create({});
