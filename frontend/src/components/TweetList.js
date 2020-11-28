import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  grid: {
    overflow: 'scroll',
    height: 150,
    width: 540,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#1DA1F2',
    scrollbarWidth: 'none',
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 20,
  },
}));

const Tweet = ({ user, timestamp_ms, text, id }) => {
  return (
    <ListItem key={`tcard_id${id}`} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={user.name} src={user.profile_image_url_https} />
      </ListItemAvatar>
      <ListItemText primary={user.name} secondary={text} />
    </ListItem>
  );
};

const TweetList = ({ list, setList }) => {
  const { grid } = useStyles();

  const openDialog = () => document.getElementById('importInput').click();
  const exportJSON = () => {
    const dump =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(list));
    const exportAnchor = document.getElementById('exportAnchor');
    exportAnchor.setAttribute('href', dump);
    exportAnchor.setAttribute('download', 'TweetsDump.json');
    exportAnchor.click();
  };
  const importJSON = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      const reader = new FileReader();
      // Callback on successfull read
      reader.onload = (event) => setList(JSON.parse(event.target.result));
      reader.readAsText(uploadedFile, 'utf-8');
    }
  };

  return (
    <Grid item className={grid}>
      <Typography variant="inherit" style={{ display: 'inline-block' }}>
        Tweets List
      </Typography>
      <a id="exportAnchor" href="." style={{ display: 'none' }}>This is hidden</a>
      <input
        id="importInput"
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={importJSON}
      />

      <Button onClick={list.length === 0 ? openDialog : exportJSON}>
        {list.length === 0 ? 'Import tweet list' : 'Export tweet list'}
      </Button>

      <List>
        {list.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </List>
    </Grid>
  );
};

export default TweetList;
