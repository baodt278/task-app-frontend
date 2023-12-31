import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  changePasswordUser,
  getUserInfo,
  updateUserInfo,
} from "../../services/user";
import { FontAwesome5 } from "@expo/vector-icons";
import { ToastAlert } from "../../components/ToastAlert";
import Line from "../../components/Line";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [original, setOriginal] = useState();

  const handleChange = async () => {
    const changeData = { oldPassword, newPassword };
    if (!changeData.oldPassword) {
      ToastAlert("error", "Error", "Password is required!");
      return;
    }
    
    if (changeData.oldPassword.length < 8) {
      ToastAlert(
        "error",
        "Error",
        "Password must be at least 8 characters long!"
      );
      return;
    }

    if (!changeData.newPassword) {
      ToastAlert("error", "Error", "New password is required!");
      return;
    }

    if (changeData.newPassword.length < 8) {
      ToastAlert(
        "error",
        "Error",
        "Password must be at least 8 characters long!"
      );
      return;
    }

    if (!rePassword) {
      ToastAlert("error", "Error", "Confirm password is required!");
      return;
    }

    if (rePassword !== changeData.newPassword) {
      ToastAlert("error", "Error", "Confirm password do not match!");
      return;
    }
    try {
      await changePasswordUser(changeData);
      ToastAlert("success", "Success", "Change password success!");
      setIsChange(false);
    } catch (error) {
      ToastAlert("error", "Error", "Wrong password!");
    }
  };

  const handleUpdate = async () => {
    const updateRequest = {
      email,
      fullName,
    };
    const response = await getUserInfo();
    if (updateRequest.email === response.data.email && updateRequest.fullName === response.data.fullName) {
      setIsEditing(false);
      return;
    }

    if (!updateRequest.email) {
      ToastAlert("error", "Error", "Email is required!");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(updateRequest.email)) {
      ToastAlert("error", "Error", "Invalid email format");
      return;
    }

    if (!updateRequest.fullName) {
      ToastAlert("error", "Error", "Name is required!");
      return;
    }

    try {
      await updateUserInfo(updateRequest);
      ToastAlert("success", "Success", "Update info success!");
      setIsEditing(false);
    } catch (error) {
      ToastAlert("error", "Error", "Email already existed!");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserInfo()
        .then((response) => {
          setOriginal(response.data);
          setName(response.data.username);
          setEmail(response.data.email);
          setFullName(response.data.fullName);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    return () => unsubscribe();
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 pt-12 ">
      <View className="flex flex-row items-center justify-between mx-6 ">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center justify-center">
          <FontAwesome5 name="arrow-left" size={20} color="blue" />
          <Text className="ml-3 text-xl font-semibold text-blue-700">
            {name}
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row">
          {!isEditing && (
            <TouchableOpacity
              className="mr-3"
              onPress={() => setIsEditing(true)}>
              <FontAwesome5 name="edit" size={20} color="blue" />
            </TouchableOpacity>
          )}
          {!isChange && (
            <TouchableOpacity
              onPress={() => {
                setIsChange(true);
              }}>
              <FontAwesome5 name="user-shield" size={20} color="blue" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Line />
      <View className="items-center justify-center p-2 m-2">
        <FontAwesome5 name="user-circle" size={100} color="blue" />
      </View>
      <View className="">
        {!isChange && (
          <View className="justify-center p-4 mx-6 mb-6 bg-gray-200 rounded-xl">
            <View className="flex flex-row items-center justify-center m-3">
              <Text className="mx-6 text-base font-semibold">Name</Text>
              {!isEditing && (
                <Text className="px-2 text-base font-semibold w-60">
                  {fullName}
                </Text>
              )}
              {isEditing && (
                <View className="flex flex-row items-center w-56 px-1 mr-4 border-b border-gray-400 bt-g-gray-100">
                  <TextInput
                    className="flex-grow text-base font-semibold "
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              )}
            </View>
            <View className="flex flex-row items-center justify-center my-3 ">
              <Text className="mx-6 text-base font-semibold">Email</Text>
              {!isEditing && (
                <Text className="px-2 text-base font-semibold w-60">
                  {email}
                </Text>
              )}
              {isEditing && (
                <View className="flex flex-row items-center w-56 px-1 mr-4 border-b border-gray-400 bt-g-gray-100">
                  <TextInput
                    className="flex-grow text-base font-semibold "
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              )}
            </View>
            <View className="flex flex-row items-center justify-between my-3">
              {isEditing && (
                <>
                  <TouchableOpacity
                    className="items-center justify-center h-12 px-8 ml-8 bg-blue-700 rounded-xl"
                    onPress={handleUpdate}>
                    <Text className="text-base font-medium text-white ">
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="items-center justify-center h-12 px-6 mr-8 bg-white rounded-xl"
                    onPress={() => {
                      setIsEditing(false);
                      setFullName(original.fullName);
                      setEmail(original.email);
                    }}>
                    <Text className="text-base font-medium text-blue-700 ">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </View>
      {!isChange && <View></View>}
      {isChange && (
        <View className="justify-center p-4 mx-6 bg-gray-200 rounded-xl">
          <View className="mx-4 mb-4">
            <Text className="text-lg font-semibold">Change password</Text>
          </View>
          <View className="flex flex-row items-center w-full h-12 px-4 mb-4 bg-gray-200 border-b border-gray-400">
            <TextInput
              className="flex-grow font-bold"
              placeholder="Old password"
              value={oldPassword}
              secureTextEntry={!showOldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity
              onPress={() => setShowOldPassword(!showOldPassword)}>
              {showOldPassword ? (
                <FontAwesome5 name="eye-slash" size={22} color="blue" />
              ) : (
                <FontAwesome5 name="eye" size={22} color="gray" />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center w-full h-12 px-4 mb-4 bg-gray-200 border-b border-gray-400">
            <TextInput
              className="flex-grow font-bold"
              placeholder="New password"
              value={newPassword}
              secureTextEntry={!showNewPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? (
                <FontAwesome5 name="eye-slash" size={22} color="blue" />
              ) : (
                <FontAwesome5 name="eye" size={22} color="gray" />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center w-full h-12 px-4 mb-4 bg-gray-200 border-b border-gray-400">
            <TextInput
              className="flex-grow font-bold"
              placeholder="Confirm password"
              value={rePassword}
              secureTextEntry={!showRePassword}
              onChangeText={setRePassword}
            />

            <TouchableOpacity
              onPress={() => setShowRePassword(!showRePassword)}>
              {showRePassword ? (
                <FontAwesome5 name="eye-slash" size={22} color="blue" />
              ) : (
                <FontAwesome5 name="eye" size={22} color="gray" />
              )}
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center justify-between my-3">
            <TouchableOpacity
              className="items-center justify-center h-12 px-8 ml-8 bg-blue-700 rounded-xl"
              onPress={handleChange}>
              <Text className="text-base font-medium text-white ">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center h-12 px-6 mr-8 bg-white rounded-xl"
              onPress={() => {setIsChange(false);}}>
              <Text className="text-base font-medium text-blue-700 ">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
