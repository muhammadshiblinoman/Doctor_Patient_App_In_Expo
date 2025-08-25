// app/hospitalDoctors.tsx
import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function HospitalDoctors() {
  const { hospital } = useLocalSearchParams();
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
        const filtered = Object.values<any>(data).filter(
          (doc) =>
            String(doc.hospital ?? "").trim().toLowerCase() ===
            String(hospital ?? "").trim().toLowerCase()
        );
        setDoctors(filtered);
      } else setDoctors([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [hospital]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctors...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Doctors at {hospital}</Text>

      {doctors.length === 0 ? (
        <Text style={styles.noData}>No doctors found in this hospital</Text>
      ) : (
        <FlatList
          data={doctors}
          numColumns={numColumns}
          key={numColumns} // force re-render on column change
          columnWrapperStyle={numColumns > 1 ? { justifyContent: "space-between" } : undefined}
          keyExtractor={(item: any, index) => item.uid || index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, { width: `${100 / numColumns - 2}%` }]}>
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={styles.image} />
              ) : (
                <View style={styles.iconWrapper}>
                  <Icon name="person-circle-outline" size={70} color="#007bff" />
                </View>
              )}

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>{item.degree}</Text>
              <Text style={styles.text}>{item.department}</Text>
              <Text style={styles.text}>{item.hospital}</Text>

              <TouchableOpacity
                style={styles.moreBtn}
                onPress={() =>
                  router.push({ pathname: "/Home/doctorDetails", params: { uid: item.uid } })
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
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#333" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    elevation: 3,
  },
  image: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  iconWrapper: { marginBottom: 8 },
  name: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  text: { fontSize: 13, color: "#555", textAlign: "center" },
  moreBtn: {
    marginTop: 8,
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  moreText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  noData: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
