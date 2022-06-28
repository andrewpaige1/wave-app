import * as React from 'react';
import { Button, View, Text, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper'
import { useState, useEffect, useContext } from 'react'
import { address } from '../ServerInfo';
import { RegionConext, TokenContext, UserContext, IdContext } from '../Store';
import * as Location from 'expo-location';
import Card from '../components/Card'
import SpotifyWebApi from "spotify-web-api-node";


const spotifyApi = new SpotifyWebApi();

export default function Feed ({ navigation }) {

    const [users, setUsers] = useState([])
    const [region, setRegion] = useContext(RegionConext)
    const [token] = useContext(TokenContext)
    const [username,setUser] = useContext(UserContext)
    const [id, setId] = useContext(IdContext)
    const [songs, setSongs] = useState([])
    spotifyApi.setAccessToken(token);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }
      
            let location = await Location.getCurrentPositionAsync({});
            //console.log(location)


            const requestOptions = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };

            const res = await fetch(`https://api.spotify.com/v1/me`, requestOptions)
            const data = await res.json();
            setId(data.id)
            setUser(data.display_name)

            const requestOptions3 = {
              method: 'POST',
              headers: { 
                'content-type': 'application/json' },
              body: JSON.stringify({ user: data.display_name })
              }

            const res2 = await fetch(`${address}/api/getUser`, requestOptions3)
            const data2 = await res2.json()

            let holdSongs = []
            holdSongs.push(data2.user.songOne)
            holdSongs.push(data2.user.songTwo)
            holdSongs.push(data2.user.songThree)


            let newHolder = []

            for(let i = 0; i < holdSongs.length; i++) {

            const res3 = await fetch(`https://api.spotify.com/v1/tracks/${holdSongs[i]}?market=US`, requestOptions)
            const data3 = await res3.json()
            newHolder.push(data3)
    
            }
           setSongs(newHolder)


          const res4 = await fetch(`${address}/api/users`)
          const data4 = await res4.json()
          setUsers(data4.users)

          const requestOptions1 = {
            method: 'POST',
            headers: { 
              'content-type': 'application/json' },
            body: JSON.stringify({ user: data.display_name, longitude: location.coords.longitude, 
                latitude: location.coords.latitude, id: data.id })
          };
          await fetch(`${address}/api/login`, requestOptions1)


            setRegion(location.coords);
          })();

          
    }, [])

    const playSong = (uri, title) => {
      spotifyApi
      .play({
        uris: [uri],
        position_ms: 50000,
      })
      .then(
        function () {
          console.log("playing: ", title);
        },
        function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log("Something went wrong!", err);
        }
      );
    }

    const Song = ({ title, uri, artist, songUri }) => {
      //console.log("song uri " + songUri)
      return (
      <Pressable onPress={() => playSong(songUri, title)}>
      <Card>
      <View style={{flexDirection: 'row'}}>
      <Image
      style={{width: 50, height: 50}}
      source={{
        uri: uri,
      }}
    />
      <View style={{padding: 10, flexDirection: 'column'}}>
        <Text>{title}</Text>
        <Text>{artist}</Text>
      </View>
 
        </View>
      </Card>
      </Pressable>
      )
    };

    const renderSongs = ({ item }) => (
      <Song title={item.name} uri={item.album.images[0].url} artist={item.album.artists[0].name} songUri={item.uri}/>
    );
    
      

return (
    <View>
      {users.length > 0 && (<Swiper
          cards={users}
          renderCard={(card) => {
              return (
            <Card>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>{card.username}</Text>


                <FlatList
                data={songs}
                renderItem={renderSongs}
                keyExtractor={item => item.id}
              />



            </Card>
                  
              )
          }}
          onSwiped={(cardIndex) => {console.log(cardIndex)}}
          onSwipedAll={() => {console.log('onSwipedAll')}}
          cardIndex={0}
          backgroundColor={'#4FD0E9'}
          stackSize= {3}>
       
      </Swiper>)}
      <Button title="press" onPress={() => console.log(songs[0].uri)} />
    </View>
    )
}


const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
    },
    tinyLogo: {
      width: 100,
      height: 100,
      borderRadius: 100
    }
  });