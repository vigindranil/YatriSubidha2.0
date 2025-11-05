import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DynamicFormTemplateTwo from '../ToolComponents/DynamicFormTemplateTwo'
import CustomiseImageSlider from '../ToolComponents/CustomiseImageSlider'
import HomeScreenMenuCard from '../Components/HomeScreenMenuCard'
import { ScrollView } from 'react-native-gesture-handler'



const HomeScreen = () => {
    return (
        <View style={{ marginTop: 10 }}>
            <ScrollView>
                <CustomiseImageSlider
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
                <View style={{ flexDirection: 'row' }}>
                    <HomeScreenMenuCard
                        cardColorArray={['#0066cc', '#0080ff']}
                        buttonColorArray={['#e6f2ff', '#fff']}
                        buttonTxtColor={'#0073e6'}
                        cardHeight={120}
                        CardTitle={'Departure'}
                    />
                    <HomeScreenMenuCard
                        cardColorArray={['#e6b800', '#ffcc00']}
                        buttonColorArray={['#fffae6', '#fff']}
                        CardTittleColor={'#fff'}
                        buttonTxtColor={'#666666'}
                        cardHeight={120}
                        CardTitle={'Arrival'}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <HomeScreenMenuCard
                        cardColorArray={['#e6b800', '#ffcc00']}
                        buttonColorArray={['#fffae6', '#fff']}
                        buttonTxtColor={'#666666'}
                        cardHeight={120}
                        cardSecondTitle={'Slot Booked Today For'}
                        secondTitleBodyContent={'Departure'}
                        slotQnty={1}
                        slotQntyColor={'#666666'}
                    />
                    <HomeScreenMenuCard
                        cardColorArray={['#0066cc', '#0080ff']}
                        buttonColorArray={['#e6f2ff', '#fff']}
                        buttonTxtColor={'#0073e6'}
                        cardHeight={120}
                        cardSecondTitle={'Slot Booked Today For'}
                        secondTitleBodyContent={'Arrival'}
                        slotQnty={1}
                        slotQntyColor={'#0066cc'}
                    />

                </View>
                <DynamicFormTemplateTwo />
            </ScrollView>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})