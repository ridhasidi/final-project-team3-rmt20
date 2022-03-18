import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Gempa from '../screens/Gempa';
import DetailGempa from '../screens/DetailGempa';
import FormGempa from '../components/FormReportGempa';

const Stack = createNativeStackNavigator();

export default function GempaRouter() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Gempa" options={{headerShown: false}}  component={Gempa} />
      <Stack.Screen name="DetailGempa" options={{headerShown: false}}  component={DetailGempa} />
      <Stack.Screen name="FormGempa" options={{headerShown: false}} component={FormGempa} />
    </Stack.Navigator>
  );
}
