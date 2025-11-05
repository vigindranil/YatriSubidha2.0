import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import SvgHomeDesign from '../ToolComponents/SvgHomeDesign';
import { ScrollView } from 'react-native-gesture-handler';
import TopSlidingCardComponent from '../Components/TopSlidingCardComponent';
import MenuListComponent from '../Components/MenuListComponent';
import CustomiseImageSlider from '../ToolComponents/CustomiseImageSlider';
import CustomiseImageSliderSecond from '../ToolComponents/CustomiseImageSliderSecond';
import SvgLowerCurve from '../ToolComponents/SvgLowerCurve';
import MiddleComponentHomeScreenBL from '../Components/MiddleComponentHomeScreenBL';
import AboutYatriSubidha from '../Components/AboutYatriSubidha';
import ColorEffectButton from '../ToolComponents/ColorEffectButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreenBeforeLogin = ({ navigation }) => {
    const screenWidth = Dimensions.get('window').width;

    useFocusEffect(
        useCallback(() => {
            const checkToken = async () => {
                const token = await AsyncStorage.getItem('user_login_token');
                if (token) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'CustomTabNavigator' }],
                    });
                }
            };
            checkToken();
        }, [])
    );
    return (
        <View style={styles.container}>
            <View style={{ marginTop: -10, backgroundColor: '#4123d0', width: '100%' }}></View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.mainContent}>
                <View style={{ position: 'relative', backgroundColor: '#4123d0' }}>
                    <CustomiseImageSliderSecond
                        imageArray={
                            [
                                {
                                    "id": "1",
                                    "imagePath": require('../Images/DemoBanner/one.jpeg'),
                                },
                                {
                                    "id": "2",
                                    "imagePath": require('../Images/DemoBanner/two.jpeg'),
                                },
                                {
                                    "id": "3",
                                    "imagePath": require('../Images/DemoBanner/three.jpeg'),
                                },
                                {
                                    "id": "4",
                                    "imagePath": require('../Images/DemoBanner/four.jpeg'),
                                },

                            ]
                        }
                    />
                    <View style={{
                        position: 'absolute',
                        top: 45,
                        left: 0,
                        right: 0,
                        height: '25%',
                        marginTop: -5,
                        backgroundColor: 'rgba(0, 0, 0, 0.0)'
                    }}>
                        <SvgLowerCurve width={screenWidth} height={190} fillColor="#f2f2f2" stopColor="#f2f2f2" />
                    </View>
                </View>

                <View style={{ marginTop: 30 }}>
                    <MiddleComponentHomeScreenBL />
                </View>

                <View style={{ marginTop: 10 }}>
                    <MenuListComponent />
                </View>
                <View style={{ marginTop: 120 }}>
                    <Text style={{ fontWeight: '700', fontSize: 14, marginLeft: 20, marginBottom: 8, color: '#595959' }}>New in Yatri Subidha</Text>
                    <CustomiseImageSlider
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
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <AboutYatriSubidha />
                </View>

            </ScrollView >
            <View style={{ marginVertical: 10, alignItems: 'center', backgroundColor: '#f2f2f2' }}>
                <ColorEffectButton
                    onPress={() => navigation.navigate('LoginScreenIntro')}
                    btnHeight={60}
                    btnWidth={350}
                    btnTittle={'Get Started'}
                />
            </View>

        </View >

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#f2f2f2'
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
        height: '25%',
        marginTop: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.0)'
    },
});

export default HomeScreenBeforeLogin;
