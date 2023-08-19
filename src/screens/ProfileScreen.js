import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { theme } from '../theme';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

// icons
import { UserIcon, EnvelopeIcon, ArrowLeftIcon } from 'react-native-heroicons/outline'

import { useAuthProvider } from '../context/AuthContext';

//firebase imports
import { updateProfile } from 'firebase/auth'

const defaultAvatar = require('../../assets/images/Default.png');

export default function ProfileScreen(props) {
    const { user, setUser } = useAuthProvider()
    const navigation = useNavigation()
    const userData = props.route.params

    const [username, setUsername] = useState(userData.displayName)
    const [email, setEmail] = useState(userData.email)

    const [edit, toggleEdit] = useState(false)
    const EditPermission = () =>
        Alert.alert("Edit Profile", 'Are you sure, you want to edit ?', [
            {
                text: 'Yes',
                onPress: () => { toggleEdit(!edit) },
                style: "red"
            },
            { text: 'No', onPress: () => { } },
        ]);

    async function saveUserData() {

        try {
            await updateProfile(user, {
                displayName: username,
            });


            console.log('Profile updated successfully');
            toggleEdit(!edit);
        } catch (error) {
            console.log('Error updating profile:', error);
        }
    };



    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            titleVisible: false,
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: theme.text },
            headerTintColor: "black",
            headerLeft: () => {
                return (

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ marginLeft: 10, backgroundColor: 'rgba(255,255,255,0.5)' }}
                        className="p-2 rounded-full ml-4"
                    >
                        <ArrowLeftIcon
                            size={wp(8)}
                            color={theme.text}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>
                )


            },
            headerRight: () => (
                <>
                    {
                        edit
                            ?
                            <TouchableOpacity onPress={saveUserData} style={{ marginRight: 15 }} >
                                <Text className="font-bold" style={{ fontSize: wp(5), color: theme.button }}>
                                    Save
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={EditPermission} style={{ marginRight: 15 }} >
                                <Text className="font-bold" style={{ fontSize: wp(5), color: theme.button }}>
                                    Edit
                                </Text>
                            </TouchableOpacity  >
                    }
                </>
            ),


        })
    }, [navigation, edit, username, email]);

    return (
        <View className="flex-1 bg-gray-200">

            {/* title */}
            <View className="mx-5  mt-6">
                <Text style={{ color: theme.text }} className="text-3xl font-bold ">Profile</Text>
            </View>

            {/* avatar placement */}
            <View className="flex flex-col justify-center items-center mb-6">
                {
                    userData.photoURL
                        ? <Image
                            className="rounded-full  "
                            source={{ uri: userData.photoURL }}
                            style={{
                                width: wp(30),
                                height: wp(30),
                            }}
                        />
                        : <Image
                            className="rounded-full bg-white "
                            source={defaultAvatar}
                            style={{
                                width: wp(30),
                                height: wp(30),
                            }}
                        />
                }



                <Text
                    style={{ fontSize: wp(4), color: theme.text }}>
                    Profile Picture
                </Text>
            </View>


            {/* sledgee */}
            <ScrollView className="w-full h-[520px] absolute bg-white  bottom-0  rounded-tl-[60px] rounded-tr-[60px]">
                <View className="mt-10 ml-4 mr-4">
                    <View className={`flex flex-row  items-center ${!edit ? "bg-gray-200" : " bg-[#F6F7FB]"}  rounded-2xl mb-2 `}>
                        <View className="ml-3">
                            <UserIcon
                                size={wp(8)}
                                color={theme.text}
                                strokeWidth={2}
                            />
                        </View>
                        <TextInput
                            style={{ fontSize: wp(5), height: wp(15), color: theme.text }}
                            className={`${!edit ? "bg-gray-200" : " bg-[#F6F7FB]"}  rounded-2xl pt-4 pb-4 pl-1 pr-4 w-[310px]`}
                            placeholder="Enter Username"
                            autoFocus={true}
                            value={username}
                            onChangeText={text => setUsername(text)}
                            editable={edit}
                        />

                    </View>
                    <View className={`flex flex-row  items-center ${!edit ? "bg-gray-200" : " bg-[#F6F7FB]"}  rounded-2xl mb-2 `}>
                        <View className="ml-3">
                            <EnvelopeIcon
                                size={wp(8)}
                                color={theme.text}
                                strokeWidth={2}
                            />
                        </View>

                        <TextInput
                            style={{ fontSize: wp(5), height: wp(15), color: theme.text }}
                            className={`${!edit ? "bg-gray-200" : " bg-[#F6F7FB]"}  rounded-2xl pt-4 pb-4 pl-1 pr-4 w-[310px]`}
                            placeholder="Enter email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoFocus={false}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            editable={edit}
                        />

                    </View>
                </View>
            </ScrollView>

        </View>
    )
}