import React from 'react';
import { makeStyles } from '@material-ui/core';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const useStyles = makeStyles((theme) => ({
  barchart: {
    '& tspan': {
      fill: theme.palette.type === 'dark' ? 'white' : 'black',
    },
  },
}));

const BarChart = ({ data }) => {
  const { barchart } = useStyles();
  return (
    <AreaChart width={700} height={300} data={data} className={barchart}>
      <Area type="monotone" dataKey="count" stroke="#1da1f2" fill="#1da1f2" />
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="value" />
      <YAxis />
      <Tooltip />
    </AreaChart>
  );
};

export default BarChart;
