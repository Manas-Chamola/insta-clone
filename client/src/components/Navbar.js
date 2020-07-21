import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const Navbar = () => {
  const SearchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetail, setUserDetail] = useState([]);

  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(()=> {
    M.Modal.init(SearchModal.current);
  },[])
  const renderList = () => {
    if (state) {
      return [
        <li key="Search">
        <i data-target="modal1" className="material-icons modal-trigger" style={{color: 'black'}}>search</i>
      </li>,
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
  const fetchUsers= (query) => {
    setSearch(query);
    fetch('/search-users',  {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query
      }),
    }) 
    .then((response) => response.json())
    .then((result) => {
      setUserDetail(result.user);
    })
  }
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

  <div id="modal1" className="modal" ref={SearchModal} style={{color: 'black'}}>
    <div className="modal-content">
    <input
          type="text"
          placeholder="search users"
          value={search}
          onChange={(e) => fetchUsers(e.target.value)}
        /> 
            <ul className="collection">
              {userDetail.map(item=>{
                return <Link key={item._id} to={item._id!==state._id ? '/profile/'+item._id : '/profile'} onClick={()=> {
                  M.Modal.getInstance(SearchModal.current).close();
                  setSearch('');
                }}> <li key={item._id} className="collection-item">{item.email}</li> </Link>
              })}
    </ul>
    </div>   
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=> setSearch('')}>Close</button>
    </div>
  </div>
    </nav>
  );
};

export default Navbar;
