import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();
  const [showFollow, setShowFollow] = useState(state?!state.following.includes(userId):true);
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch('/follow', {
        method: 'put',
        headers: {
            'Content-type': 'application/json',
          'Authorization': localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
            followId: userId
        })
      })
        .then((res) => res.json())
        .then((result) => {
            dispatch({type:'UPDATE', payload: {
                following: result.following,
                followers: result.followers
            }})
            localStorage.setItem('user', JSON.stringify(result));
            setProfile((prevState)=> {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, result._id]
                    }
                }
            })
            setShowFollow(false);
        });
  }

  const unfollowUser = () => {
    fetch('/unfollow', {
        method: 'put',
        headers: {
            'Content-type': 'application/json',
          'Authorization': localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
            unfollowId: userId
        })
      })
        .then((res) => res.json())
        .then((result) => {
            dispatch({type:'UPDATE', payload: {
                following: result.following,
                followers: result.followers
            }})
            localStorage.setItem('user', JSON.stringify(result));
            setProfile((prevState)=> {
              const newFollowers = prevState.user.followers.filter(item=>item !== result._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollowers
                    }
                }
            })
            setShowFollow(true);
        });
  }
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
                src={userProfile.user.pic}
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
                <h5>{userProfile.user.followers.length} followers</h5>
                <h5>{userProfile.user.following.length} following</h5>
              </div>

              {
                  showFollow?
                  <button style={{margin: '10px'}}
                  className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                  onClick={() => followUser()}
                >
                Follow
                </button>
                  :
                  <button style={{margin: '10px'}}
                  className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                  onClick={() => unfollowUser()}
                >
                Un-Follow
                </button>
              }

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
