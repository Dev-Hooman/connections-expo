import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/core';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar'
import { theme } from '../theme'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import ProgressBar from '../components/ProgressBar';

// icons:
import { CameraIcon, BuildingStorefrontIcon, ArrowLeftIcon } from 'react-native-heroicons/outline'


//firebase imports
import {
    collection,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database } from '../../config/firebase';

const roomImage = require('../../assets/images/room.jpg')
const defaultAvatar = require('../../assets/images/Default.png');


export default function AddChatScreen() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [remainingChars, setRemainingChars] = useState(17)

    const isEmpty = !name;

    // image states
    const storage = getStorage();
    const [profilePicture, setProfilePicture] = useState('')
    const [imageName, setImageName] = useState('')
    const [data, setData] = useState('')
    const [percentage, setPercentage] = useState('')
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImageName(`roomImg_${new Date().toISOString()}.jpg`);
                setProfilePicture(Platform.OS === 'ios' ? result.uri.replace('file://', '') : await result.uri);
                setData(result.uri);
                console.log('Profile Picture Link: ', profilePicture);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const uploadProfilePicture = async (uri, name) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed', snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setPercentage(progress.toFixed(2));
            }, error => {
                reject(error);
            }, async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            });
        });
    };

    const handleCreate = async () => {
        setIsLoading(true)
        let imageUrl = null;
        if (profilePicture) {
            const imageName = `profile_picture_${new Date().toISOString()}.jpg`;
            imageUrl = await uploadProfilePicture(profilePicture, imageName);
        }
        addDoc(collection(database, 'chatRooms'), {
            name,
            roomImage: imageUrl,
            createdAt: serverTimestamp(),
        });
        setIsLoading(false)

        Alert.alert("Success", "Room Created 🍿")

        navigation.navigate("Home")
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Create Room",
            titleVisible: false,
            headerStyle: { backgroundColor: "transparent" },
            headerTitleStyle: { color: theme.text },
            headerTransparent: true,

            headerLeft: () => {
                return (

                    <TouchableOpacity

                        onPress={() => navigation.goBack()}
                        style={{ marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.5)' }}
                        className="p-2 rounded-full ml-4"
                    >
                        <ArrowLeftIcon
                            size={wp(7)}
                            color={theme.text}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>
                )
            },
        })
    }, [navigation]);





    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#fff]">
            <StatusBar animated={true} backgroundColor='white' barStyle="dark-content" />

            <View className="flex-1   ">
                <View className="w-32 h-1 rounded-2xl bg-gray-700 absolute top-3  left-28 right-6 " />
                <View className="flex flex-col gap-2 bg-[#F6F7FB] rounded-2xl mt-28 mt-  ml-6 mr-6">

                    <View className="flex flex-row justify-evenly items-center ">
                        <View
                            className="ml-16"
                            style={{
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                            <TouchableOpacity
                                onPress={pickImage}
                            >
                                <Image
                                    className="rounded-full w-[100px] h-[100px]"
                                    source={profilePicture ? { uri: profilePicture } : defaultAvatar}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ position: 'absolute' }}
                                onPress={pickImage}
                            >
                                <View >
                                    <CameraIcon
                                        size={wp(12)}
                                        color={theme.text}
                                        strokeWidth={2}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={{ fontSize: wp(3.5), color: theme.text }}
                            className="m-16">
                            Enter your rooom name and add room picture
                        </Text>
                    </View>
                    <View className={`flex flex-row  items-center  bg-[#F6F7FB] rounded-2xl mb-2  `}>
                        <View className="ml-3">
                            <BuildingStorefrontIcon
                                size={wp(8)}
                                color={theme.text}
                                strokeWidth={2}
                            />
                        </View>
                        <TextInput
                            style={{ fontSize: wp(5), height: wp(15), color: theme.text }}
                            className="bg-[#F6F7FB] rounded-2xl pt-4 pb-4 pl-1 pr-4 w-[240px]"
                            placeholder="Room Name"
                            autoCapitalize="none"
                            autoFocus={true}
                            value={name}
                            onChangeText={(text) => {
                                if (text.length <= 17) {
                                    const charsLeft = 17 - text.length;
                                    setRemainingChars(charsLeft);
                                    setName(text);
                                }
                            }} />

                        <Text className="font-bold" style={{ fontSize: wp(4), color: theme.text, marginLeft: 10 }}>
                            {remainingChars}
                        </Text>

                    </View>

                </View>


                <View className="flex justify-center items-center">


                    {
                        percentage ? (percentage >= 100.0 ? (
                            <Text className="text-green-500 text-xl font-bold">
                                Image Upload completed 🎉
                            </Text>
                        ) : (
                            <>
                                <ProgressBar percentage={percentage} />
                                <Text>Uploading Image {percentage} %</Text>
                            </>
                        )) : (<></>)
                    }
                </View>

                <TouchableOpacity
                    disabled={isEmpty || isLoading}

                    className="rounded-2xl justify-center items-center mt-6 ml-6 mr-6"
                    style={{ backgroundColor: isEmpty || isLoading ? theme.disableButton : theme.button, height: wp(14) }}
                    onPress={handleCreate}
                >
                    {
                        isLoading
                            ? <ActivityIndicator size="large" color="black" />
                            : <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Create</Text>
                    }
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
}

function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}