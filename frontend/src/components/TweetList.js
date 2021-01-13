import React, { useMemo } from 'react';
import { List, Button, Grid, Avatar, Tooltip, makeStyles } from '@material-ui/core';
import { ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import JSZip from 'jszip';

import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import { useErrorHandler } from 'react-error-boundary';
import { UserError } from './AlertWindow';

// The single tweet item in the list
const Tweet = ({ user, text, extended_tweet, id }) => {
  return (
    <ListItem key={`tcard_id${id}`} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={user.name} src={user.profile_image_url_https} />
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={extended_tweet ? extended_tweet.full_text : text}
        primaryTypographyProps={{ variant: 'body1', color: 'secondary' }}
        secondaryTypographyProps={{ align: 'justify', variant: 'body2' }}
      />
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

const useStyles = makeStyles((theme) => ({
  icons: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  listContainer: {
    maxHeight: 570,
    overflowY: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },
}));

const TweetList = ({ list, setList }) => {
  const classes = useStyles();
  const launch = useErrorHandler();
  const imgFiles = useMemo(
    () =>
      list.reduce((images, tweet) => {
        if (tweet.extended_entities && tweet.extended_entities.media) {
          const medias = tweet.extended_entities.media;
          medias.forEach(({ type, media_url }) => {
            if (type === 'photo')
              images.push({
                file: media_url.substr(media_url.lastIndexOf('/') + 1),
                url: media_url,
              });
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
    const isCompliant = toValidate.every((item) => item.id && item.user && item.text);
    if (!isCompliant) {
      throw new Error();
    }
  };

  const importJSON = (fileEvt) => {
    const uploadedFile = fileEvt.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/json') {
      const reader = new FileReader();
      // Callback on successfull read
      reader.onload = (event) => {
        try {
          const dump = JSON.parse(event.target.result);
          validateJSON(dump);
          setList((old) => [...old, ...dump]);
        } catch (err) {
          launch(UserError('The given log do not match the format requested'));
        }
      };
      reader.readAsText(uploadedFile, 'utf-8');
    }
  };

  const downloadImages = async () => {
    const zip = new JSZip();
    for (const { file, url } of imgFiles) {
      const response = await fetch(url);
      const blob = await response.blob();
      zip.file(file, blob);
    }

    try {
      const result = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(result);
      triggerDownload({ name: 'Photos.zip', url });
    } catch (err) {
      launch(UserError("Couldn't start image download"));
    }
  };

  const isTweetListEmpty = list.length === 0;
  const isImageListEmpty = imgFiles.length === 0;

  return (
    <>
      <Grid container>
        {/* Tooltip to manipulate the data */}
        <Grid item xs={12} className={classes.icons}>
          <Tooltip title="Import tweet list">
            <Button onClick={() => triggerUpload(importJSON)}>
              <PublishIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Export tweets">
            <span>
              <Button onClick={exportJSON} disabled={isTweetListEmpty}>
                <GetAppIcon />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Download Images">
            <span>
              <Button onClick={downloadImages} disabled={isImageListEmpty}>
                <PhotoLibraryIcon />
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Clear list">
            <span>
              <Button onClick={() => setList([])} disabled={isTweetListEmpty}>
                <DeleteIcon />
              </Button>
            </span>
          </Tooltip>
        </Grid>

        {/* List of th tweets captured by the client */}
        <Grid item xs={12}>
          {list.length > 0 && (
            <List className={classes.listContainer}>
              {list.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
              ))}
            </List>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default TweetList;
