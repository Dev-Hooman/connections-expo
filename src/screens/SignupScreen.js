import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { theme } from '../theme'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EyeSlashIcon, EyeIcon } from 'react-native-heroicons/outline'

const backgroundImage = require('../../assets/images/background.png')

//firebase imports
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../config/firebase'

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [isLoading, setIsloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const isEmpty = !email || !password || !username;

  const showPasswordHandler = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else {
      setShowPassword(false)
    }
  }

  const onHandleSignup = () => {
    setIsloading(true)

    if (email !== '' && password !== '' && username) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          return updateProfile(userCredential.user, {
            displayName: username,
            photoURL: null
          });
        })
        .then(() => {
          setIsloading(false)

          alert('Signup success');
          // You can also access the updated user's profile via auth.currentUser.displayName
        })

        .catch((err) => {
          setIsloading(false)
          alert(err.message)
        });
    }
  };

  return (
    <View className="flex-1 bg-[#fff]">
      <Image source={backgroundImage} className="w-full h-[340px] absolute top-0 resize" />
      <View className="w-full h-[595px] absolute bg-[#fff] bottom-0  rounded-tl-[60px] rounded-tr-[60px]" />
      <SafeAreaView className="flex-1 justify-center mx-[30px] ">
        <View className="mt-20">

          <Text
            style={{ fontSize: wp(10), color: theme.text }}
            className=" font-bold text-center mb-10" >Sign Up</Text>

          <TextInput
            style={{ fontSize: wp(5), height: wp(15), color: theme.text }}
            className="bg-[#F6F7FB] mb-2 rounded-2xl p-4"
            placeholder="Enter Name"
            autoCapitalize="none"

            autoFocus={true}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={{ fontSize: wp(5), height: wp(15), color: theme.text }}
            className="bg-[#F6F7FB] mb-2 rounded-2xl p-4"
            placeholder="Enter email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={false}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />


          <View className="flex flex-row justify-between items-center bg-[#F6F7FB] rounded-2xl mb-2 ">
            <TextInput
              style={{ fontSize: wp(5), height: wp(14), color: theme.text }}
              className="bg-[#F6F7FB]  rounded-2xl pt-4 pb-4 pr-1 pl-4 w-[280px] "
              placeholder="Enter password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={showPassword ? false : true}
              textContentType="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity className="mr-4" onPress={showPasswordHandler}>
              {showPassword ? (

                <EyeIcon
                  size={wp(8)}
                  color={theme.text}
                  strokeWidth={2}
                />
              ) : (
                <EyeSlashIcon
                  size={wp(8)}
                  color={theme.text}
                  strokeWidth={2}
                />)}
            </TouchableOpacity>



          </View>
          <TouchableOpacity
            disabled={isEmpty || isLoading}
            className="rounded-2xl justify-center items-center mt-6"
            style={{ backgroundColor: isEmpty || isLoading ? theme.disableButton : theme.button, height: wp(14) }} onPress={onHandleSignup}>
            {
              isLoading
                ? <ActivityIndicator size="large" color="black" />
                : <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Sign Up</Text>
            }

          </TouchableOpacity>

          <View
            className="mt-6 flex flex-row justify-center items-center"
          >
            <Text className="text-gray-500 font-bold" style={{ fontSize: wp(4) }}>already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="font-bold" style={{ color: theme.text, fontSize: wp(4) }}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}
