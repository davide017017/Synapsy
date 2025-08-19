// ─────────────────────────────────────────────────────────────────────────────
// React Navigation: AuthStack + AppTabs (Home • Panoramica • [+] • Liste • Profilo)
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Pressable, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator, BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// ── Screens ─────────────────────────────────────────────────────────────────
import Home from "../screens/Home";
import Panoramica from "../screens/Panoramica";
import QuickAdd from "../screens/QuickAdd";
import Liste from "../screens/Liste";
import Profile from "../screens/Profile";
import Login from "../screens/Login";

// ── Bottone centrale “+” ────────────────────────────────────────────────────
function BigMintAddButton(props: BottomTabBarButtonProps) {
    return (
        <Pressable
            {...props}
            onPress={props.onPress}
            style={({ pressed }) => [
                {
                    justifyContent: "center",
                    alignItems: "center",
                    top: -12,
                    width: 64,
                    height: 64,
                    borderRadius: 999,
                    backgroundColor: "#22c08a",
                    ...(Platform.OS === "ios"
                        ? {
                              shadowColor: "#000",
                              shadowOpacity: 0.25,
                              shadowRadius: 10,
                              shadowOffset: { width: 0, height: 6 },
                          }
                        : { elevation: 6 }),
                    opacity: pressed ? 0.9 : 1,
                },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Aggiungi"
        >
            <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
    );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#22c08a",
                tabBarInactiveTintColor: "#94a3b8",
                tabBarStyle: {
                    backgroundColor: "#0b0f12",
                    borderTopColor: "rgba(255,255,255,0.08)",
                    height: 64,
                    paddingBottom: Platform.OS === "ios" ? 10 : 8,
                    paddingTop: 6,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
                tabBarIcon: ({ color, size, focused }) => {
                    switch (route.name) {
                        case "Home":
                            return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
                        case "Panoramica":
                            return (
                                <Ionicons
                                    name={focused ? "stats-chart" : "stats-chart-outline"}
                                    size={size}
                                    color={color}
                                />
                            );
                        case "Liste":
                            return <Ionicons name={focused ? "list" : "list-outline"} size={size} color={color} />;
                        case "Profilo":
                            return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />;
                        default:
                            return null;
                    }
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ title: "Home" }} />
            <Tab.Screen name="Panoramica" component={Panoramica} options={{ title: "Panoramica" }} />
            <Tab.Screen
                name="QuickAdd"
                component={QuickAdd}
                options={{
                    title: "",
                    tabBarLabel: "",
                    tabBarIcon: () => null,
                    tabBarButton: (props) => <BigMintAddButton {...props} />,
                }}
            />
            <Tab.Screen name="Liste" component={Liste} options={{ title: "Liste" }} />
            <Tab.Screen name="Profilo" component={Profile} options={{ title: "Profilo" }} />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    const { token } = useAuth();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {token ? (
                    <Stack.Screen name="AppTabs" component={AppTabs} />
                ) : (
                    <Stack.Screen name="Login" component={Login} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
