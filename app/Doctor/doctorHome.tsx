// app/Doctor/doctorHome.tsx
import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DoctorHome() {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const doctorRef = ref(db, `doctors/${uid}`);
    const unsubscribe = onValue(doctorRef, (snapshot) => {
      if (snapshot.exists()) {
        setDoctor(snapshot.val());
      } else {
        setDoctor(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (uid: any) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            remove(ref(db, "users/" + uid));
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading your information...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.center}>
        <Text>No information found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{doctor.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{doctor.email}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{doctor.phone}</Text>

        <Text style={styles.label}>Department</Text>
        <Text style={styles.value}>{doctor.department}</Text>

        <Text style={styles.label}>Hospital</Text>
        <Text style={styles.value}>{doctor.hospital}</Text>

        <Text style={styles.label}>Degree</Text>
        <Text style={styles.value}>{doctor.degree}</Text>

        <Text style={styles.label}>Appointment Time</Text>
        <Text style={styles.value}>{doctor.appointmentTime}</Text>

        <Text style={styles.label}>Place</Text>
        <Text style={styles.value}>{doctor.place}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#007bff" }]}
            onPress={() => router.push({ pathname: "/Doctor/editDoctor", params: { uid: auth.currentUser?.uid } })}
          >
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ff4d4f" }]}
            onPress={handleDelete}
          >
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9f9f9", paddingBottom: 80 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#333" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, elevation: 3, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 8 },
  value: { fontSize: 16, color: "#000", marginBottom: 4 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  button: { flex: 1, paddingVertical: 10, borderRadius: 8, marginHorizontal: 4 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
