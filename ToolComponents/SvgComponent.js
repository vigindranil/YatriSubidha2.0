import * as React from 'react';
import { View, Image } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

export default function SvgComponent({ width, height, fillColor, stopColor }) {
    const curveHeight = height * 1; // Adjust the curvature height as needed
    const curveControlPoint = curveHeight; // Adjust the control point for curve
    return (
        <View style={{ width, height }}>
            <Svg height={height} width={width}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={fillColor} stopOpacity="1" />
                        <Stop offset="100%" stopColor={stopColor} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                {/* Top Rectangle */}
                <Path
                    d={`M0 0 L${width} 0 L${width} ${height - curveHeight} L0 ${height - curveHeight} Z`}
                    fill="url(#grad)"
                />
                {/* Bottom Curve */}
                <Path
                    d={`M0 ${height - curveHeight} Q${width / 2} ${height + curveControlPoint} ${width} ${height - curveHeight} Z`}
                    fill="url(#grad)"
                />
            </Svg>
            {/* Place Image */}
            {/* <View style={{ position: 'absolute', top: height * 0, left: width * 0.5, zIndex: 1 }}>
                <Image
                    source={imageSource}
                    style={{ width: 100, height: 100, resizeMode: 'contain' }} // Adjust width and height as needed
                />
            </View> */}
        </View>
    );
}
