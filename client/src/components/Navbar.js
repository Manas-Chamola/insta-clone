import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li key="Profile">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="Post">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="Following Post">
          <Link to="/myfollowingpost">Following Post</Link>
        </li>,
        <li key="Logout">
          <button
            className="btn waves-effect waves-light #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              history.push('/signin');
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="Signin">
          <Link to="/signin">Signin</Link>
        </li>,
        <li key="Signup">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? '/' : '/signin'} className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
