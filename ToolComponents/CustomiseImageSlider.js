import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
const CustomiseImageSlider = ({ imageArray }) => {

    // ======================================== Carousel Section start =================================================//
    const flatlistRef = useRef();
    const screenWidth = Dimensions.get("window").width;
    const [activeIndex, setActiveIndex] = useState(0);
    //Data for carousel
    const carouselData = imageArray;

    // Render images
    const renderItem = ({ item, index }) => {
        return (
            <View key={index}>
                <Image source={item?.imagePath} style={{ height: 210, width: screenWidth * .98, resizeMode: 'stretch' }} />
            </View>


        )
    }

    // Handle Scroll
    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = scrollPosition / screenWidth;
        const roundIndex = Math.round(index);
        setActiveIndex(roundIndex);
    }

    // Get Item layout
    const getItemLayout = (data, index) => ({
        length: screenWidth,
        offset: screenWidth * index,
        index: index,
    })

    // Render Dot indicators
    const renderDotIndicators = () => {
        return carouselData.map((dot, index) => {
            if (activeIndex === index) {
                return (
                    <View key={index} style={{ backgroundColor: '#0077b3', height: 10, width: 10, borderRadius: 5, marginHorizontal: 5 }}></View>
                )
            }
            return (<View key={index} style={{ backgroundColor: '#cccccc', height: 10, width: 10, borderRadius: 5, marginHorizontal: 5 }}></View>)
        })
    }


    useFocusEffect(
        React.useCallback(() => {

            const intervalId = setInterval(() => {
                // interval logic here               
                if (activeIndex === carouselData.length - 1) {
                    flatlistRef.current.scrollToIndex({
                        index: 0,
                        animation: true
                    });
                } else {
                    flatlistRef.current.scrollToIndex({
                        index: activeIndex + 1,
                        animation: true,
                    });
                }
            }, 4000); // 4 seconds interval

            // Cleanup function
            return () => {
                clearInterval(intervalId); // Clear interval when component unmounts or focus changes
            };
        }, [activeIndex]) // Dependencies for the callback
    );

    // =============================================== Carousel Section end ==================================================//
    return (
        <>
            {/* =========== Carousel Section start========== */}
            <View style={{ marginHorizontal: screenWidth * .02, borderRadius: 15 }}>
                <FlatList data={carouselData} renderItem={renderItem}
                    ref={flatlistRef}
                    keyExtractor={(item) => item.id}
                    getItemLayout={getItemLayout}
                    horizontal={true} pagingEnabled={true}
                    onScroll={handleScroll}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>{renderDotIndicators()}</View>
            </View>
            {/* =========== Carousel Section end ========== */}
        </>
    )
}

export default CustomiseImageSlider

const styles = StyleSheet.create({})