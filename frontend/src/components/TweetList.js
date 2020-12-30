import React, { useMemo } from 'react';
import { Typography, Button, Grid, Avatar } from '@material-ui/core';
import { List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';
import JSZip from 'jszip';

import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';

import { useErrorHandler } from 'react-error-boundary';
import { generateError } from './AlertWindow';

// The single tweet item in the list
const Tweet = ({ user, text, id }) => {
  return (
    <ListItem key={`tcard_id${id}`} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt={user.name} src={user.profile_image_url_https} />
      </ListItemAvatar>
      <ListItemText
        primary={user.name}
        secondary={text}
        secondaryTypographyProps={{ align: 'justify', variant: 'body1' }}
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

const TweetList = ({ list, setList }) => {
  const propagateError = useErrorHandler();
  const imgFiles = useMemo(
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
    const isCompliant = toValidate.every(
      (item) => item.id && item.user && item.text && (item.coordinates || item.place)
    );
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
      const downloadError = generateError("Couldn't start image download");
      propagateError(downloadError);
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Tooltip title="Import tweet list">
            <Button onClick={() => triggerUpload(importJSON)}>
              <PublishIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Export tweets">
            <Button onClick={exportJSON} disabled={list.length === 0}>
              <GetAppIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Download Images">
            <Button onClick={downloadImages} disabled={imgFiles.length === 0}>
              <PhotoLibraryIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Clear list">
            <Button onClick={() => setList([])} disabled={list.length === 0}>
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Grid>

        <Grid item xs={12}>
          <List>
            {list.map((tweet) => (
              <Tweet key={tweet.id} {...tweet} />
            ))}
          </List>
        </Grid>
      </Grid>
    </>
  );
};

export default TweetList;
