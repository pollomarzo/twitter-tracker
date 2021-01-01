import React from 'react';
import { makeStyles } from '@material-ui/core';
import { RadarChart, PolarGrid, PolarAngleAxis, Tooltip, Radar } from 'recharts';

const useStyles = makeStyles((theme) => ({
  areachart: {
    '& tspan': {
      fill: theme.palette.type === 'dark' ? 'white' : 'black',
    },
  },
}));

const AreaChart = ({ data }) => {
  const { areachart } = useStyles();
  return (
    <RadarChart width={700} height={300} data={data} className={areachart}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <Tooltip />
      <Radar dataKey="count" stroke="#1da1f2" fill="#1da1f2" fillOpacity={0.6} />
    </RadarChart>
  );
};

export default AreaChart;
