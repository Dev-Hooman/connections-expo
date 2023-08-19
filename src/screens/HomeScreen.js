import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert, TextInput, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import { MagnifyingGlassIcon, ChatBubbleBottomCenterTextIcon, ArrowLeftOnRectangleIcon } from 'react-native-heroicons/outline'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// context import
import { useAuthProvider } from "../context/AuthContext";

// firebase import
import { signOut } from "@firebase/auth";
import { auth, database } from "../../config/firebase";
import CustomListItem from "../components/CustomListItem";
import {
    collection,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';

const defaultAvatar = require('../../assets/images/Default.png');

const HomeScreen = () => {
    const { user } = useAuthProvider()

    const LogoutPermission = () =>
        Alert.alert("Logout", 'Are you sure, you want to logout ?', [
            {
                text: 'Yes',
                onPress: () => signOut(auth),
                style: "red"
            },
            { text: 'No', onPress: () => console.log('OK Pressed') },
        ]);

    const navigation = useNavigation();

    const [rooms, setRooms] = useState([])
    const [search, setSearch] = useState("")
    const [filteredRooms, setFilteredRooms] = useState(rooms);


    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chatRooms');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, querySnapshot => {
            setRooms(
                querySnapshot.docs.map(doc => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt,
                    name: doc.data().name,
                    roomImage: doc.data().roomImage
                }))
            );
        });
        return unsubscribe;

    }, [])


    useEffect(() => {
        navigation.setOptions({
            title: "",
            titleVisible: false,
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: { color: theme.text },
            headerTintColor: "black",

            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Profile", { displayName: user.displayName, photoURL: user.photoURL, email: user.email })}
                >

                    <View
                        style={{ marginLeft: 15, }}
                        className="flex flex-row justify-cneter items-center gap-2 ">
                        {
                            user.photoURL ? <Image
                                className="rounded-full"
                                source={{ uri: user.photoURL }}
                                style={{
                                    width: 38,
                                    height: 38,
                                }}
                            /> :
                                <Image
                                    className="rounded-full"
                                    source={defaultAvatar}
                                    style={{
                                        width: 38,
                                        height: 38,
                                    }}
                                />
                        }

                        <Text
                            style={{ color: theme.text }}
                            className="font-bold text-lg">
                            {user.displayName}
                        </Text>
                    </View>
                </TouchableOpacity>


            ),
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 15 }} onPress={LogoutPermission}>
                    <ArrowLeftOnRectangleIcon
                        size={wp(8)}
                        color={theme.text}
                        strokeWidth={2}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        if (search === "") {
            setFilteredRooms(rooms); // Reset filtered rooms if search query is empty
        } else {
            const filtered = rooms.filter(room =>
                room.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredRooms(filtered);
        }
    }, [search, rooms]);

    return (
        <View className="flex-1 bg-gray-200">

            <StatusBar animated={true} backgroundColor='white' barStyle="dark-content" />

            {/* Search bar */}
            <View className="mx-5 mb-4 mt-6">
                <Text style={{ color: theme.text }} className="text-3xl font-bold ">Welcome to Chats!</Text>
            </View>

            <View className="mx-5 mb-4 mt-6">
                <View
                    className="flex-row items-center bg-white rounded-full space-x-2 pl-6">
                    <MagnifyingGlassIcon size={20} strokeWidth={3} color={theme.text} />
                    <TextInput
                        style={{ color: theme.text }}
                        placeholder='Search Rooms'
                        placeholderTextColor="gray"
                        className="flex-1 text-base mb-1 h-12 pl-1 tracking-wider"
                        value={search}
                        onChangeText={(text) => setSearch(text)}
                    />
                </View>
            </View>

            <ScrollView className="w-full h-[550px] absolute bg-white  bottom-0  rounded-tl-[60px] rounded-tr-[60px]">
                <View className="mt-10">
                    {filteredRooms.length === 0 ? (
                        <Text style={{
                            textAlign: 'center',
                            color: 'gray',
                            fontSize: 18,
                            marginTop: 20,
                        }}>No Rooms found.</Text>
                    ) : (
                        filteredRooms.map(({ name, _id, createdAt, roomImage },index) => (
                            <CustomListItem
                                key={_id}
                                name={name}
                                roomImage={roomImage}
                                id={_id}
                                createdAt={createdAt}
                                index={index}
                            />
                        ))
                    )}
                </View>
            </ScrollView>


            {/* New room */}
            <View
                className="absolute bottom-0 right-0 "
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddChat")}
                    style={
                        {
                            backgroundColor: theme.text,
                            height: wp(15),
                            width: wp(15),
                            shadowColor: "gray",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: .9,
                            shadowRadius: 8,
                        }}
                    className="justify-center items-center shadow-lg rounded-full mr-[20px] mb-[50px]"

                >
                    <ChatBubbleBottomCenterTextIcon
                        size={wp(6)}
                        color="white"
                        strokeWidth={2.5}
                    />
                </TouchableOpacity>


            </View>

        </View>

    );
};

export default HomeScreen;