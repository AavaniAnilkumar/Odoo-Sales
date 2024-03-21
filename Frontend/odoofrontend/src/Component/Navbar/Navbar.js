import { AppBar, IconButton, Toolbar, Typography, Menu, MenuItem, Button, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import React, { useState } from 'react';

function Navbar({ onPageChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:425px)');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (page) => {
    onPageChange(page);
    handleMenuClose();
  };

  return (
    <AppBar position="static" className="nav" style={{ backgroundColor: '#2c3068', width: '100%' }}>
      <Toolbar>
        {isMobile ? (
          // Display only the IconButton on mobile
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          // Display the brand link and buttons on larger screens
          <>
            {/* Your brand link */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', marginLeft: 'auto' }}>
              <a href='https://www.loyalitsolutions.com' style={{ color: 'white', textDecoration: 'none' }}> Loyal IT Solutions</a>
            </Typography>

            {/* Menu items for larger screens */}
            <div className="nav__menu" sx={{ display: 'flex', marginLeft: 'auto' }}>
              <Button className="nav__link" sx={{ color: 'white' }} onClick={() => handlePageChange('Home')}>
                Home
              </Button>
              <Button className="nav__link" sx={{ color: 'white' }} onClick={() => handlePageChange('Customer')}>
                Customer
              </Button>
              <Button className="nav__link" sx={{ color: 'white' }} onClick={() => handlePageChange('Product')}>
                Products
              </Button>
              <Button className="nav__link" sx={{ color: 'white' }} onClick={() => handlePageChange('Sale-Order')}>
                Sales-Order
              </Button>
            </div>
          </>
        )}

        {/* Mobile menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handlePageChange('Home')}>Home</MenuItem>
          <MenuItem onClick={() => handlePageChange('Customer')}>Customer</MenuItem>
          <MenuItem onClick={() => handlePageChange('Product')}>Products</MenuItem>
          <MenuItem onClick={() => handlePageChange('Sale-Order')}>Sales-Order</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;




