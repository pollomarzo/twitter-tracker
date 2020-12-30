import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

import { AUTH } from '../constants';
import { useUser } from '../context/UserContext';
import { useHistory } from 'react-router-dom';

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const Auth = () => {
  const { authProps, setAuthProps } = useUser();
  const history = useHistory();
  const query = useQuery();
  const oauthToken = query.get('oauth_token');
  const oauthVerifier = query.get('oauth_verifier');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestAccess = async () => {
      try {
        const result = await axios.get(AUTH, { params: { oauthToken, oauthVerifier } });
        setAuthProps(result.data);
        history.push('/');
      } catch (err) {
        console.log('handling error');
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
