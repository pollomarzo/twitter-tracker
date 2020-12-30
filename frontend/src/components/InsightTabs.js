import React, { useState } from 'react';
import { Tabs, Tab, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const InsightTabs = ({ children }) => {
  const { root } = useStyles();
  const [focusedTab, setFocused] = useState(0);

  return (
    <div className={root}>
      <Tabs onChange={(_, newVal) => setFocused(newVal)}>
        {children.map((child, index) => (
          <Tab value={index} key={index} label={child.props.tabName} />
        ))}
      </Tabs>
      <Box>{children[focusedTab]}</Box>
    </div>
  );
};

export default InsightTabs;
