import React, { useState, useMemo } from 'react';
import { Tabs, Tab, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabs: {
    flexShrink: 0,
  },
  panelsContainer: {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: theme.palette.background.paper,
  },
}));

const InsightTabs = ({ children }) => {
  const { root, tabs, panel, panelsContainer } = useStyles();
  const [focusedTab, setFocused] = useState(0);

  const panels = useMemo(
    () =>
      children.map((child, index) => (
        <Box
          key={index}
          className={panel}
          style={{ zIndex: focusedTab !== index ? -1 : 0 }}
        >
          {React.cloneElement(child)}
        </Box>
      )),
    [children, focusedTab, panel]
  );

  return (
    <div className={root}>
      <Tabs
        className={tabs}
        value={focusedTab}
        onChange={(_, newVal) => setFocused(newVal)}
        textColor="secondary"
      >
        {children.map((child, index) => (
          <Tab value={index} key={index} label={child.props.tabName} />
        ))}
      </Tabs>
      <div className={panelsContainer}>{panels}</div>
    </div>
  );
};

export default InsightTabs;
