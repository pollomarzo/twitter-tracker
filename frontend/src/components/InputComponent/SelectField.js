import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  select: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
}));

const SelectField = ({ id, label, value, onChange, children }) => {
  const { select } = useStyles();

  return (
    <FormControl>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        name={id}
        labelId={id}
        value={value === undefined ? '' : value}
        className={select}
        onChange={onChange}
      >
        <MenuItem value={undefined}>-----</MenuItem>
        {children}
      </Select>
    </FormControl>
  );
};

export default SelectField;
