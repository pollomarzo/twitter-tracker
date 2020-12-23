import React, { useMemo, useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  makeStyles,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@material-ui/core';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { SEND_TWEET } from '../constants';
import TooltipButton from '../fun/TooltipButton';
import { MAP_ID, WORDCLOUD_ID } from '../constants';

import html2canvas from 'html2canvas';

const useStyles = makeStyles({
  status: { float: 'right', fontWeight: 'normal' },
  statusText: {},
  stopped: { backgroundColor: '#cccccc', borderRadius: '2px' },
  running: { backgroundColor: '#86e038', borderRadius: '5px' },
  leftButton: {
    flexGrow: '1 0 0',
  },
});
const NUMBER_RE = /^[0-9|\.]+$/;
const CONFIRM_RE = /^[0-9]+(\.[0-9]+)?$/;
const H_TO_MS = (hours) => Math.floor(hours * 60 * 60 * 1000);

// to keep it in two components, scheduleTweet check if user is authenticated,
// and if not calls handleAuth to complete authentication.
const ScheduleTweet = ({ handleAuth }) => {
  const { authProps } = useUser();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [text, setText] = useState('');
  const [pass, setPass] = useState('');
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSent(false);
  };
  const handleInterval = (e) => {
    const input = e.target.value;
    if (NUMBER_RE.test(input) || input === '') {
      console.log(`going to send tweet every ${input} hours`);
      setHours(input);
      setError('');
    }
  };
  const confirmation = 'Seems your tweet went through!';
  const handleSend = async () => {
    console.log('Shooting scheduled tweet!');
    console.log(selectedComponents);
    try {
      const screenshots = await Promise.all(
        selectedComponents.map((id) =>
          html2canvas(document.getElementById(id), {
            useCORS: true,
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
      const response = await axios.post(SEND_TWEET, { msg, authProps });
      setSent(true);
      console.log(response);
    } catch (err) {
      console.log(err.response.data.message);
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
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={!authProps ? handleAuth : handleOpen}
      >
        {!authProps ? 'AUTHENTICATE' : 'SCHEDULE TWEET'}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Setup
          <span className={classes.status}>
            <span className={classes.statusText}> status: </span>
            {!timer ? (
              <span className={classes.stopped}>stopped</span>
            ) : (
              <span className={classes.running}>running</span>
            )}
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Use this to schedule a periodic update tweet.
          </DialogContentText>
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
          <TextField
            multiline
            helperText={"don't forget the length limit!"}
            value={text}
            onChange={(event) => {
              if (event.target.value.length <= 140) setText(event.target.value);
            }}
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
          <div style={{ display: !sent ? 'none' : 'block' }}>{confirmation}</div>
        </DialogContent>
        <DialogActions>
          <TooltipButton
            tooltipText={
              !timer ? 'set an interval first' : 'kill previous interval and change'
            }
            tooltipPlacement="top"
            onClick={cleanAll}
            color="primary"
            disabled={!timer}
          >
            Change Interval
          </TooltipButton>
          <TooltipButton
            tooltipText={!text ? 'set some text first' : 'click me for a quick test!'}
            tooltipPlacement="top"
            className={classes.leftButton}
            onClick={handleSend}
            disabled={!text}
          >
            SEND NOW!
          </TooltipButton>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <TooltipButton
            tooltipText={
              !(hours && text) ? 'input some values first' : 'already running!'
            }
            tooltipPlacement="top"
            onClick={handleConfirm}
            color="primary"
            disabled={!(hours && text && !timer)}
          >
            Confirm
          </TooltipButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ScheduleTweet;
