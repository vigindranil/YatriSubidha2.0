import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

export default function SvgConcaveTop({ width, height, fillColor, stopColor, leftEndHeight = 140, rightEndHeight = 85 }) {
    const controlPointX = width * .55;
    const controlPointY = height;

    return (
        <View style={{ width, height }}>
            <Svg height={height} width={width} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={fillColor} stopOpacity="1" />
                        <Stop offset="100%" stopColor={stopColor} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Path
                    d={`M0 ${leftEndHeight}
                        Q${controlPointX} ${controlPointY} ${width} ${rightEndHeight}
                        L${width} ${height}
                        L0 ${height}
                        Z`}
                    fill="url(#grad)"
                />
            </Svg>
            {/* Overlay View for Content */}
            <View style={[StyleSheet.absoluteFill, styles.content]} />
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        // Add any styles for overlay content if needed
    },
});
