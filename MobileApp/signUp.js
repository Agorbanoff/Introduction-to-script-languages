import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity } from 'react-native';

export default function SignUpPage({ navigation }) {
    return (
        <View style={styles.outerContainer}>
            <View >
                <SafeAreaView>
                    <Text style={styles.frontText}> Welcome to our app. Make an account and get jacked </Text>
                </SafeAreaView>
            </View> 

            <View style={styles.container}>
                <Button  title="sign up" onPress={() => console.log("sign up pressed")} />
                <Button  title="Log in " onPress={() => navigation.navigate('logIn')} />
                 <StatusBar style="auto" />
            </View>
        </View> 
       
    );
}

const styles = StyleSheet.create({
    frontText: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#00ff00',
        height: '40%',
    },
    outerContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40%', 
    },
    button: {
        color: 'black',
        width: '100%',
        height: '10%',
    }
});