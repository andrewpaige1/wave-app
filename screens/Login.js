import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, ResponseType, useAuthRequest } from 'expo-auth-session';
import { Button, ScrollView} from 'react-native';
import { AuthContext, TokenContext } from '../Store'
import { useContext } from 'react'

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function Login() {
  const [, setAuth] = useContext(AuthContext)
  const [, setToken] = useContext(TokenContext)
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '55522bee05664c1ead7b9265afef59b4',
      scopes: ['user-read-email', 'playlist-modify-public'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      //exp://dv-378.keeperpaige.wavelength.exp.direct:80
      //exp://192.168.200.195:19000
      usePKCE: false,
      redirectUri: makeRedirectUri({
        scheme: 'exp://dv-378.keeperpaige.wavelength.exp.direct:80'
        }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token)
      setAuth(true)
      }
  }, [response]);
  return (
    <ScrollView>
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        }}
    />
    </ScrollView>
  );
}