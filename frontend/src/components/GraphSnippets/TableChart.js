import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: "max-content",
    width: "70%",
    height: "auto",
    marginRight: "20%",
    marginLeft: "20%",
    marginBottom: 60
  }
}));

const TableChart = ({ data, header }) => {
  const { table } = useStyles();
  data.sort((prev, next) => next.count - prev.count);

  return (
    <Table stickyHeader className={table}>
      <TableHead>
        <TableRow>
          <TableCell align="center">{header[0]}</TableCell>
          <TableCell align="center">{header[1]}</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {data.map((voice) => (
          <TableRow key={voice.name}>
            <TableCell align="center">{voice.name}</TableCell>
            <TableCell align="center">{voice.count || 'No data avaiable'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableChart;
