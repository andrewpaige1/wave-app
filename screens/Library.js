import * as React from 'react';
import { Button, View, Text } from 'react-native';


export default function Library ({ navigation }) {

return (
    <View>
        <Text>Library</Text>
        <Button
            title="Go to Profile"
            onPress={() => navigation.navigate('Profile')}
        />
    </View>
    )
}