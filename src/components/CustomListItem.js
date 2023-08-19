import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GestureHandlerRootViews, Swipeable } from 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { theme } from '../theme';



const defaultAvatar = require('../../assets/images/Default.png');

export default function CustomListItem({ name, id, createdAt, roomImage }) {

    const navigation = useNavigation()


    return (

        <TouchableOpacity onPress={() => navigation.navigate("Chat", { name, id, roomImage })}>
            <View className=" flex flex-row justify-between items-center  ml-5 mr-5 mt-1 mb-1  p-2 rounded-2xl bg-green-400 ">
                <View className="flex flex-row gap-2 items-center">
                    <View className="rounded-full bg-white" style={{ height: wp(15), width: wp(15) }} >
                        {
                            roomImage
                                ? <Image
                                    style={{ height: wp(15), width: wp(15) }}
                                    source={{ uri: roomImage }} className="rounded-full"
                                />
                                : <Image
                                    style={{ height: wp(15), width: wp(15) }}
                                    source={defaultAvatar} className="rounded-full"
                                />
                        }
                    </View>
                    <Text
                        style={{ color: "white" }}
                        className="text-lg text-gray-900 font-bold">{name}</Text>
                </View>



                <Text
                    style={{ color: "white" }}

                    className="text-sm text-gray-900" >22 Aug</Text>


            </View>

        </TouchableOpacity>
    )
}