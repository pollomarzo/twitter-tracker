import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Collapse } from '@material-ui/core';

const CollapsableBox = ({ name, children }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <List>
      <ListItem button onClick={() => setOpen((prev) => !prev)}>
        <ListItemText
          primaryTypographyProps={{ variant: 'h6', align: 'center', color: 'primary' }}
        >
          {name}
        </ListItemText>
        {/*<Typography variant="h6" align="center" color="primary">*/}
      </ListItem>
      <Collapse in={isOpen} unmountOnExit>
        <Box borderColor="primary">{children}</Box>
      </Collapse>
    </List>
  );
};

export default CollapsableBox;
