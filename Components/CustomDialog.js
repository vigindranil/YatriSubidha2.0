import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

const CustomDialog = ({ visible, type, title, message, onClose }) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const fadeValue = React.useRef(new Animated.Value(0)).current;
  const bounceValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(bounceValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(bounceValue, {
            toValue: 0,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      scaleValue.setValue(0);
      fadeValue.setValue(0);
      bounceValue.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor = type === "error" ? "#ff4d4d" : "#4CAF50";
  const gradientStart = type === "error" ? "#ff6b6b" : "#66BB6A";
  const gradientEnd = type === "error" ? "#ff4d4d" : "#4CAF50";

  const iconEmoji = type === "error" ? "❌" : "✅";

  return (
    <Modal transparent={true} animationType="none" visible={visible}>
      <Animated.View style={[styles.overlay, { opacity: fadeValue }]}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { scale: scaleValue },
                {
                  translateY: bounceValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Decorative top bar */}
          <View style={[styles.topBar, { backgroundColor: bgColor }]}>
            <View style={styles.topBarDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Icon with pulse animation */}
          <View style={[styles.iconContainer, { backgroundColor: bgColor + "15" }]}>
            <Text style={styles.iconEmoji}>{iconEmoji}</Text>
          </View>

          {/* Content */}
          <Text style={[styles.title, { color: bgColor }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Button with gradient effect */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, { backgroundColor: bgColor }]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>

          {/* Decorative corner elements */}
          <View style={[styles.cornerTopLeft, { borderColor: bgColor }]} />
          <View style={[styles.cornerBottomRight, { borderColor: bgColor }]} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default CustomDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    width: 320,
    paddingTop: 0,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  topBar: {
    width: "120%",
    height: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 15,
  },
  topBarDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: -40,
    backgroundColor: "#f0f0f0",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 120,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 60,
    left: 15,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 5,
    opacity: 0.3,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 5,
    opacity: 0.3,
  },
});