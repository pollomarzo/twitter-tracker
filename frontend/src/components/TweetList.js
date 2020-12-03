import React, { useMemo } from 'react';
import { useErrorHandler } from 'react-error-boundary';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { Typography, Button, makeStyles } from '@material-ui/core';
import JSZip from 'jszip';

import { generateError } from './AlertWindow';

const useStyles = makeStyles(() => ({
  grid: {
    width: 540,
    marginTop: 5,
    marginBottom: 5,
  },
  tweetList: {
    height: 150,
    overflow: 'auto',
  },
}));

const Tweet = ({ user, text, id }) => {
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

const triggerUpload = (onChangeHandler) => {
  const link = document.createElement('input');
  document.body.appendChild(link);
  link.type = 'file';
  link.accept = 'application/json';
  link.onchange = onChangeHandler;
  link.click();
  document.body.removeChild(link);
};

const TweetList = ({ list, setList }) => {
  const { grid, tweetList } = useStyles();
  const propagateError = useErrorHandler();
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

  const validateJSON = (toValidate) => {
    if (Array.isArray(toValidate))
      return toValidate.every(
        (item) => item.id && item.user && item.text && (item.coordinates || item.place)
      );
  };

  const importJSON = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      const reader = new FileReader();
      // Callback on successfull read
      reader.onload = (event) => {
        const dump = JSON.parse(event.target.result);
        if (validateJSON(dump)) {
          setList(dump);
        } else {
          propagateError(
            generateError("The given file doesn't match the format requested")
          );
        }
      };
      reader.readAsText(uploadedFile, 'utf-8');
    }
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
      const downloadError = generateError("Couldn't start image download");
      propagateError(downloadError);
    }
  };

  return (
    <div className={grid}>
      {/*please someone pick a half decent style for this shit */}
      <div>
        <Typography variant="inherit" style={{ display: 'inline-block' }}>
          Tweets List
        </Typography>
        <Button
          onClick={list.length === 0 ? () => triggerUpload(importJSON) : exportJSON}
        >
          {list.length === 0 ? 'Import tweet list' : 'Export tweet list'}
        </Button>
        <Button onClick={downloadImages} disabled={images.length === 0}>
          Download Images
        </Button>
      </div>
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
