import React, { useContext, useState } from 'react';

const UserContext = React.createContext();
/**
 * authProps = {
    accessToken: res.oauth_token,
    accessTokenSecret: res.oauth_token_secret,
    userId: res.user_id,
    screenName: res.screen_name,
  }
 */
export const UserProvider = ({ children }) => {
  const [authProps, setAuthProps] = useState(undefined);
  const provided = { authProps, setAuthProps };
  return <UserContext.Provider value={provided}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const value = useContext(UserContext);
  if (value === null) {
    throw new Error('useUser is outside of a UserProvider');
  }
  return value;
};
