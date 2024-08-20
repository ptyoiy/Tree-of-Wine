import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const menuItems = [{ text: 'Home' }, { text: 'About' }, { text: 'Contact' }];

  const sideBarContent = (
    <Box
      sx={{
        width: 250,
        padding: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
            {index < menuItems.length && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <MenuIcon
        sx={{
          '&:hover': {
            transform: 'scale(1.1)',
            cursor: 'pointer',
          },
          padding: 1,
        }}
        onClick={toggleDrawer(true)}
      />
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        {sideBarContent}
      </Drawer>
    </Box>
  );
};
