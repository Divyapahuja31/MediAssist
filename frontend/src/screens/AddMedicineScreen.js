import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddMedicineScreen = () => {
  const navigation = useNavigation();
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [everyday, setEveryday] = useState(true);
  const [instructions, setInstructions] = useState("");
  const [reminder, setReminder] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#111" />
        </TouchableOpacity>
        <Text style={styles.heading}>Add New Medicine</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <TextInput
        style={styles.input}
        placeholder="Medicine Name (e.g. Paracetamol)"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <TextInput
        style={styles.input}
        placeholder="Dosage (e.g. 500mg, 1 tablet)"
        value={dosage}
        onChangeText={setDosage}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Everyday / Specific Days</Text>
        <Switch value={everyday} onValueChange={setEveryday} />
      </View>

      <TextInput style={styles.input} placeholder="Times a Day" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Instructions" value={instructions} onChangeText={setInstructions} />

      <View style={styles.row}>
        <Text style={styles.label}>Reminder Schedule</Text>
        <Switch value={reminder} onValueChange={setReminder} />
      </View>

      <TextInput style={styles.input} placeholder="Start Date - End Date" />

      <TouchableOpacity style={styles.button} onPress={() => { navigation.goBack(); }}>
        <Text style={styles.buttonText}>Save Medicine</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7F9FB",
      padding: 20,
    },
  
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
  
    heading: {
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
    },
  
    input: {
      backgroundColor: "#ffffff",
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#dddddd",
    },
  
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      backgroundColor: "#ffffff",
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#dddddd",
    },
  
    label: {
      fontSize: 14,
      fontWeight: "500",
    },
  
    button: {
      backgroundColor: "#4facfe",
      paddingVertical: 15,
      borderRadius: 12,
      marginTop: 20,
      alignItems: "center",
    },
  
    buttonText: {
      color: "#ffffff",
      fontWeight: "700",
      fontSize: 16,
    },
  });
  

export default AddMedicineScreen;
