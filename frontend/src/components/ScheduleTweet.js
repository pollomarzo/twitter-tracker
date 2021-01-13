import React, { useMemo, useState } from 'react';
import axios from 'axios';

import {
  Button,
  DialogActions,
  TextField,
  makeStyles,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@material-ui/core';
import { useUser } from '../context/UserContext';
import { MAP_ID, WORDCLOUD_ID, SEND_TWEET } from '../constants';

import html2canvas from 'html2canvas';

const useStyles = makeStyles((theme) => ({
  status: { float: 'right', fontWeight: 'normal' },
  statusText: {},
  stopped: {
    backgroundColor: '#cccccc',
    borderRadius: '5px',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: 'black',
  },
  running: {
    backgroundColor: '#86e038',
    borderRadius: '5px',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: 'black',
  },
  leftButton: {
    flexGrow: '1 0 0',
  },
}));

const NUMBER_RE = /^[0-9|.]+$/;
const CONFIRM_RE = /^[0-9]+(\.[0-9]+)?$/;
const H_TO_MS = (hours) => Math.floor(hours * 60 * 60 * 1000);

// to keep it in two components, scheduleTweet check if user is authenticated,
// and if not calls handleAuth to complete authentication.
const ScheduleTweet = ({ handleAuth }) => {
  const { authProps } = useUser();
  const [sent, setSent] = useState(false);
  const [text, setText] = useState('');
  const [timer, setTimer] = useState(undefined);
  const [hours, setHours] = useState('');
  const [error, setError] = useState(false);
  const [check, setCheck] = useState({ [MAP_ID]: false, [WORDCLOUD_ID]: false });
  const { map, wordcloud } = check;
  const classes = useStyles();
  const intervalMS = useMemo(() => H_TO_MS(hours), [hours]);
  const selectedComponents = useMemo(
    () => Object.keys(check).filter((key) => check[key]),
    [check]
  );

  const handleCheck = (evt) => {
    setCheck((prev) => ({ ...prev, [evt.target.name]: evt.target.checked }));
  };

  const handleInterval = (e) => {
    const input = e.target.value;
    if (NUMBER_RE.test(input) || input === '') {
      setHours(input);
      setError('');
    }
  };

  const handleSend = async () => {
    try {
      const screenshots = await Promise.all(
        selectedComponents.map((id) =>
          html2canvas(document.getElementById(id), {
            useCORS: true,
            backgroundColor: null,
          })
        )
      );
      const media = screenshots.map((canvas) => {
        const dataUrl = canvas.toDataURL();
        return dataUrl.substring(dataUrl.lastIndexOf(',') + 1);
      });
      const msg = {
        text: text,
        media,
      };
      await axios.post(SEND_TWEET, { msg, authProps });
      setSent(true);
    } catch (err) {
      if (err.response) {
        console.error(err.response.data.message);
      } else {
        console.error(err.message);
      }
    }
  };
  const handleConfirm = () => {
    if (CONFIRM_RE.test(hours)) {
      setTimer(setInterval(handleSend, intervalMS));
      // check low amount;
      if (Number(hours) < 0.05) setError('careful with low numbers, twitter is garbage');
    } else setError("that's not a number cunt");
  };
  const cleanAll = () => {
    clearInterval(timer);
    setTimer(undefined);
    setSent(false);
  };

  return (
    <>
      {!authProps ? (
        <Button variant="contained" color="secondary" onClick={handleAuth}>
          AUTHENTICATE
        </Button>
      ) : (
        <>
          <TextField
            helperText={error || 'how many hours should we wait?'}
            error={!!error}
            autoFocus
            value={hours}
            onChange={handleInterval}
            label="Interval between tweets"
            id="tweet-interval"
            disabled={!!timer}
          />
          <span className={classes.status}>
            <Typography variant="button"> status: </Typography>
            {!timer ? (
              <span className={classes.stopped}>stopped</span>
            ) : (
              <span className={classes.running}>running</span>
            )}
          </span>
          <TextField
            multiline
            value={text}
            onChange={(event) => {
              if (event.target.value.length <= 140) setText(event.target.value);
            }}
            helperText={`${text.length}/${140}`}
            margin="dense"
            id="tweet-text"
            label="Tweet Text"
            type="text"
            disabled={!!timer}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={map}
                name={MAP_ID}
                color="primary"
                onChange={handleCheck}
                disabled={!!timer}
              />
            }
            label="Map"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={wordcloud}
                name={WORDCLOUD_ID}
                color="primary"
                onChange={handleCheck}
                disabled={!!timer}
              />
            }
            label="Word cloud"
          />
          {sent && <div>Seems your tweet went through!</div>}
          <DialogActions>
            <Button onClick={cleanAll} color="primary" disabled={!timer}>
              Change Interval
            </Button>
            <Button className={classes.leftButton} onClick={handleSend} disabled={!text}>
              SEND NOW!
            </Button>
            <Button
              onClick={handleConfirm}
              color="primary"
              disabled={!(hours && text && !timer)}
            >
              Confirm
            </Button>
          </DialogActions>
        </>
      )}
    </>
  );
};

export default ScheduleTweet;
