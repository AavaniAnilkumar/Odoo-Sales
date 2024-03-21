

// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Avatar ,TextField} from '@mui/material';
// import CustomerForm from './customerform';
// import BASE_URL from '../../config';
// import { Box } from '@mui/material';
// import CircularProgress from '@mui/material/CircularProgress';


// const CustomerTable = ({ shouldRefreshTable, setShouldRefreshTable }) => {
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [showDetailsDialog, setShowDetailsDialog] = useState(false);
//   const [showCreateCustomerPage, setShowCreateCustomerPage] = useState(false);
//   const [editedCustomer, setEditedCustomer] = useState(null); // Define editedCustomer state
//   const [isEditing,setIsEditing]=useState(false);
//   const [loading,setLoading] =useState(true);

  
//   useEffect(() => {
//     // Simulating a delay of 1 second
//     const delay = setTimeout(() => {
//       fetch(`${BASE_URL}/view-customers/`)
//         .then((response) => response.json())
//         .then((data) => {
//           setCustomers(data);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error('Error fetching data:', error);
//           setLoading(false);
//         });
//     },0.01);

//     return () => clearTimeout(delay); 
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/odoo-customers/`);
//       if (response.ok) {
//         const data = await response.json();
//         setCustomers(data);
//         setShouldRefreshTable(false);
//       } else {
//         console.error('Failed to fetch customers:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

  

//   const handleCloseDetailsDialog = () => {
//     setShowDetailsDialog(false);
//   };

//   const handleCreateCustomer = () => {
//     setShowCreateCustomerPage(true);
//   };

//   const handleCloseCreateCustomerPage = () => {
//     setShowCreateCustomerPage(false);
//   };

//   const handleEditCustomer = () => {
//     setEditedCustomer({ ...selectedCustomer });
//   };

//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith('contact.')) {
//       setEditedCustomer((prevCustomer) => ({
//         ...prevCustomer,
//         contact: {
//           ...prevCustomer.contact,
//           [name.split('.')[1]]: value,
//         },
//       }));
//     } else {
//       setEditedCustomer((prevCustomer) => ({
//         ...prevCustomer,
//         [name]: value,
//       }));
//     }
//   };
//   const handleRowClick = (customer) => {
//     setSelectedCustomer(customer);
//   };
//   if(loading) {
//     return (
//       <Box sx={{ display: 'flex',marginLeft: '550px' , marginTop: '150px'}}>
//       <CircularProgress color='secondary'/>
//     </Box>
//     );
//   }

//   return (
   

//     <div>
//     <h1 style={{ marginRight: '30px', fontFamily: 'serif',marginLeft: '140px'}}> Customers </h1> <br />
    
//       <TableContainer component={Paper} >
//       <Table sx={{ minWidth: 1160 }} aria-label="simple table" style={{width:'100%'}}>
//         <TableHead>
//           <TableRow>
//             <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Customer Image</TableCell>
//             <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Customer Name</TableCell>
//             <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Address</TableCell>
//             <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Zip</TableCell>
//             <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>GST</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//         {customers.map((customer) => (
//              <TableRow key={customer.id} onClick={() => handleRowClick(customer)}>
//                <TableCell component="th" scope="row" >
//                   <img src={`${BASE_URL}/${customer.image}`} alt={customer.name} style={{ maxWidth: '90px' }} />
               
 
//                </TableCell>
//                <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}>
//                  {customer.name}
//                </TableCell>
//                <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}> {customer.street}
//                       <br />
//                       {customer.city}, {customer.state_name}
//                       <br />
//                       {customer.country_name}</TableCell>
//                <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}> {customer.zip}</TableCell>
//                <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}> {customer.gst_treatment}</TableCell>
//              </TableRow>
//            ))}
//         </TableBody>
//       </Table>
//     </TableContainer>

// </div>
//   );
// };

// export default CustomerTable;


import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import BASE_URL from '../../config';

const CustomerTable = ({ shouldRefreshTable, setShouldRefreshTable }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay of 1 second
    const delay = setTimeout(() => {
      fetch(`${BASE_URL}/view-customers/`)
        .then((response) => response.json())
        .then((data) => {
          setCustomers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, 0.01);

    return () => clearTimeout(delay);
  }, []);

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box  >
      <Typography variant="h3" align='center' mt={2} mb={4} style={{fontWeight: 'bold',textAlign:'center', marginLeft: '380px'}}>
        Customers
      </Typography>

      <TableContainer component={Paper} style={{ overflowX: 'auto',marginLeft: '-5%',width: '200%', }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Customer Image</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Customer Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Address</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>Zip</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '15px' }}>GST</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} onClick={() => handleRowClick(customer)}>
                <TableCell component="th" scope="row">
                  <img src={`${BASE_URL}/${customer.image}`} alt={customer.name} style={{ maxWidth: '90px' }} />
                </TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: '14px' }}>{customer.name}</TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: '14px' }}>
                  {customer.street}
                  <br />
                  {customer.city}, {customer.state_name}
                  <br />
                  {customer.country_name}
                </TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: '14px' }}>{customer.zip}</TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: '14px' }}>{customer.gst_treatment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerTable;
