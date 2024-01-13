import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import * as Contacts from 'expo-contacts';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { contacts: [], contactList: [], count: 0 };
  }
  getPhoneNumber = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      for (var i = 0; i < data.length; i++) {
        var name = data[i].name;
        var numbers = data[i].phoneNumbers;
        var object = [name, numbers];
        if (name && numbers) {
          this.setState({ contacts: [...this.state.contacts, object] });
        }
      }
    }
  };
  //For selecting 5 contacts
  saveContacts = ({ item }) => {
    if (this.state.count < 5) {
      //console.log(item[1][0].number)
      this.setState({
        contactList: [...this.state.contactList, item],
      });
      this.setState({ count: this.state.count + 1 });
    } else {
      alert('5 contacts selected!');
    }
  };
  componentDidMount() {
    this.getPhoneNumber();
  }

  render() {
    //console.log(this.state.contactList[0])

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} />
        <View style={{ flex: 1, borderColor: 'cyan', borderWidth: 5 }}>
          <Text style={{ alignSelf: 'center' }}>SELECTED CONTACTS</Text>
          {this.state.contactList.map((data, index) => {
            return (
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'cyan',
                  flex: 1,
                  marginTop: 20,
                  justifyContent: 'center',
                }}>
                {data[0]}
              </Text>
            );
          })}
        </View>

        <View style={{ borderWidth: 5, borderColor: 'cyan', flex: 1 }}>
          <Text style={{ alignSelf: 'center' }}>LIST OF CONTACTS</Text>
          <FlatList
            data={this.state.contacts}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.saveContacts({ item });
                }}
                style={{
                  marginTop: 40,
                  alignSelf: 'center',
                  borderBottomWidth: 2,
                  width: 200,
                }}>
                <Text style={{ alignSelf: 'center' }}>{item[0]}</Text>

                {item[1].map((data, index) => {
                  return <Text>{data.number}</Text>;
                })}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
