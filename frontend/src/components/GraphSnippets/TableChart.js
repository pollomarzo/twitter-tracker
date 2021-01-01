import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const TableChart = ({ data, header }) => {
  data.sort((prev, next) => next.count - prev.count);

  return (
    <Table stickyHeader>
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
