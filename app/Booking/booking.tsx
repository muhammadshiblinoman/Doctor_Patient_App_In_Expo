import { db } from "@/firebaseConfig";
import { useLocalSearchParams } from "expo-router";
import { push, ref, set } from "firebase/database";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function BookingScreen() {
  const { uid, doctorName } = useLocalSearchParams(); // uid = doctorId
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!patientName || !phone || !age || !reason) {
      Alert.alert("Error", "Please fill all fields before submitting.");
      return;
    }

    try {
      const bookingRef = ref(db, `bookings/${uid}`);
      const newBookingRef = push(bookingRef);

      await set(newBookingRef, {
        patientName,
        phone,
        age,
        reason,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Booking sent to doctor!");
      setPatientName("");
      setPhone("");
      setAge("");
      setReason("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Numeric input filter
  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, ""); // non-numeric remove
    setter(numericValue);
  };

  const allFilled = patientName && phone && age && reason;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Book Appointment with Dr. {doctorName}</Text>

      <TextInput
        placeholder="Patient Name"
        style={styles.input}
        value={patientName}
        onChangeText={setPatientName}
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="numeric"
        value={phone}
        onChangeText={(val) => handleNumericInput(val, setPhone)}
      />
      <TextInput
        placeholder="Age"
        style={styles.input}
        keyboardType="numeric"
        value={age}
        onChangeText={(val) => handleNumericInput(val, setAge)}
      />
      <TextInput
        placeholder="Reason / Illness"
        style={[styles.input, { height: 100 }]}
        multiline
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: allFilled ? "#1e88e5" : "#aaa" }]}
        disabled={!allFilled}
        onPress={handleSubmit}
      >
        <Text style={styles.btnText}>Submit Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#f1f6fa",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1a237e",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
