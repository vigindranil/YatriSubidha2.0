import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const PickUpload = () => {
    const [avatar, setAvatar] = useState(null);
    const [ImageModalVisible, setImageModalVisible] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            setImageModalVisible(false);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
            setImageModalVisible(false);
        }
    };

    const deleteImage = () => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => setAvatar(null) },
            ]
        );
        setImageModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                <Image
                    source={avatar ? { uri: avatar } : require('../image/avtar1.png')}
                    style={styles.avatar}
                />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={ImageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Select an option</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                        <MaterialIcons name="photo-library" size={32} color="black" />
                        <Text>Upload from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
                        <MaterialIcons name="photo-camera" size={32} color="black" />
                        <Text>Take a Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteImage} style={styles.iconButton}>
                        <MaterialIcons name="delete" size={32} color="black" />
                        <Text>Delete Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.closeButton}>
                        <MaterialIcons name="close" size={32} color="black" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default PickUpload

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#000',
        marginBottom: 20,
    },
    modalView: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 50,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
})