import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import ProfileScreen from "../screens/user/ProfileScreen";
import TabNavigator from "./TabNavigation";
import { FontAwesome5 } from "@expo/vector-icons";
import CustomDrawer from "../components/CustomDrawer";
import { sendPushNotification } from "../services/notify";
import { getExpoToken, getMessage } from "../services/user";

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "blue",
        drawerActiveTintColor: "white",
        drawerLabelStyle: {
          marginLeft: -10,
          fontSize: 16,
          fontWeight: "bold",
        },
      }}>
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="home" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="user-alt" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
