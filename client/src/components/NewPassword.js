import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const {token}= useParams();

  const postData = () => {
 
    fetch('/new-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' });
        } else {
          M.toast({
            html: data.message,
            classes: '#43a047 green darken-1',
          });
          history.push('/signin');
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #64b5f6 blue lighten-2"
          onClick={() => postData()}
        >
          Change Password
        </button>

      </div>
    </div>
  );
};

export default NewPassword;
