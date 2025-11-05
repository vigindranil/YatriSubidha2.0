import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import SvgHomeDesign from '../ToolComponents/SvgHomeDesign';
import { ScrollView } from 'react-native-gesture-handler';
import TopSlidingCardComponent from '../Components/TopSlidingCardComponent';
import MenuListComponent from '../Components/MenuListComponent';
import CustomiseImageSlider from '../ToolComponents/CustomiseImageSlider';
import { useSelector } from 'react-redux';


const HomeScreen = ({click}) => {
    const screenWidth = Dimensions.get('window').width;
    const { emailRedux, profileImageRedux, nameRedux } = useSelector((state) => state.user);
    return (
        <View style={styles.container}>
            <ScrollView style={styles.mainContent}>
                <View style={styles.mainContent}>
                    <View style={{ marginTop: 0 }}>
                        <SvgHomeDesign
                            nameRedux={nameRedux}
                            profileImageRedux={profileImageRedux}
                            width={screenWidth} height={180} fillColor="#4325da" stopColor="#4123d0" />
                    </View>
                </View>

                <View style={styles.overlay}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, }}>
                        <Text style={{
                            fontSize: 14, fontWeight: '700',
                            color: '#fff', textAlign: 'left', marginLeft: 20,
                        }}>Our Top Services</Text>
                        <TouchableOpacity style={{
                            marginRight: 15, height: 22, width: 60, borderRadius: 15,
                            backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#4123d0', elevation: 1 }}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TopSlidingCardComponent
                            imgName={require('../Images/cabBooking.jpg')} cardTitle={'Cab Booking'} cardBodyTxt={'Book a Cab Instantly'}
                            firstImgHeight={60} firstImgWidth={75} SecondImgHeight={60} SecondImgWidth={155}
                        />
                        <TopSlidingCardComponent
                            imgName={require('../Images/fastFoodApp.png')} cardTitle={'Meal Booking'} cardBodyTxt={'Book Your Meal!'}
                            firstImgHeight={70} firstImgWidth={70} SecondImgHeight={50} SecondImgWidth={80}
                        />
                        <TopSlidingCardComponent
                            imgName={require('../Images/eCartImg.png')} cardTitle={'E-Cart Service'} cardBodyTxt={'Shop Now!'}
                            firstImgHeight={60} firstImgWidth={60} SecondImgHeight={60} SecondImgWidth={80}
                        />
                        <View style={{ width: 20 }}></View>

                    </ScrollView>
                </View>

                <View style={{ marginTop: 120 }}>
                    <MenuListComponent click={click}/>
                </View>
                <View style={{ marginTop: 120 }}>
                    {/* <Text style={{ fontWeight: '700', fontSize: 14, marginLeft: 20, marginBottom: 8, color: '#595959' }}>New in Yatri Subidha</Text> */}
                    {/* <CustomiseImageSlider
                        imageArray={
                            [
                                {
                                    "id": "1",
                                    "imagePath": require('../Images/DemoBanner/five.jpeg'),
                                },
                                {
                                    "id": "2",
                                    "imagePath": require('../Images/DemoBanner/six.jpeg'),
                                },
                                {
                                    "id": "3",
                                    "imagePath": require('../Images/DemoBanner/seven.jpeg'),
                                },
                                {
                                    "id": "4",
                                    "imagePath": require('../Images/DemoBanner/eight.jpeg'),
                                },

                            ]
                        }
                    /> */}
                </View>
                <View style={{ height: 10 }}>
                </View>
                {/* <View style={{ height: 200 }}>
                </View>
                <View style={{ height: 200 }}>
                </View> */}
            </ScrollView >
        </View >

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#4d0099'
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    overlay: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        height: '25%', // Adjust the height as needed
        marginTop: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.0)'
    },
});

export default HomeScreen;
