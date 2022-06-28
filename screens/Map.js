import * as React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { IdContext, RegionConext, TokenContext, UserContext } from '../Store';
import { address } from '../ServerInfo';
export default function Map() {

    const [region, setRegion] = useContext(RegionConext)
    const [username] = useContext(UserContext)
    const [id] = useContext(IdContext)



    const handleRegionChange = (event) => {
      setRegion(event.nativeEvent.coordinate)
      const requestOptions1 = {
        method: 'POST',
        headers: { 
          'content-type': 'application/json' },
        body: JSON.stringify({ user: username, longitude: event.nativeEvent.coordinate.longitude, 
          latitude: event.nativeEvent.coordinate.latitude, id: id })
      };
      //console.log(`${address}/api/login`)
      fetch(`${address}/api/login`, requestOptions1)
      .then(res => res.json())
      .then(() => {
        //console.log(data)
        console.log(username)
        console.log('sent')
      })
      .catch(() => {
        console.log('failed 2')
      })
    }

  return (
    <View style={styles.container}>
      <MapView initiaRegion={region} style={styles.map} 
      moveOnMarkerPress={true} onPress={ (event) => handleRegionChange(event)} >
      {region.longitude != undefined && (<MapView.Marker
            coordinate={region}
            title="Current Location"
         />)}
      </MapView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
  },
});