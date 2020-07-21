import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Signup from './components/Signup';
import CreatePost from './components/CreatePost';
import SubscribesUserPosts from './components/SubscribesUserPosts';
import Reset from './components/Reset';
import NewPassword from './components/NewPassword';
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'USER', payload: user });
    } else {
      if(!history.location.pathname.startsWith('/reset'))
         history.push('/signin');
    }
  }, []);
  return (
    <Switch>
      <Route path="/profile/:userId" exact component={UserProfile}></Route>
      <Route path="/signin" component={Login}></Route>
      <Route path="/profile" component={Profile}></Route>
      <Route path="/signup" component={Signup}></Route>
      <Route path="/create" component={CreatePost}></Route>
      <Route path="/myfollowingpost" component={SubscribesUserPosts}></Route>
      <Route path="/reset/:token" exact component={NewPassword}></Route>
      <Route path="/reset" component={Reset}></Route>
      <Route path="/" exact component={Home}></Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
