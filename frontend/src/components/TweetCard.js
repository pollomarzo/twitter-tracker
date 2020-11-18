import React from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { Grid, Typography, Avatar } from '@material-ui/core';

const TweetCard = ({ user, timestamp_ms, text }) => {
  const userAvatar = <Avatar src={user.profile_image_url_https} />;
  return (
    <Grid item xs={3}>
      <Card>
        {/* toLocaleDate() doesn't seem to work, don't kno why */}
        <CardHeader
          title={user.name}
          avatar={userAvatar}
          subheader={Date(timestamp_ms).slice(0, 21)}
        />
        <CardContent>
          <Typography variant="body1">{text}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TweetCard;
