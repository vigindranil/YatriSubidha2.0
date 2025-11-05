import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { baseURL } from '../Axios_BaseUrl_Token_SetUp/axiosConfiguration';

export default function SvgHomeDesign({ width, height, fillColor, stopColor, profileImageRedux, nameRedux }) {
    const leftCurveHeight = height * 0.05; // Adjust the left curvature height as needed
    const rightCurveHeight = height * 0.55; // Adjust the right curvature height as needed
    const curveControlPointX = width * 0.45; // Adjust the control point for the curve's x coordinate
    const curveControlPointY = height * 1.2; // Adjust the control point for the curve's y coordinate
    const profileImageUrl = `${baseURL}/uploads/${profileImageRedux}`;
    return (
        <View style={{ width, height }}>
            <Svg height={height} width={width} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={fillColor} stopOpacity="1" />
                        <Stop offset="100%" stopColor={stopColor} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                {/* Combined Path */}
                <Path
                    d={`M0 0 
                        L${width} 0 
                        L${width} ${height - rightCurveHeight} 
                        Q${curveControlPointX} ${curveControlPointY} 0 ${height - leftCurveHeight} 
                        Z`}
                    fill="url(#grad)"
                />
            </Svg>
            {/* Overlay View for Content */}
            <View style={[StyleSheet.absoluteFill, styles.content]}>
                <View style={{
                    height: 80,
                    // backgroundColor: 'red'
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 15 }}>Welcome {nameRedux ? nameRedux : ""}</Text>
                            <View style={{ width: '78%', marginLeft: 15, marginTop: 5 }}>
                                <Text style={{ fontSize: 11, color: '#fff', fontWeight: '600' }}>Yatri Subidha portal, A Government initiative for international Passenger's (Arrival and Departure) convenience.</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: 20 }}>
                            <Image
                                source={profileImageRedux ? { uri: profileImageUrl } : require('../Images/DemoProfileImage.png')}
                                style={{ height: 60, width: 60, borderRadius: 30, resizeMode: 'contain' }}
                            />
                        </View>
                    </View>

                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {

    },
    text: {
        color: 'white',
        fontSize: 24,
    },
});
