import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import MuiButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ButtonGroup from '@material-ui/core/ButtonGroup';

// override mUI styling so that pointer events are fired from disabled
const Button = withStyles({
  root: {
    '&.Mui-disabled': {
      pointerEvents: 'auto',
    },
  },
})(MuiButton);

const TooltipButton = ({
  tooltipText,
  tooltipPlacement,
  disabled,
  onClick,
  ...other
}) => {
  // switch internal component with div when disabled, then disable it
  // needed because disabled <button> don't fire events 'correctly'... :|
  const adjButtonProps = {
    disabled,
    component: disabled ? 'div' : undefined,
    onClick: disabled ? undefined : onClick,
  };
  return (
    <Tooltip title={tooltipText} placement={tooltipPlacement}>
      <Button {...other} {...adjButtonProps} />
    </Tooltip>
  );
};

export default TooltipButton;
