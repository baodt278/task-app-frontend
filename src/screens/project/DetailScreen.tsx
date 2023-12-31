import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {
  deleteProjectApi,
  getProjectById,
  updateProjectApi,
} from "../../services/project";
import { ToastAlert } from "../../components/ToastAlert";
import Line from "../../components/Line";
import { getUsername } from "../../services/user";

const ProjectDetailScreen = ({ route, navigation }) => {
  const { project } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isStream, SetIsStream] = useState([]);
  const [original, setOriginal] = useState();

  const handleUpdate = async () => {
    const username = await getUsername();
    const newProjectData = {
      name,
      description,
      username,
    };

    if (
      newProjectData.name === project.name &&
      newProjectData.description === project.description
    ) {
      setIsEditing(false);
      return;
    }

    if (!newProjectData.name) {
      ToastAlert("error", "Error", "Name is required!");
      return;
    }
    try {
      await updateProjectApi(project.id, newProjectData);
      ToastAlert("success", "Success", "Update project's detail success!");
      setIsEditing(false);
    } catch (error) {
      ToastAlert("error", "Error", "Something went wrong!");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete the project?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteProjectApi(project.id);
              ToastAlert("success", "Success", "Delete success!");
              navigation.navigate("Project");
            } catch (error) {
              ToastAlert("error", "Error", "Only managers can delete project!");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getProjectById(project.id)
        .then((response) => {
          setOriginal(response.data);
          setName(response.data.name);
          setDescription(response.data.description);
          SetIsStream(response.data.streams);
        })
        .catch((error) => {
          ToastAlert("error", "Error", error);
        });
    });

    return () => unsubscribe();
  }, [navigation]);

  function convertTime(timeString: string) {
    let date = new Date(timeString);
    date.setHours(date.getHours() + 7);
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let monthName = months[monthIndex];

    return `${day < 10 ? "0" : ""}${day} ${monthName} ${year} ${
      hour < 10 ? "0" : ""
    }${hour}:${minute < 10 ? "0" : ""}${minute}`;
  }

  return (
    <SafeAreaView className="flex-1 pt-12">
      <View className="flex flex-row items-center justify-between mx-6 ">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="flex flex-row items-center justify-center">
          <FontAwesome5 name="arrow-left" size={20} color="blue" />
          <Text className="ml-3 text-xl font-semibold text-blue-700">
            {name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("MemberScreen", { project })}
          className="">
          <FontAwesome5 name="user-friends" size={20} color="blue" />
        </TouchableOpacity>
      </View>
      <Line />

      <View className="justify-center p-4 mx-6 mt-2 bg-gray-200 rounded-xl">
        <View className="flex flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-semibold">Detail</Text>
          </View>
          {!isEditing && (
            <View className="flex flex-row">
              <TouchableOpacity
                className="mr-3"
                onPress={() => setIsEditing(true)}>
                <FontAwesome5 name="edit" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <FontAwesome5 name="trash" size={20} color="blue" />
              </TouchableOpacity>
            </View>
          )}
          {isEditing && (
            <View className="flex flex-row">
              <TouchableOpacity className="mr-3" onPress={handleUpdate}>
                <FontAwesome5 name="check" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setIsEditing(false);
                setName(original.name);
                setDescription(original.description);
              }}>
                <FontAwesome name="close" size={22} color="blue" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="p-2 mt-2 bg-gray-100 rounded-xl">
          <Text className="text-base font-semibold ">Project name</Text>
          {!isEditing && <Text className="py-1 text-base ">{name}</Text>}
          {isEditing && (
            <View className="flex flex-row py-1 text-base border-b border-gray-400">
              <TextInput
                className="flex-grow text-base"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}
          <Text className="text-base font-semibold ">Description</Text>
          {!isEditing && <Text className="py-1 text-base">{description}</Text>}
          {isEditing && (
            <View className="flex flex-row py-1 text-base border-b border-gray-400">
              <TextInput
                className="flex-grow text-base"
                value={description}
                onChangeText={setDescription}
              />
            </View>
          )}
        </View>
      </View>

      <View className="justify-center p-4 mx-6 my-3 bg-gray-200 rounded-xl">
        <View className="mb-2">
          <Text className="text-lg font-semibold">Activity Stream</Text>
        </View>
        <FlatList
          data={isStream.reverse()}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 250 }}
          keyExtractor={(stream) => stream.id.toString()}
          renderItem={({ item }) => (
            <View className="flex flex-col px-2 py-1 my-1 bg-gray-100 rounded-lg">
              <View className="flex flex-row">
                <Text className="text-base">{item.message}</Text>
              </View>
              <View className="items-end mt-1">
                <Text className="items-end text-sm text-gray-500">
                  {convertTime(item.time)}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProjectDetailScreen;
