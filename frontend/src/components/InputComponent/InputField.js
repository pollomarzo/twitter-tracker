import React from 'react';
import { TextField, makeStyles, InputAdornment } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 5,
    width: 250,
    '& fieldset': {
      borderWidth: 2,
      borderRadius: 25,
    },
    '& .MuiTypography-colorTextSecondary': {
      color: theme.palette.primary.main,
    },
    '& .Mui-error': {
      color: theme.palette.secondary.main,
    }
  },
}));

const InputField = ({
  label,
  fieldName,
  value,
  handler,
  text,
  helperText,
  hasError,
  ...others
}) => {
  const { textField } = useStyles();
  return (
    <TextField
      className={textField}
      variant="filled"
      label={label}
      value={value}
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
