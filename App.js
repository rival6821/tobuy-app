import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import ToBuy from './ToBuy';
import { AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';
import { isAbsolute } from 'path';

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: "",
    loadedTodos : false,
    toDos : {}
  }

  componentDidMount = () => {
    this._loadTodos();
  }

  render() {
    const { newTodo,loadedTodos, toDos } = this.state;
    if(!loadedTodos){
      return <AppLoading />
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>오늘살것목록</Text>
        <TouchableOpacity onPress={this._onPressTrash}>
            <View style={styles.trash}>
              <Text style={styles.trash}>휴지통</Text>
            </View>
          </TouchableOpacity>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"새로운 살것"} 
            value={newTodo} 
            onChangeText={this._controlNewToDo} 
            placeholderTextColor={'#999'}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this._addTodo}
            underlineColorAndroid={"transparent"}
          />
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(toDos).reverse().map(toDo => 
              <ToBuy key={toDo.id} {...toDo} 
              deleteTodo={this._deleteTodo}
              uncompleteToDo={this._uncompleteToDo}
              completeToDo={this._completeToDo}
              updateToDo={this._updateToDo}/>)}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newTodo: text
    })
  }
  _loadTodos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      this.setState({
        loadedTodos : true,
        toDos : JSON.parse(toDos) || {},
      });
    } catch (error) {
      console.log(error);
    }
  }
  _addTodo = () => {
    const { newTodo } = this.state;
    if(newTodo !== ''){
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObject = {
          [ID] : {
            id : ID,
            isCompleted : false,
            text : newTodo,
            createdAt : Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodo : "",
          toDos : {
            ...prevState.toDos,
            ...newTodoObject
          }
        };
        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  }
  _deleteTodo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }
  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : false,
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }
  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : true,
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            text : text
          }
        }
      }
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  }
  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f23657',
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  trash : {
    position : absolute,

  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25,
  },
  todos : {
    alignItems : 'center',
  }
});
