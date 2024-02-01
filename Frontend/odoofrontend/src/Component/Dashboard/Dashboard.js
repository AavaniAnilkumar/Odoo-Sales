
// import { useState } from "react";
// import CustomNav from "../Navbar/Navbar"
// const Dashboard =() => {
//     const [currentPage, setCurrentPage] = useState('');
//     const [pageTitle, setPageTitle] = useState('');
//     const [open, setOpen] = useState(true);

//     const handlePageChange = (pageName) => {
//         setCurrentPage(pageName);

//         switch(pageName) {
//             case 'Home':
//                 setPageTitle('Home');
//                 break;
//             case 'Customer':
//                 setPageTitle('Customer');
//                 break;
//             case 'Product':
//                 setPageTitle('Product');
//                 break;
//             case 'Sales Order':
//                 setPageTitle('Sales Order');
//                 break;
//             default:
//                 setPageTitle('Home');


//         }
//         setOpen(false);
//         }

//     return(
//         <CustomNav />
//     );
// }

// export default Dashboard;

import CustomNav from '../Navbar/Navbar';

import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

import MuiDrawer from '@mui/material/Drawer';

import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link } from '@mui/material';
// import Customer from '../Customer/customer';
import Home from '../Home/Home';
import Product from '../Product/Product';
// import SaleOrder from '../Sale-order/Sale-order';
import ProductCategory from '../Product/ProductCategory';
import Company from '../Product/Company';
import CustomerForm from '../Customer/customerform';
import CustomerTable from '../Customer/customertable';
import SaleOrderForm from '../Sale-Order/SaleOrder';
import SaleOrderTable from '../Sale-Order/SaleOrderTable';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
      loyalitsolutions.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

const Dashboard = ({username}) => {
  const [open, setOpen] = useState(true);
  const [route, setRoute] = useState('home');
  const [currentPage, setCurrentPage] = useState('Home');
  const [pageTitle,setPageTitle] = useState('Home');
  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
  
    switch (pageName) {
      case 'Home':
        setPageTitle('Home');
        break;
      case 'Customer':
        setPageTitle('Customer');
        break;
      case 'Products':
        setPageTitle('Product');
        break;
      case 'Sales-Order':
        setPageTitle('Sale-Order');
        break;
      default:
        setPageTitle('Home');
    }
  
    setOpen(false);
  
    // Debugging: Log state values
    console.log('currentPage:', currentPage);
    console.log('pageTitle:', pageTitle);
  };
  

  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    setOpen(false); // Close the drawer when route changes
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleLogout = () => {
    // Handle logout functionality (clear token, redirect, etc.)
    localStorage.removeItem('token');
    // Redirect or perform any action upon logout
    // For example, redirect to the login page
    window.location.href = '/login';
    // history.push('/login');
  };
 
  return (
    <ThemeProvider theme={defaultTheme}>
      <CustomNav onPageChange={handlePageChange} />
       <Toolbar />
           <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
               {/* Render content based on the selected route */}
               {currentPage === 'Home' && <Home />}
               {currentPage === 'Customer' && <CustomerTable />}
               {currentPage == 'Product' && <Product />}
               {currentPage === 'ProductCategory' && <ProductCategory />}
               {currentPage === 'Company' && <Company />}
               {/* {currentPage == 'Sale-orders' && <SaleOrder />} */}
               {/* {currentPage === 'Sale-Order' && <SaleOrderTable />} */}
               {currentPage === 'Sale-Order' && <SaleOrderForm />}
             </Grid>
           </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
