import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import BottomNav from "../../ButtonNav/components";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Slot /> 
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
