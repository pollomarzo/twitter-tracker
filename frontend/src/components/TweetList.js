import React, { useMemo } from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import JSZip from 'jszip';

const useStyles = makeStyles(() => ({
  grid: {
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
  tweetList: {
    overflow: 'auto',
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

const triggerDownload = ({ name, url }) => {
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.download = name;
  link.href = url;
  link.click();
  document.body.removeChild(link);
};

const TweetList = ({ list }) => {
  const { grid, tweetList } = useStyles();
  const images = useMemo(
    () =>
      list.reduce((images, tweet) => {
        if (tweet.extended_entities && tweet.extended_entities.media) {
          const medias = tweet.extended_entities.media;
          medias.forEach((media) => {
            if (media.type === 'photo') {
              const mediaUrl = media.media_url;
              images.push({
                file: mediaUrl.substr(mediaUrl.lastIndexOf('/') + 1),
                url: mediaUrl,
              });
            }
          });
        }

        return images;
      }, []),
    [list]
  );

  const exportJSON = () => {
    const url =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(list));
    triggerDownload({ name: 'TweetsDump.json', url });
  };

  const downloadImages = async () => {
    const zip = new JSZip();
    for (const { file, url } of images) {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(file, blob);
    }

    try {
      const result = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(result);
      triggerDownload({ name: 'Photos.zip', url });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={grid}>
      {/*please someone pick a half decent style for this shit */}
      <Typography variant="inherit" style={{ display: 'inline-block' }}>
        Tweets List
      </Typography>
      <Button onClick={exportJSON}>Export tweet list</Button>
      <Button onClick={downloadImages} disabled={images.length === 0}>
        Download Images
      </Button>
      <div className={tweetList}>
        <List>
          {list.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))}
        </List>
      </div>
    </div>
  );
};

export default TweetList;
