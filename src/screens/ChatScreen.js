import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useCallback
} from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    where
} from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

import { ArrowLeftIcon, CogIcon } from 'react-native-heroicons/outline'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { theme } from '../theme';
const defaultAvatar = require('../../assets/images/Default.png');


export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();

    const { id, name, roomImage } = props.route.params

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
                    >

                        <View
                            style={{ marginLeft: 15, }}
                            className="flex flex-row justify-cneter items-center gap-2 ">
                            <ArrowLeftIcon
                                size={wp(8)}
                                color={theme.text}
                                strokeWidth={2}
                            />

                            {
                                roomImage ? <Image
                                    className="rounded-full"
                                    source={{ uri: roomImage }}
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
                                {name}
                            </Text>
                        </View>
                    </TouchableOpacity>


                )


            },
            headerRight: () => (
                <TouchableOpacity
                    style={{
                        marginRight: 10
                    }}
                    onPress={() => navigation.navigate("back")}
                >
                    <CogIcon

                        size={wp(8)}
                        color={theme.text}
                        strokeWidth={2}


                    />

                </TouchableOpacity>
            )
        });
    }, [navigation]);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'), where('roomId', '==', id));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            console.log('querySnapshot unsusbscribe');
            setMessages(
                querySnapshot.docs.map(doc => ({
                    _id: doc.data()._id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                    roomId: doc.data().roomId
                }))
            );
        });
        return unsubscribe;
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages)
        );

        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
            roomId: id
        });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={false}
            showUserAvatar={false}
            onSend={messages => onSend(messages)}
            messagesContainerStyle={{
                backgroundColor: '#fff'
            }}
            textInputStyle={{
                backgroundColor: '#fff',
                borderRadius: 20,
            }}
            user={{
                _id: auth?.currentUser?.email,
                avatar: auth?.currentUser?.photoURL
            }}
        />

    );
}