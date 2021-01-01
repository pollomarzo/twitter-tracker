import React from 'react';
import { makeStyles } from '@material-ui/core';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

const useStyles = makeStyles((theme) => ({
  piechart: {
    '& .recharts-legend-item-text': {
      color: theme.palette.type === 'dark' ? 'white' : 'black',
    },
  },
}));

const PieGraph = ({ data, colors }) => {
  const { piechart } = useStyles();

  return (
    <PieChart width={700} height={300} className={piechart}>
      <Pie dataKey="count" data={data} outerRadius={80} label={{ fill: 'white' }}>
        {data.map((voice, index) => (
          <Cell name={voice.name} key={voice.name} fill={colors[index]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend verticalAlign="top" height={36} iconSize={30} iconType="circle" />
    </PieChart>
  );
};

export default PieGraph;
