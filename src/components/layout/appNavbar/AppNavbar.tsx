import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuDropdown from './MenuDropdown';
import NavbarTitle from './NavbarTitle';

export default function AppNavbar() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="static">
        <Toolbar>
          <NavbarTitle title="Tree of Wines" />
          <MenuDropdown />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
