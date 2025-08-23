// app/home.tsx
import { db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doctorsRef = ref(db, "doctors");
    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const doctorList = Object.values(data);
        setDoctors(doctorList);
      } else {
        setDoctors([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Doctors</Text>

      {doctors.length === 0 ? (
        <Text style={styles.noData}>No doctors found</Text>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item: any, index) => item.uid || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.text}>Degree: {item.degree}</Text>
              <Text style={styles.text}>Department: {item.department}</Text>
              <Text style={styles.text}>Hospital: {item.hospital}</Text>

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

      {/* --- Bottom Nav Bar --- */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Home/(tabs)/home")}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Hospital/hospitals")}>
          <Text style={styles.navText}>Hospital</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn} onPress={() => router.push("/Department/department")}>
          <Text style={styles.navText}>Department</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 3,
  },
  moreBtn: {
    marginTop: 8,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    borderRadius: 8,
  },
  moreText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // --- Bottom Navigation Styles ---
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
