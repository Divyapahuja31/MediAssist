import AddMedicineScreen from "../screens/AddMedicineScreen";
import UploadPrescriptionScreen from "../screens/UploadPrescriptionScreen";
import EmergencyCardScreen from "../screens/EmergencyCardScreen";
import HealthJournalScreen from "../screens/HealthJournalScreen";

<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="AddMedicine" component={AddMedicineScreen} />
  <Stack.Screen name="UploadPrescription" component={UploadPrescriptionScreen} />
  <Stack.Screen name="EmergencyCard" component={EmergencyCardScreen} />
  <Stack.Screen name="HealthJournal" component={HealthJournalScreen} />
</Stack.Navigator>
