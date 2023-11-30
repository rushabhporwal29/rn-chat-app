import { View, Text, Image, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";

import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/userActions";


const LoginScreen = () => {
    const screenWidth = Math.round(Dimensions.get("window").width);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [getEmailValidationStatus, setGetEmailValidationStatus] = useState(false);


    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (getEmailValidationStatus && email !== "") {
            console.log(email, password);
            await signInWithEmailAndPassword(firebaseAuth, email, password)
                .then((userCred) => {
                    if (userCred) {
                        console.log("User Id:", userCred?.user.uid);
                        getDoc(doc(firestoreDB, "users", userCred?.user.uid)).then(
                            (docSnap) => {
                                if (docSnap.exists()) {
                                    console.log("User Data : ", docSnap.data());
                                    dispatch(SET_USER(docSnap.data()));
                                }
                            }
                        );
                    }
                })
                .catch((err) => {
                    console.log("Error : ", err.message);
                    if (err.message.includes("wrong-password")) {
                        setAlert(true);
                        setAlertMessage("Password Mismatch");
                    } else if (err.message.includes("user-not-found")) {
                        setAlert(true);
                        setAlertMessage("User Not Found");
                    } else if(err.message.includes("temporarily disabled ")){
                        setAlert(true);
                        setAlertMessage("Plz Try Again After Some Time");
                    } else {
                        setAlert(true);
                        setAlertMessage("Invalid Credentials");
                    }
                    setInterval(() => {
                        setAlert(false);
                    }, 2000);
                });
        }
    };


    return (
        <ScrollView>
            <View className="flex-1 items-center justify-start">
                <Image
                    source={BGImage}
                    resizeMode="cover"
                    className="h-96"
                    style={{ width: screenWidth }}
                />

                {/* Main View */}
                <View className="w-full h-full bg-white rounded-tl-[90px] -mt-44 items-center justify-start py-6 px-6 space-y06">
                    <Image
                        source={Logo}
                        resizeMode="contain"
                        className="w-16 h-16"
                    />
                    <Text className="py-2 text-primaryText text-xl font-semibold ">Welcome Back!</Text>

                    <View className="w-full flex items-center justify-center">
                        {/* alert */}
                        {alert && (
                            <Text className="text-base text-red-600">{alertMessage}</Text>
                        )}
                        {/* email */}
                        <UserTextInput placeholder="Email" isPass={false} setStateValue={setEmail} setGetEmailValidationStatus={setGetEmailValidationStatus} />

                        {/* password */}
                        <UserTextInput placeholder="Password" isPass={true} setStateValue={setPassword} />

                        {/* Login Button */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
                        >
                            <Text className="py-2 text-white text-xl font-semibold">
                                Sign In
                            </Text>
                        </TouchableOpacity>

                        <View className="w-full py-12 flex-row items-center justify-center space-x-2">
                            <Text className="text-base text-primaryText">
                                Don't have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("SignUpScreen")}
                            >
                                <Text className="text-base font-semibold text-primaryBold">
                                    Create Here
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default LoginScreen;
