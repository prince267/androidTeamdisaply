/*Home Screen With buttons to navigate to different options*/
import React from 'react';
import { View,Alert,Text ,ScrollView} from 'react-native';
import Mybutton from '../components/Mybutton';
import NotifService from '../NotifService';
import Notification from '../notification'
import { openDatabase } from 'react-native-sqlite-storage';
function openCB() {
  console.log("database open");
}
function errorCB(err) {
  alert("error: " + err);
  return false;
}
var db = openDatabase({ name: 'Team_lead.db', createFromLocation: 1 }, openCB, errorCB);
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home Screen",
    //Sets Header text of Status Bar
  };
  constructor(props) {
    super(props)
    this.state={
      count: 0,
      a:0
    }
    this.notif = new NotifService(this.onNotif.bind(this));
    // // this.notif.localNotif();
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.timer = setInterval(() => this._isMounted && this.getData(), 5000)
  }
  Alert
  componentWillUnmount() {
    this._isMounted = false;
  }

  async getData() {
    // this.setState({a:0})
    try{
    let response = await fetch(`https://api.myjson.com/bins/1894wk`);
    let data = await response.json()
    console.log("******* DATA FETCHED *********")
    this.setState({a:0})
      data.MemberActivity.map((item) =>{
      db.transaction((tx)=> {
        tx.executeSql(
          'INSERT INTO MemberActivity (memberId, activitySerialNo, activityDescription,arrivalTime,seenDateTime,activityImage,seenOrUnseen) VALUES (?,?,?,?,?,?,?)',
          [item.memberId, item.activitySerialNo, item.activityDescription, item.arrivalTime,item.seenDateTime,item.activityImage,item.seenOrUnseen],
          (tx, results) => {
            console.log('Results', results);
            if (results.rowsAffected > 0) {
              this.setState({a:this.state.a+1})
              console.log("newdata added");
              console.log("no. of Data :", this.state.a );
              this.notif.localNotif({notifMsg:`New Message From Id ${item.memberId}`,message:item.activityDescription});
            } ;
          }
        );
      });
    })
  }catch(error){
    console.log("failed to fetch data", error);
  }
}

  display(){
    if(this.state.a>0){
      return <Notification/>
    }
    else{
      return null
    }
  }
  render() {
    return (
      <ScrollView>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>
    {this.display()}
        <Mybutton
          title="Team Profile"
          customClick={() => this.props.navigation.navigate('teamProfile')}
        />
        <Mybutton
          title="Seen Messages"
          customClick={() => this.props.navigation.navigate('seenMessages', { seenOrUnSeen: 1 })}
        />
        <Mybutton
          title="Unseen Messages"
          customClick={() => this.props.navigation.navigate('seenMessages', { seenOrUnSeen: 0 })}
        />
      </View>
      </ScrollView>
    );
  }
  onNotif(notif) {
    console.log(notif);
    this.props.navigation.navigate('seenMessages', { seenOrUnSeen: 0 })
  }

  handlePerm(perms) {
    Alert.alert("Permissions", JSON.stringify(perms));
  }
}

