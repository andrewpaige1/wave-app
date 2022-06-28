import React, { useState } from 'react'

export const AuthContext = React.createContext(false)
export const TokenContext = React.createContext('')
export const RegionConext = React.createContext({})
export const UserContext = React.createContext('')
export const IdContext = React.createContext('')
export const SongsContext = React.createContext([])
const Store = ({children}) => {

    const [auth, setAuth] = useState(false)
    const [token, setToken] = useState('')
    const [region, setRegion] = useState({})
    const [username, setUsername] = useState('')
    const [id, setId] = useState('')
    const [songs, setSongs] = useState([])
    return (
    <IdContext.Provider value={[id, setId]}>
    <SongsContext.Provider value={[songs, setSongs]}>
    <UserContext.Provider value={[username, setUsername]}>
    <TokenContext.Provider value={[token, setToken]}>
    <AuthContext.Provider value={[auth, setAuth]}>
    <RegionConext.Provider value={[region, setRegion]}>

            {children}
    </RegionConext.Provider>
    </AuthContext.Provider>
    </TokenContext.Provider>
    </UserContext.Provider>
    </SongsContext.Provider>
    </IdContext.Provider>
    )

}

export default Store