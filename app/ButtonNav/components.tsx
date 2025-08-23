// components/BottomNav.tsx
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Home/(tabs)/home")}>
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Department/department")}>
        <Text style={styles.navText}>Department</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Hospital/hospitals")}>
        <Text style={styles.navText}>Hospital</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navBtn: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
});
