import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

export default function DoctorSignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [hospital, setHospital] = useState("");
  const [appointmentTimePlace, setAppointmentTimePlace] = useState("");
  const [degreeOrQualification, setDegreeOrQualification] = useState("");

  const validateInputs = () => {
    if (!name.trim()) return "Name is required.";
    if (!phone.match(/^\d{11}$/)) return "Phone number must be 11 digits.";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!department.trim()) return "Department is required.";
    if (!hospital.trim()) return "Hospital is required.";
    if (!appointmentTimePlace.trim()) return "Appointment time & place is required.";
    if (!degreeOrQualification.trim()) return "Degree or Qualification is required.";
    return null;
  };

  const handleSignup = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, `doctors/${user.uid}`), {
        name,
        phone,
        email,
        department,
        hospital,
        appointmentTimePlace,
        degreeOrQualification,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Doctor account created!");
      router.replace("/screen/login");
    } catch (error) {
      Alert.alert("Signup Error");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Doctor Registration</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={11}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-type your password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your department"
            placeholderTextColor="#888"
            value={department}
            onChangeText={setDepartment}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Hospital</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter hospital name"
            placeholderTextColor="#888"
            value={hospital}
            onChangeText={setHospital}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Appointment Time & Place</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter appointment time & place"
            placeholderTextColor="#888"
            value={appointmentTimePlace}
            onChangeText={setAppointmentTimePlace}
            autoCapitalize="sentences"
          />

          <Text style={styles.label}>Degree / Qualification</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your degree or qualification"
            placeholderTextColor="#888"
            value={degreeOrQualification}
            onChangeText={setDegreeOrQualification}
            autoCapitalize="words"
          />

          <Button title="Register" onPress={handleSignup} />

          <Text
            style={styles.link}
            onPress={() => router.replace("/screen/login")}
          >
            Already have an account? Login
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    marginTop: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 16,
  },
  link: {
    marginTop: 20,
    color: "#007bff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
