import * as React from 'react';
import { Button, View, Text, ScrollView, StyleSheet, FlatList, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper'
import { useState, useEffect, useContext } from 'react'
import { address } from '../ServerInfo';
import { RegionConext, TokenContext, UserContext, IdContext } from '../Store';
import * as Location from 'expo-location';
import Card from '../components/Card'

export default function NewFeed ({ navigation }) {
    const [users, setUsers] = useState([])
    const [region, setRegion] = useContext(RegionConext)
    const [token] = useContext(TokenContext)
    const [username,setUser] = useContext(UserContext)
    const [id, setId] = useContext(IdContext)
    const [songs, setSongs] = useState([])
    useEffect(() => {
        const requestOptions = {
            headers: {
                Authorization: `Bearer ${token}`
            },
        };


        fetch(`https://api.spotify.com/v1/me`, requestOptions)
        .then(res => res.json())
        .then(data => {
          //setUri(data.images[0].url)c
          setId(data.id)
          setUser(data.display_name)
  
          fetch(`${address}/api/users`)
          .then(res => res.json())
          .then(data => {

            setUsers(data.users)
          })
          .catch(() => {
            console.log('failed 2')
          })
          





  
          const requestOptions1 = {
              method: 'POST',
              headers: { 
                'content-type': 'application/json' },
              body: JSON.stringify({ user: data.display_name, id: data.id })
            };
            fetch(`${address}/api/onLogin`, requestOptions1)
            .then(res => res.json())
            .then(() => {
              //console.log(data)
          
            })
            .catch((err) => {
              console.log(err)
            })
      
        })
        .catch(err => {
          console.log(err)
        })

        const getUserInfo = async () => {
            const res = await fetch(`${address}/api/${username}`)
            const data = await res.json()
            let holdSongs = []
            holdSongs.push(data.user.songOne)
            holdSongs.push(data.user.songTwo)
            holdSongs.push(data.user.songThree)
           // console.log("holder length " + holdSongs.length)
            let newHolder = []
            const requestOptions = {
              headers: {
                  Authorization: `Bearer ${token}`
              },
          };
            for(let i = 0; i < holdSongs.length; i++) {
              //console.log(holdSongs[i])
              try {
              const res2 = await fetch(`https://api.spotify.com/v1/tracks/${holdSongs[i]}?market=ES`, requestOptions)
              const data2 = await res2.json();
              newHolder.push(data2)
              } catch(error) {
                console.log("err")
              }
              //setSongs(songs => [...songs, data2])
            }
            //console.log(newHolder)
           // console.log("new holder length " + newHolder)
            setSongs(newHolder)
           // console.log("song length " + songs.length)
          }
        
          //()
    
    }, [])





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
        <Button title="press" onPress={() => console.log(users)} />
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
