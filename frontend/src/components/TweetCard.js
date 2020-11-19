import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  listStyle: {
    position: 'absolute',
    overflow: 'scrollbar',
    maxHeight: '30vh',
  },

  listitem: {

  }
}));

const Tweet = ({ user, timestamp_ms, text }) => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={user.name} src={user.profile_image_url_https} />
      </ListItemAvatar>
      <ListItemText primary={user.name} secondary={text} />
    </ListItem>
  );
};

const TweetList = ({ list }) => {
  const { listStyle } = useStyles();
  const exportJSON = () => {
    const dump = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list));
    const exportAnchor = document.getElementById('exportAnchor');
    exportAnchor.setAttribute('href', dump);
    exportAnchor.setAttribute('download', 'TweetsDump.json');
    exportAnchor.click();
  };

  return (
    
    <Grid item xs={3} style={{ float: 'left' }}>
      <Typography variant='title'>Tweets List</Typography>
      <a id='exportAnchor' style={{ display: 'none' }}></a>
      <Button onClick={exportJSON}>Export tweet list</Button>
      <List classes={listStyle} >
        {list.map((tweet) => (
          <Tweet {...tweet} />
        ))}
      </List>
    </Grid>
  );
};

export default TweetList;
