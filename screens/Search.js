import * as React from 'react';
import { StyleSheet, Text,TextInput, View, Button, Keyboard, FlatList, Image, Pressable } from 'react-native';
import { address } from '../ServerInfo';
import { useState, useContext } from 'react';
import { TokenContext, UserContext } from '../Store';
import Card from '../components/Card';
export default function Search({ route, navigation }) {
    const [query, setQuery] = useState('')
    const [songs, setSongs] = useState([])
    const [token] = useContext(TokenContext)
    const [user] = useContext(UserContext)
    const { songId } = route.params;

    const handleSearch = (text) => {
        setQuery(text)
        
    }

    const handleSubmit = async () => {
        const res = await fetch(`https://api.spotify.com/v1/search?type=track&q=${query}&market=us&limit=10`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const data = await res.json()
        //console.log(data.tracks.items)

        setSongs(data.tracks.items)
    }

    const sendData = async (title, id) => {
        const requestOptions = {
            method: 'POST',
            headers: { 
              'content-type': 'application/json' },
            body: JSON.stringify({ user: user, songPos: songId, songName: title, songId: id})
          };
        const res = await fetch(`${address}/api/addSong`, requestOptions)
        const data = await res.json()
        console.log(data)
    }

    const handleCancel = () => {
        Keyboard.dismiss()
        setQuery('')
      }
      const Item = ({ title, uri, artist, id }) => {
        return (
        <Pressable onPress={() => sendData(title, id)}>
        <Card>
        <View style={{flexDirection: 'row'}}>
        <Image
        style={styles.tinyLogo}
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

      const renderItem = ({ item }) => (
        <Item title={item.name} uri={item.album.images[0].url} artist={item.album.artists[0].name} id={item.id}/>
      );

  return (
    <View style={{flex: 1}}>
    <TextInput autoCorrect={false} placeholder="search" type="text" 
    style={styles.input} onChangeText={text => handleSearch(text)} />

    <View style={{paddingBottom: 10}}>

      <Button title="cancel" onPress={() => handleCancel()}/>
    
    </View>

    <View style={{paddingBottom: 10}}>

      <Button title="search" onPress={() => handleSubmit()}/>
    
    </View>
    <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

    </View>
  );
}

const styles = StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: 'black',
      minWidth: 100,
      marginTop: 10,
      marginBottom: 10,
      marginHorizontal: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 3,
    },
    tinyLogo: {
        width: 50,
        height: 50,
      }
  })