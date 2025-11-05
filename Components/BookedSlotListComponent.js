import { Pressable, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { Fontisto, Ionicons, AntDesign } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import moment from 'moment';

const BookedSlotListComponent = ({ bookingHistory }) => {
    const [isPressed, setIsPressed] = useState(false);
    const navigation = useNavigation();
    return (
        <View style={{ position: "relative", height: 60, marginBottom: 100 }}>
            <LinearGradient
                colors={["#fff", "#d6f5f5", "#fff"]}
                start={{ x: 0.8, y: 0 }}
                style={{
                    backgroundColor: "#ffffff",
                    marginBottom: "2%",
                    marginTop: "10%",
                    width: "90%",
                    marginLeft: "5%",
                    height: 120,
                    borderRadius: 15,
                    position: "relative"
                }}
            >


                <View style={{
                    flexDirection: "row",
                    borderBottomColor: "#595959",
                    borderBottomWidth: 1.2,
                    borderStyle: "dotted",
                    marginHorizontal: "5%",
                    marginTop: "11%", marginBottom: "1%",
                    paddingBottom: 5,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text > <FontAwesome name="calendar" size={14} color="#008000" /></Text>
                            <Text
                                style={{ color: "#666666", fontSize: 13, fontWeight: '500', marginLeft: 5 }}
                            >Booked On :</Text>
                        </View>
                        <Text
                            style={{ color: "#666666", fontSize: 11, fontWeight: '700', marginLeft: 20 }}
                        >{moment.utc(bookingHistory.slotBookedOnDate).local().format('DD-MMM-YYYY HH:mm:ss')}
                        </Text>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text > <FontAwesome name="calendar" size={14} color="#b37700" /></Text>

                            <Text style={{ color: "#666666", fontSize: 13, fontWeight: '500', marginLeft: 5 }}>
                                Intended Travel Date :
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                            {/* <Text> <AntDesign
                                    name="calendar"
                                    size={13}
                                    color="#00b300"
                                    style={{ marginTop: "3%", }}
                                /></Text> */}
                            <Text
                                style={{ color: "red", fontSize: 11, fontWeight: "700", marginLeft: 20 }}
                            >
                                {moment.utc(bookingHistory.slotBookingDate).local().format('DD-MMM-YYYY')}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: "5%", marginTop: 5 }}>
                    <View>
                        <Text style={{ color: "#666666", fontSize: 12, fontWeight: '500' }}>
                            Total :
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }} >
                        <Text><Ionicons
                            name="person"
                            size={12}
                            color="#cc0000"
                            style={{ marginLeft: "7%", marginTop: "6%", }}
                        /></Text>
                        <Text
                            style={{ color: "#666666", fontSize: 12, fontWeight: '700' }}
                        >
                            {' '}{bookingHistory.total_count}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        right: 15,
                        bottom: 8,
                    }}
                    onPress={() => navigation.navigate("BookingDetailSpecificDate", { date: bookingHistory.slotBookedOnDate })}>
                    <LinearGradient
                        colors={["#ffff00", "#b3b300"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                            width: 100,
                            height: 30,
                            marginTop: 5,
                            flexDirection: "row",
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text style={{ color: "#666666", fontWeight: "700" }}>See More </Text>
                        <AntDesign
                            name="arrowright"
                            size={16}
                            color="#666666"
                            style={{ marginTop: 3 }}
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>


            <LinearGradient
                colors={["#99ccff", "#4123d0"]}
                start={{ x: 1, y: 0 }}
                style={{
                    position: "absolute",
                    backgroundColor: "#ffffff",
                    height: 50,
                    width: 50,
                    borderRadius: 50 / 2,
                    marginLeft: "41%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "4%",
                }}
            >
                <Fontisto
                    name="passport-alt"
                    size={27}
                    color="#fff"
                    style={{ marginLeft: "7%" }}
                />
            </LinearGradient>
        </View>
    );
};

export default BookedSlotListComponent;

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 5,
        height: 70,
        borderWidth: 0.5,
        borderColor: '#666666',
        marginBottom: 10,
    },
    pressed: {
        shadowColor: 'blue',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 6,
    },
    gradient: {
        borderRadius: 5,
        height: '100%',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 35,
    },
    icon: {
        marginLeft: 10,
        marginTop: 5,
    },
    menuTitle: {
        fontSize: 16,
        marginTop: 5,
        marginLeft: 10,
        fontWeight: '600',
    },
    endRow: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginRight: 10,
    },
    peopleIcon: {
        marginRight: 3,
    },
    peopleText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#e60000',
    },
    slotText: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#336699',
    },
});
