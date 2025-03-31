    import { StatusBar } from 'expo-status-bar';
    import { StyleSheet, Text, View, Button } from 'react-native';

    export default function LogInPage({ navigation }) {
        return (
            <View style={styles.container}>
                <Button title="Log In " onPress={() => console.log("log in pressed")} />
                <Button title="sign up" onPress={() => navigation.navigate('signUp')} />
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
