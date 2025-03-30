import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function SignUpPage({ navigation }) {
    return (
        <View style={styles.container}>
            <Button title="sign up" onPress={() => console.log("sign up pressed")} />
            <Button title="To log in click here" onPress={() => navigation.navigate('logIn')} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
