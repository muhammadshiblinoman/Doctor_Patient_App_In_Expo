// app/doctorEdit.tsx
import { db } from "@/firebaseConfig";
import { router, useLocalSearchParams } from "expo-router";
import { onValue, ref, update } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DoctorEdit() {
  const { uid } = useLocalSearchParams(); // doctor er unique id
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form values
  const [form, setForm] = useState<any>({
    name: "",
    phone: "",
    email: "",
    degree: "",
    department: "",
    hospital: "",
    chamber: "",
    address: "",
    visitingHours: "",
    registrationNo: "",
    qualification: "",
    location: "",
  });

  useEffect(() => {
    if (!uid) return;
    const docRef = ref(db, `doctors/${uid}`);
    const unsubscribe = onValue(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setDoctor(data);
        setForm(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdate = async () => {
    if (!uid) return;
    try {
      await update(ref(db, `doctors/${uid}`), form);
      Alert.alert("Success", "Doctor profile updated successfully!");
      router.back(); // back to previous page
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading doctor details...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.center}>
        <Text>No doctor found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Doctor Profile</Text>

      {Object.keys(form).map((key) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            value={form[key]}
            onChangeText={(val) => handleChange(key, val)}
            placeholder={`Enter ${key}`}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center", color: "#333" },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "500", color: "#555", marginBottom: 6, textTransform: "capitalize" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  updateBtn: { marginTop: 20, backgroundColor: "#007bff", paddingVertical: 14, borderRadius: 10 },
  updateText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
