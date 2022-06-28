import * as React from 'react';
import { ActivityIndicator, Pressable, FlatList, Image, Text, View, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useContext, useState } from 'react';
import { TokenContext, UserContext } from '../Store';
import Map from './Map'
import Card from '../components/Card'
import { address } from '../ServerInfo';

const Item = ({ title }) => (
    <Card>
      <Text>{title}</Text>
    </Card>
  );

export default function Profile ({ navigation }) {
    const [token] = useContext(TokenContext)
    const [imageUri, setUri] = useState(null)
    const [playlists, setPlaylists] = useState([])
    const [username] = useContext(UserContext)
    const [songs, setSongs] = useState([])
    useEffect(() => {

    /*    const requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`
            },
        };

      fetch(`https://api.spotify.com/v1/me`, requestOptions)
      .then(res => res.json())
      .then(data => {

        setUri(data.images[0].url)
      })



    fetch(`https://api.spotify.com/v1/me/playlists`, requestOptions2)
    .then(res => res.json())
    .then(data => {
    setPlaylists(data.items)
  })*/

  const getUserInfo = async () => {
    const requestOptions = {
      headers: {
          Authorization: `Bearer ${token}`
      },
  };

    const res2 = await fetch(`https://api.spotify.com/v1/me`, requestOptions)
    const data2 = await res2.json()
    setUri(data2.images[0].url)

    const res3 = await fetch(`https://api.spotify.com/v1/me/playlists`, requestOptions)
    const data3 = await res3.json()
    setPlaylists(data3.items)

    const requestOptions3 = {
      method: 'POST',
      headers: { 
        'content-type': 'application/json' },
      body: JSON.stringify({ user: data2.display_name })
      }

    const res = await fetch(`${address}/api/getUser`, requestOptions3)
    const data = await res.json()
    //console.log(data)
    console.log(username)
    let holdSongs = []
    holdSongs.push(data.user.songOne)
    holdSongs.push(data.user.songTwo)
    holdSongs.push(data.user.songThree)
   // console.log("holder length " + holdSongs.length)
    let newHolder = []
    for(let i = 0; i < holdSongs.length; i++) {
      //console.log(holdSongs[i])
      const res2 = await fetch(`https://api.spotify.com/v1/tracks/${holdSongs[i]}?market=US`, requestOptions)
      const data2 = await res2.json();
      //setSongs(songs => [...songs, data2])
      newHolder.push(data2)
    }
   // console.log("new holder length " + newHolder)
    setSongs(newHolder)
   // console.log("song length " + songs.length)
  }

  getUserInfo()

    }, [])

    const renderItem = ({ item }) => (
        <Item title={item.name} />
      );
    
      const Song = ({ title, uri, artist, id }) => {
        return (
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
        )
      };

      const renderSongs = ({ item }) => (
        <Song title={item.name} uri={item.album.images[0].url} artist={item.album.artists[0].name} id={item.id}/>
      );


return (
    <ScrollView>
        <View style={{justifyContent: 'center', flexDirection: 'row', paddingTop: 50}}>
        {imageUri && (<Image
        style={styles.tinyLogo}
        source={{
          uri: imageUri,
        }}
      />)
    }
    </View>

    <View>
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Location</Text>
        </Card>
    </View>

    <View>
        <Map/>
    </View>
    <View>
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Songs</Text>
        </Card>
    </View>

    {songs && (<>
    
    
      <FlatList
        data={songs}
        renderItem={renderSongs}
        keyExtractor={item => item.id}
        horizontal={true}
      />

    
    </>)}

    {songs.length === 0 && (<>
    <View>
      <Pressable onPress={() => navigation.navigate("Search", {
            songId: 1
          })}>
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Add Song</Text>
        </Card>
        </Pressable>
    </View>

    <View>
    <Pressable onPress={() => navigation.navigate("Search", {
            songId: 2
          })}>
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Add Song</Text>
        </Card>
        </Pressable>
    </View>

    <View>
    <Pressable onPress={() => navigation.navigate("Search", {
            songId: 3
          })}>
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Add Song</Text>
        </Card>
        </Pressable>
    </View></>)}

    <View>
        <Card>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>Playlists</Text>
        </Card>
    </View>
    <FlatList
        data={playlists}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
      />
    </ScrollView>
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