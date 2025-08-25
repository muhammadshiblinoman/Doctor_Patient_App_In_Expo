// app/home.tsx
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function HomeScreen() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();

  // Responsive columns
  let numColumns = 1;
  if (width >= 1200) numColumns = 4; // laptop/desktop
  else if (width >= 768) numColumns = 3; // tablet
  else numColumns = 1; // mobile

  useEffect(() => {
    const doctorsRef = ref(db, "doctors");
    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const doctorList = Object.values(data);
        setDoctors(doctorList);
      } else setDoctors([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctors...</Text>
      </View>
    );

  const defaultLogo = "https://cdn-icons-png.flaticon.com/512/1077/1077114.png"; // default doctor icon

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Doctors</Text>

      {doctors.length === 0 ? (
        <Text style={styles.noData}>No doctors found</Text>
      ) : (
        <FlatList
          data={doctors}
          numColumns={numColumns}
          key={numColumns} // force re-render on column change
          columnWrapperStyle={numColumns > 1 ? { justifyContent: "space-between" } : undefined}
          keyExtractor={(item: any, index) => item.uid || index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { width: `${100 / numColumns - 2}%` }]}>
              <Image source={{ uri: item.photoURL || defaultLogo }} style={styles.logo} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.text}>🎓 {item.degree}</Text>
                <Text style={styles.text}>🏥 {item.department}</Text>
                <Text style={styles.text}>🏩 {item.hospital}</Text>
              </View>
              <TouchableOpacity
                style={styles.moreBtn}
                onPress={() =>
                  router.push({
                    pathname: "/Home/doctorDetails",
                    params: { uid: item.uid },
                  })
                }
              >
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  logo: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  info: { alignItems: "center" },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  text: { fontSize: 14, color: "#555", marginBottom: 2 },
  moreBtn: {
    marginTop: 8,
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  moreText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  noData: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navBtn: { flex: 1, alignItems: "center" },
  navText: { fontSize: 16, fontWeight: "bold", color: "#007bff" },
});
