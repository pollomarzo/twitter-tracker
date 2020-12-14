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
    '& .Mui-error': {
      color: '#1DA1F2',
    },
  },
});

const InputField = ({ label, fieldName, handler, text, helperText, hasError, ...others}) => {
  const { textField } = useStyles();
  return (
    <TextField
      variant="outlined"
      className={textField}
      label={label}
      name={fieldName}
      onChange={handler}
      helperText={hasError && helperText}
      error={hasError}
      InputProps={{
        startAdornment: text && <InputAdornment position="start">{text}</InputAdornment>,
      }}
      {...others}
    />
  );
};

export default InputField;
