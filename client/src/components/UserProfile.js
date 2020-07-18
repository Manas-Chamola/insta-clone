import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  console.log('User id is',userId)
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfile(result);
      });
  }, []);
  return (
      <>
      {
          userProfile?
          <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '18px 0',
              borderBottom: '1px solid grey',
            }}
          >
            <div>
              <img
                style={{ width: '160px', height: '160px', borderRadius: '80px' }}
                src="https://images.unsplash.com/photo-1547624643-3bf761b09502?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                alt="Person"
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h4>{userProfile.user.email}</h4>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h5>{userProfile.posts.length} posts</h5>
                <h5>40 followers</h5>
                <h5>40 following</h5>
              </div>
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
          :
          <h2>Loading!...</h2>
      }
    </>
  );
};

export default Profile;
