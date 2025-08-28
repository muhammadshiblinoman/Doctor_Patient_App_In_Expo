import { auth, db } from "@/firebaseConfig";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useState } from "react";
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

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [hospital, setHospital] = useState("");
  const [degree, setDegree] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [place, setPlace] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD format
  const [loading, setLoading] = useState(false);

  // ✅ calculate age from DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ✅ Input validation
  const validateInputs = () => {
    if (!name.trim()) return "Name is required.";
    if (!phone.match(/^\d{11}$/)) return "Phone number must be 11 digits.";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return "Invalid email format.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!department.trim()) return "Department is required.";
    if (!hospital.trim()) return "Hospital is required.";
    if (!degree.trim()) return "Degree is required.";
    if (!appointmentTime.trim()) return "Appointment Time is required.";
    if (!place.trim()) return "Place is required.";
    if (!registrationNumber.trim()) return "Registration Number is required.";
    if (!dob.trim()) return "Date of Birth is required.";
    return null;
  };

  // ✅ Signup function
  const handleSignup = async () => {
    const errorMessage = validateInputs();
    if (errorMessage) {
      Alert.alert("Validation Error", errorMessage);
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // calculate age from dob
      const age = calculateAge(dob);

      // Store doctor info in Firebase Realtime DB
      await set(ref(db, "doctors/" + user.uid), {
        uid: user.uid,
        name,
        phone,
        email,
        department,
        hospital,
        degree,
        appointmentTime,
        place,
        registrationNumber,
        dob,
        age,
        role: "doctor",
        status: "active",
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!");
      router.replace("/screen/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Doctor Signup</Text>

          {/* Inputs */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>Phone No</Text>
          <TextInput
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={11}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            placeholder="Re-type your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            secureTextEntry
          />

          <Text style={styles.label}>Department</Text>
          <TextInput
            placeholder="Enter department"
            value={department}
            onChangeText={setDepartment}
            style={styles.input}
          />

          <Text style={styles.label}>Hospital</Text>
          <TextInput
            placeholder="Enter hospital name"
            value={hospital}
            onChangeText={setHospital}
            style={styles.input}
          />

          <Text style={styles.label}>Degree</Text>
          <TextInput
            placeholder="Enter degree / qualification"
            value={degree}
            onChangeText={setDegree}
            style={styles.input}
          />

          <Text style={styles.label}>Appointment Time</Text>
          <TextInput
            placeholder="Enter appointment time"
            value={appointmentTime}
            onChangeText={setAppointmentTime}
            style={styles.input}
          />

          <Text style={styles.label}>Place</Text>
          <TextInput
            placeholder="Enter chamber/place"
            value={place}
            onChangeText={setPlace}
            style={styles.input}
          />

          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            placeholder="Enter BMDC Registration Number"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            style={styles.input}
          />

          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            placeholder="YYYY-MM-DD"
            value={dob}
            onChangeText={setDob}
            style={styles.input}
          />

          {/* Signup button */}
          <Button
            title={loading ? "Signing up..." : "Signup"}
            onPress={handleSignup}
            disabled={loading}
          />

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
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 60,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  link: {
    marginTop: 16,
    color: "#007bff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});