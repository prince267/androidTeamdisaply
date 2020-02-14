/*Screen to view all the user*/
import React from 'react';
import { FlatList, Text, View, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import styles from './teamProfileCSS'
function openCB() {
  console.log("database open");
}
function errorCB(err) {
  alert("error: " + err);
  return false;
}
var db = openDatabase({ name: 'Team_lead.db', createFromLocation: 1 }, openCB, errorCB);
//Connction to access the pre-populated user_db.db


export default class teamProfile extends React.Component {
  static navigationOptions = {
    title: "Team Profile",
    //Sets Header text of Status Bar
  };
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    };

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM teamMembers', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        console.log(temp)
        this.setState({
          FlatListItems: temp,
        });
      });
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View >
        <View style={styles.body}>
          {
            this.state.FlatListItems.map((item, index) => (
              <TouchableOpacity
                key={item.memberId}
                //  style = {styles.container}
                onPress={() => navigate('memberdisplay', {
                  memberId: item.memberId
                })}>
                <View style={styles.box}>
                  <Image style={styles.image} source={{ uri: item.photoThumb }} />
                  <Text style={styles.username}>
                    {item.memberName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </View>
      </View>
    );
  }
}
