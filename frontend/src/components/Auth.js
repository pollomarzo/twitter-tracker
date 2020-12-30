import React, { useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

import { AUTH } from '../constants';
import { useUser } from '../context/UserContext';

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const Auth = () => {
  const oauthToken = query.get('oauth_token');
  const oauthVerifier = query.get('oauth_verifier');

  const { setAuthProps } = useUser();
  const history = useHistory();
  const query = useQuery();

  useEffect(() => {
    const requestAccess = async () => {
      try {
        const result = await axios.get(AUTH, { params: { oauthToken, oauthVerifier } });
        setAuthProps(result.data);
        history.push('/');
      } catch (err) {
        console.error(err);
      }
    };

    requestAccess();
  }, [oauthToken, oauthVerifier]);

  return (
    <div>
      You are about to be redirected... Let's hope everything goes well!
      <CircularProgress />
    </div>
  );
};

export default Auth;
