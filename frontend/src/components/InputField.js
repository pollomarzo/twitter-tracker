import React from 'react';
import { TextField, makeStyles, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles({
  textField: {
    margin: 10,
    width: 300,
    '& fieldset': {
      borderWidth: 2,
      borderRadius: 25,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1DA1F2',
    },
    '& .MuiOutlinedInput-input': {
      color: '#1DA1F2',
    },
    '& .MuiInputLabel-outlined': {
      color: '#1DA1F2',
    },
    '& .MuiTypography-colorTextSecondary': {
      color: '#1DA1F2',
    },
  },
});

const InputField = ({ label, fieldName, handler, text }) => {
  const { textField } = useStyles();
  return (
    <>
      {text ? (
        <TextField
          required
          variant="outlined"
          className={textField}
          name={fieldName}
          onChange={handler}
          InputProps={{
            startAdornment: <InputAdornment position="start">{text}</InputAdornment>,
          }}
        />
      ) : (
        <TextField
          variant="outlined"
          className={textField}
          label={label}
          name={fieldName}
          onChange={handler}
        />
      )}
    </>
  );
};

export default InputField;
