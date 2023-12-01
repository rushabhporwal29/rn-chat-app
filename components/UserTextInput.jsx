import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const UserTextInput = ({
    placeholder,
    isPass,
    setStateValue,
    setGetEmailValidationStatus,
}) => {
    const [value, setValue] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [icon, setIcon] = useState(null);
    const [isEmailValid, setIsEmailValid] = useState(false);
  

    const handleTextChanged = async (text) => {
        setValue(text);
        // console.log("change: ",text);
        await setStateValue(text);

        if (placeholder === "Email") {
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            const status = emailRegex.test(text);
            setIsEmailValid(status);
            setGetEmailValidationStatus(status);
        }
    }
    useLayoutEffect(() => {
        switch (placeholder) {
          case "Full Name":
            return setIcon("person");
          case "Email":
            return setIcon("email");
          case "Password":
            return setIcon("lock");
        }
      }, []);
    return (
        <View
        className={`border rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 ${
            !isEmailValid && placeholder == "Email" && value.length > 0
            ? "border-red-500"
            : "border-gray-200"
        }`}
        >
            <MaterialIcons name={icon} size={24} color={"#6c6d83"} />
            <TextInput
                className="flex-1 text-base text-primaryText font-semibold -mt-1"
                placeholder={placeholder}
                value={value}
                onChangeText={(value)=>handleTextChanged(value)}
                secureTextEntry={isPass && showPass}
                autoCapitalize="none"
            />

            {isPass && (
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Entypo
                    name={`${showPass ? "eye" : "eye-with-line"}`}
                    size={24}
                    color={"#6c6d83"}
                />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default UserTextInput