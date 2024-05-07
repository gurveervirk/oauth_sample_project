import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useReducer, useState, createContext, useContext, useCallback } from 'react'
import Callback from './Callback'
import Login from './Login'
import Layout from './Layout'

// Counter context
const CounterContext = createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { count: action.count, mycount: action.mycount};
    case 'INCREMENT':
      return { count: state.count + 1, mycount: state.mycount};
    case 'DECREMENT':
      return { count: state.count - 1, mycount: state.mycount};
    case 'MY_INCREMENT':
      return { mycount: state.mycount + 1, count: state.count };
    case 'MY_DECREMENT':
      return { mycount: state.mycount - 1, count: state.count };
    default:
      return state;
  }
};

// Ensures cookie is sent
axios.defaults.withCredentials = true

const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null)
  const [user, setUser] = useState(null)

  const checkLoginState = useCallback(async () => {
    try {
      const {
        data: { loggedIn: logged_in, user }
      } = await axios.get(`http://localhost:5000/auth/logged_in`)
      setLoggedIn(logged_in)
      user && setUser(user)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    checkLoginState()
  }, [checkLoginState])

  return <AuthContext.Provider value={{ loggedIn, checkLoginState, user }}>{children}</AuthContext.Provider>
}

const Home = () => {  
  const { loggedIn } = useContext(AuthContext); 
  if (loggedIn === true) return <Layout AuthContext={AuthContext} CounterContext={CounterContext} />
  if (loggedIn === false) return <Login />
  return <></>
}

const router = createBrowserRouter([
  {
    path: '/*',
    element: <Home />,
  },
  {
    path: '/callback', // google will redirect here
    element: <Callback AuthContext={AuthContext} />,
  },
])


function App() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, mycount: 0 });
  return (
    <>
      <CounterContext.Provider value={{ state, dispatch }}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      </CounterContext.Provider>
    </>
  )
}

export default App
