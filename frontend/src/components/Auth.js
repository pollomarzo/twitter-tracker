import React, { useEffect } from 'react';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';

import { AUTH } from '../constants';
import { useUser } from '../context/UserContext';

const useQuery = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

const Auth = () => {
  const query = useQuery();
  const oauthToken = query.get('oauth_token');
  const oauthVerifier = query.get('oauth_verifier');

  const { setAuthProps } = useUser();
  const history = useHistory();

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
  }, [oauthToken, oauthVerifier, history, setAuthProps]);

  return (
    <>
      <Grid container justify="center">
        <Typography variant="h3" color="primary">
          You are about to be redirected... Let's hope everything goes well!
        </Typography>
        <CircularProgress />
      </Grid>
    </>
  );
};

export default Auth;
