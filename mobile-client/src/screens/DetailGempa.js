import react from 'react'
import { View, Text} from 'react-native'
import { Button} from "native-base";

export default function DetailGempa({navigation}) {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>DetailGempa</Text>
      <Button mt="2"
        onPress={() => navigation.navigate('FormGempa')}
      >Report Gempa</Button>
    </View>
  )
}