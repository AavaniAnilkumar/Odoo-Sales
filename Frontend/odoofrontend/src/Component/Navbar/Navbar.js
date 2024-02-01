

import React, { useState } from 'react';
import './navbar.css';
import { AppBar, Button, IconButton, Toolbar, Typography,Box,Menu,MenuList, MenuItem } from "@mui/material";
function Navbar({ onPageChange }) {
  const [active, setActive] = useState("nav__menu");
  const [icon, setIcon] = useState("nav__toggler");



  const navToggle = () => {
    setActive(active === "nav__menu" ? "nav_menu nav_active" : "nav__menu");
    setIcon(icon === "nav__toggler" ? "nav__toggler toggle" : "nav__toggler");
  };

  const handlePageChange = (page) => {
    onPageChange(page);
    setActive("nav__menu");
    setIcon("nav__toggler");
  };

  return (
    <nav className="nav">
      <a href="#" className="nav__brand">
        {/* Loyal IT Solutions */}
      </a>
      <ul className={active}>
        <li className="nav__item">
          <button className="nav__link" onClick={() => handlePageChange('Home')}>
            Home
          </button>
        </li>
        <li className="nav__item">
          <button className="nav__link" onClick={() => handlePageChange('Customer')}>
            Customer
          </button>
        </li>
        <li className="nav__item">
          <button className="nav__link" onClick={() => handlePageChange('Product')}>
            Products
          </button>
        </li>
        <li className="nav__item">
          <button className="nav__link" onClick={() => handlePageChange('Sale-Order')}>
            Sales-Order
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;



// import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
// import MenuIcon from '@mui/icons-material/Menu';
// import React, { useState, MouseEvent } from "react";

// function CustomNav() {
//   const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);

  
//   const openMenu = (event:MouseEvent<HTMLElement>) => {
//     if (event.currentTarget instanceof HTMLElement) {
//       setAnchorNav(event.currentTarget);
//     }
//   };
//   const closeMenu = () => {
//     setAnchorNav(null);
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: 'blue' }}>
//       <Toolbar>
//         <IconButton
//           size="large"
//           edge="start"
//           color="inherit"
//           aria-label="logo"
//           sx={{ display: { xs: 'none', md: 'flex' } }}
//         >
//           <ProductionQuantityLimitsIcon />
//         </IconButton>
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//           Sale Order
//         </Typography>
//         <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//           <Button style={{ color: 'white' }}>Home</Button>
//           <Button style={{ color: 'white' }}>Customers</Button>
//           <Button style={{ color: 'white' }}>Products</Button>
//           <Button style={{ color: 'white' }}>Sales Order</Button>
//         </Box>
//         <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//           <IconButton size="large" edge="start" color="inherit" onClick={openMenu}>
//             <MenuIcon />
//           </IconButton>
//           <Menu
//             anchorEl={anchorNav} // Set anchorEl to anchorNav
//             open={Boolean(anchorNav)}
//             onClose={closeMenu}
//             sx={{ display: { xs: 'flex', md: 'none' } }}
//           >
//             <MenuItem onClick={closeMenu}>Home</MenuItem>
//             <MenuItem onClick={closeMenu}>Customer</MenuItem>
//             <MenuItem onClick={closeMenu}>Product</MenuItem>
//             <MenuItem onClick={closeMenu}>Sales Order</MenuItem>
//           </Menu>
//           <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="logo"
//             sx={{ display: { xs: 'flex', md: 'none' } }}
//           >
//             <ProductionQuantityLimitsIcon />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             Sale Order
//           </Typography>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default CustomNav;

