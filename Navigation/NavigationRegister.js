import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../Screens/HomeScreen';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LoginScreen from '../Screens/LoginScreen';
import LoginOTPVerification from '../Screens/LoginOTPVerification';
import DateWiseSlotListScreen from '../Screens/DateWiseSlotListScreen';
import TestRange from '../Screens/TestRange';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../Components/CustomHeader';
import HomeScreenBeforeLogin from '../Screens/HomeScreenBeforeLogin';
import HomeScreenHeader from '../Components/HomeScreenHeader';
import TempPageList from '../Screens/TempPageList';
import SlotBookFormScreen from '../Screens/SlotBookFormScreen';
import LoginScreenIntro from '../Screens/LoginScreenIntro';
import AccountScreen from '../Screens/AccountScreen';
import MyAllBookingHistory from '../Screens/MyAllBookingHistory';
import BookingDetailSpecificDate from '../Screens/BookingDetailSpecifiDate';
import ServiceScreen from '../Screens/ServicesScreen';
import AccountUserProfileScreen from '../Screens/AccountUserProfileScreen';
import SearchScreen from '../Screens/SearchScreen';
import SplashScreen from '../Components/SplashScreen';

const NavigationRegister = () => {

    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    function StackNavigatorBooking({ navigation }) {
        return (
            <Stack.Navigator
                screenOptions={{
                    cardStyleInterpolator: ({ current: { progress } }) => ({
                        cardStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            }),
                            transform: [
                                {
                                    translateX: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1000, 0],
                                    }),
                                },
                            ],
                        },
                    }),
                }}
            >
                <Stack.Screen
                    name='DateWiseSlotListScreen'
                    component={DateWiseSlotListScreen}
                    options={{
                        header: () => <CustomHeader title=" " />
                        // headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='SlotBookFormScreen'
                    component={SlotBookFormScreen}
                    options={{
                        header: () => <CustomHeader title=" " />,
                        tabBarStyle: { display: 'none' }
                    }}
                />
            </Stack.Navigator>
        )
    }

    function StackNavigatorAccount({ navigation }) {
        return (
            <Stack.Navigator
                screenOptions={{
                    cardStyleInterpolator: ({ current: { progress } }) => ({
                        cardStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            }),
                            transform: [
                                {
                                    translateX: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1000, 0],
                                    }),
                                },
                            ],
                        },
                    }),
                }}
            >
                <Stack.Screen
                    name='AccountScreen'
                    component={AccountScreen}
                    options={{
                        header: () => <CustomHeader title=" " />
                        // headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='AccountUserProfileScreen'
                    component={AccountUserProfileScreen}
                    options={{
                        header: () => <CustomHeader title=" " />,
                        //headerShown: false,
                    }}
                />

            </Stack.Navigator>
        )
    }

    function StackNavigator({ navigation }) {
        return (
            <Stack.Navigator
                screenOptions={{
                    cardStyleInterpolator: ({ current: { progress } }) => ({
                        cardStyle: {
                            opacity: progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                            }),
                            transform: [
                                {
                                    translateX: progress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1000, 0],
                                    }),
                                },
                            ],
                        },
                    }),
                }}
            >
                <Stack.Screen name='HomeScreen' component={HomeScreen}
                    options={{
                        title: 'Yatri Subidha',
                        headerBackground: () => (
                            <LinearGradient
                                colors={['#4325da', '#4325da']}
                                style={{ flex: 1 }}
                                start={[0, 0]}
                                end={[0, 1]}
                            />
                        ),
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontSize: 24,
                            fontWeight: '700'

                        },
                    }}
                />

                <Stack.Screen
                    name='LoginOTPVerification'
                    component={LoginOTPVerification}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='MyAllBookingHistory'
                    component={MyAllBookingHistory}
                    options={{
                        header: () => <CustomHeader title=" " />
                        // headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='BookingDetailSpecificDate'
                    component={BookingDetailSpecificDate}
                    options={{
                        header: () => <CustomHeader title=" " />
                        // headerShown: false,
                    }}
                />

                {/* <Stack.Screen
                    name='DateWiseSlotListScreen'
                    component={DateWiseSlotListScreen}
                    options={{
                        header: () => <CustomHeader title=" " />
                        // headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='SlotBookFormScreen'
                    component={SlotBookFormScreen}
                    options={{
                        header: () => <CustomHeader title=" " />,
                        tabBarStyle: { display: 'none' }
                    }}
                /> */}


                <Stack.Screen
                    name='TestRange'
                    component={TestRange}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='TempPageList'
                    component={TempPageList}
                    options={{
                        headerShown: false,
                    }}
                />

            </Stack.Navigator>
        )
    }


    function CustomTabNavigator() {
        return (
            <Tab.Navigator>

                <Tab.Screen name='Main' component={StackNavigator}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarLabelStyle: { color: '#4123d0' },
                        headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (<Entypo name="home" size={24} color="#4123d0" />) : (<AntDesign name="home" size={24} color="#808080" />)
                    }}
                />

                <Tab.Screen name='ServiceScreen'
                    component={ServiceScreen}
                    options={{
                        tabBarLabel: 'Services',
                        tabBarLabelStyle: { color: '#4123d0' },
                        header: () => <CustomHeader title=" " />,
                        // headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (<MaterialIcons name="miscellaneous-services" size={24} color="#4123d0" />) : (<MaterialIcons name="miscellaneous-services" size={24} color="#808080" />)
                    }}
                />

                <Tab.Screen name='StackNavigatorBooking'
                    component={StackNavigatorBooking}
                    options={{
                        tabBarLabel: 'Booking',
                        tabBarLabelStyle: { color: '#4123d0' },
                        // header: () => <CustomHeader title=" " />,
                        headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (<MaterialCommunityIcons name="ticket-confirmation" size={24} color="#4123d0" />) : (<MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#808080" />)
                    }}
                />

                {/* <Tab.Screen name='SearchScreen' component={SearchScreen}
                    options={{
                        tabBarLabel: 'Search',
                        tabBarLabelStyle: { color: '#4123d0' },
                        header: () => <CustomHeader title=" " />,
                        // headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (<Entypo name="magnifying-glass" size={24} color="#4123d0" />) : (<Entypo name="magnifying-glass" size={24} color="#808080" />)
                    }}
                /> */}
                <Tab.Screen name='TempPageList' component={TempPageList}
                    options={{
                        tabBarLabel: 'Search',
                        tabBarLabelStyle: { color: '#4123d0' },
                        header: () => <CustomHeader title=" " />,
                        // headerShown: false,
                        tabBarIcon: ({ focused }) => focused ? (<Entypo name="magnifying-glass" size={24} color="#4123d0" />) : (<Entypo name="magnifying-glass" size={24} color="#808080" />)
                    }}
                />
                <Tab.Screen name='StackNavigatorAccount' component={StackNavigatorAccount}
                    options={{
                        tabBarLabel: 'Account',
                        tabBarLabelStyle: { color: '#4123d0' },
                        tabBarIcon: ({ focused }) => focused ? (<Ionicons name="person-circle" size={24} color="#4123d0" />) : (<Ionicons name="person-circle" size={24} color="#808080" />),
                        // header: () => <CustomHeader title=" " />,
                        headerShown: false,

                    }}
                />
            </Tab.Navigator>
        )

    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='SplashScreen'
                    component={SplashScreen}
                    options={{
                        header: () => <HomeScreenHeader title="Yatri Subidha" />,
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='HomeScreenBeforeLogin'
                    component={HomeScreenBeforeLogin}
                    options={{
                        header: () => <HomeScreenHeader title="Yatri Subidha" />,
                    }}
                />
                <Stack.Screen
                    name='LoginScreen'
                    component={LoginScreen}
                    options={{
                        // header: () => <CustomHeader title=" " />
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name='LoginScreenIntro'
                    component={LoginScreenIntro}
                    options={{
                        // header: () => <CustomHeader title=" " />,
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name='CustomTabNavigator'
                    component={CustomTabNavigator}
                    options={{
                        headerShown: false,
                    }}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationRegister

const styles = StyleSheet.create({})