import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider, useCart } from "../context/CartContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { colors } from "../styles/globalStyles";

const queryClient = new QueryClient();

// Screens
import HomeScreen from "../screens/HomeScreen";
import StoreScreen from "../screens/StoreScreen";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MangaDetailScreen from "../screens/MangaDetailScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CartIconWithBadge({ focused, color, size }: any) {
  const { cartItemsCount } = useCart();

  return (
    <View>
      <Ionicons
        name={focused ? "bag" : "bag-outline"}
        size={size}
        color={color}
      />
      {cartItemsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartItemsCount > 99 ? "99+" : cartItemsCount}
          </Text>
        </View>
      )}
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Store") {
            const iconName = focused ? "storefront" : "storefront-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Cart") {
            return (
              <CartIconWithBadge focused={focused} color={color} size={size} />
            );
          } else if (route.name === "Profile") {
            const iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Store"
        component={StoreScreen}
        options={{ title: "Loja" }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Carrinho" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MangaDetail"
              component={MangaDetailScreen}
              options={{
                title: "Detalhes do Mangá",
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
