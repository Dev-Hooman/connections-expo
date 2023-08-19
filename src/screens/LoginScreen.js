import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { StatusBar } from 'expo-status-bar'
import { theme } from '../theme'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EyeSlashIcon, EyeIcon } from 'react-native-heroicons/outline'

const backgroundImage = require('../../assets/images/background.png')

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const [isLoading, setIsloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const isEmpty = !email || !password;

  const showPasswordHandler = () => {
    if (showPassword === false) {
      setShowPassword(true);
    } else {
      setShowPassword(false)
    }
  }

  const handleLogin = () => {
    setIsloading(true)
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setIsloading(false)
          alert("Login Success")
        })
        .catch((err) => {
          setIsloading(false)
          alert(err.message)
        })
    }
  }

  return (

    <View className="flex-1 bg-[#fff]">
  
      <Image source={backgroundImage} className="w-full h-[340px] absolute top-0 resize" />
      <View className="w-full h-[595px] absolute bg-[#fff] bottom-0  rounded-tl-[60px] rounded-tr-[60px]" />
      <SafeAreaView className="flex-1 justify-center mx-[30px]  ">
        <Text
          style={{ fontSize: wp(10), color: theme.text }}
          className=" font-bold text-center mb-10" >Log In</Text>
        <TextInput
          style={{ fontSize: wp(5), height: wp(15), color: theme.text }}
          className="bg-[#F6F7FB] mb-2 rounded-2xl p-4"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
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
          style={{ backgroundColor: isEmpty || isLoading ? theme.disableButton : theme.button, height: wp(14) }} onPress={handleLogin}>
          {
            isLoading
              ? <ActivityIndicator size="large" color="black" />
              : <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}> Log In</Text>
          }

        </TouchableOpacity>

        <View
          className="mt-6 flex flex-row justify-center items-center"
        >
          <Text className="text-gray-500 font-bold" style={{ fontSize: wp(4) }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text className="font-bold" style={{ color: theme.text, fontSize: wp(4) }}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>


  );
}
