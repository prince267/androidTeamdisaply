/*Screen to view all the user*/
import React from 'react';
import { FlatList, Text, View, Image, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import styles from './memberdisplayCSS'
//Connction to access the pre-populated user_db.db
function openCB() {
  console.log("database open");
}
function errorCB(err) {
  alert("error: " + err);
  return false;
}
var db = openDatabase({ name: 'Team_lead.db', createFromLocation: 1 }, openCB, errorCB);

export default class memberdisplay extends React.Component {
  static navigationOptions = {
    title: "Member Display",
    //Sets Header text of Status Bar
  };
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      memberId: this.props.navigation.state.params.memberId,
      memberName: this.props.navigation.state.params.memberName
    };
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM teamMembers where memberId=${this.state.memberId}`, [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        console.log(temp);
        this.setState({
          FlatListItems: temp,
        });
      });
    });
  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.2, width: '100%', backgroundColor: '#808080' }} />
    );
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Member Detils</Text>
        <FlatList
          style={{ padding: 10 }}
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.memberId} style={styles.GridViewContainer}>
              <Image
                source={{ uri: item.photoThumb }}
                style={styles.ImageView}
              />
              <Text style={styles.GridViewTextLayout}>Id: {item.memberId}</Text>
              <Text style={styles.GridViewTextLayout}>Name: {item.memberName}</Text>
              <Text style={styles.GridViewTextLayout}>Email Id: {item.emailId}</Text>
              <Text style={styles.GridViewTextLayout}>Phone:  {item.Phone}</Text>

            </View>
          )}
          numColumns={2}
        />
      </View>
    );
  }
}