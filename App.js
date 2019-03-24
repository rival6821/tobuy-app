import React from 'react';
import { StyleSheet, Text, View, StatusBar,TextInput, Dimensions, Platform } from 'react-native';

const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>ToBuy List</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder={"새로운 살것"}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title:{
    color:"white",
    fontSize:30,
    marginTop:50,
    fontWeight:"200",
    marginBottom:30
  },
  card:{
    backgroundColor : 'white',
    flex:1,
    width : width - 25,
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
    ...Platform.select({
      ios : {
        shadowColor : 'rgb(50,50,50)',
        shadowOpacity : 0.5,
        shadowRadious : 5,
        shadowOffset:{
          height:-1
        }
      },
      android : {
        
      }
    })
  },
  input : {

  }
});
