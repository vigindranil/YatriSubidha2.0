
import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
const SlotBookingAcknowledgementCard = ({ item }) => {
    // console.log(item);
    return (
        <>
            <LinearGradient
                colors={["#cce6ff", "#fff", "#ccccff"]}
                start={{ x: 0.8, y: 0 }}
                style={{
                    marginTop: 17,
                    width: "90%",
                    paddingHorizontal: 7,
                    borderRadius: 10,
                    paddingVertical: 10,
                    marginLeft: "5%",
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
        </>
    );
};

export default SlotBookingAcknowledgementCard;

const styles = StyleSheet.create({});
