import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';

const menuItems = [{ text: 'Home' }, { text: 'About' }, { text: 'Contact' }];
export default function MenuDropdown() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.text} onClick={handleClose}>{item.text}</MenuItem>
        ))}
      </Menu>
    </>
  );
}
