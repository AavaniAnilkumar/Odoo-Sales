
// import * as React from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { useState,useEffect } from 'react';
// import CircularProgress from '@mui/material/CircularProgress';
// import BASE_URL from '../../config';
// import { Box } from '@mui/material';


// export default function OdooProductTable() {
  
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [loading,setLoading] =useState(true);

//     useEffect(() => {
//       // Simulating a delay of 1 second
//       const delay = setTimeout(() => {
//         fetch(`${BASE_URL}/view-products/`)
//           .then((response) => response.json())
//           .then((data) => {
//             setProducts(data);
//             setLoading(false);
//           })
//           .catch((error) => {
//             console.error('Error fetching data:', error);
//             setLoading(false);
//           });
//       }, 100);
  
//       return () => clearTimeout(delay); 
//     }, []);
  
//     const handleRowClick = (product) => {
//       setSelectedProduct(product);
//     };

//     if(loading) {
//       return (
//         <Box sx={{ display: 'flex',marginLeft: '550px',marginTop: '150px'}}>
//         <CircularProgress color='secondary'/>
//       </Box>
//       );
//     }
//   return (

//     <div>
//         <h1 style={{ marginRight: '35px', fontFamily: 'serif',marginLeft: '150px'}}> Products </h1> <br />
        
//           <TableContainer component={Paper} >
//           <Table sx={{ minWidth: 1200 }} aria-label="simple table" style={{width:'100%'}}>
//             <TableHead>
//               <TableRow>
//                 <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Product Image</TableCell>
//                 <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Product Name</TableCell>
//                 <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Unit Price</TableCell>
//                 <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Tax</TableCell>
//                 <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Total Price(Incl.Tax) </TableCell>
//                 <TableCell style={{fontWeight: 'bold',fontSize:'15px'}}>Total Price(Excl.Tax) </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//             {products.map((product) => (
//                  <TableRow key={product.id} onClick={() => handleRowClick(product)}>
//                    <TableCell component="th" scope="row" >
//                       <img src={`${BASE_URL}/${product.image}`} alt={product.name} style={{ maxWidth: '100px' }} /> 
//                    </TableCell>
//                    <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}>
//                     {product.name}
//                    </TableCell>
//                    <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}>{product.sales_price}</TableCell>
//                    <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}>{product.customer_tax_name}</TableCell>
//                    <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}>{product.total_price}</TableCell>
//                    <TableCell style={{fontWeight: 'normal',fontSize:'14px'}}>{product.sales_price}</TableCell>
                   

//                    <TableCell style={{fontWeight: 'normal'}}>{product.cost}</TableCell>
  
//                  </TableRow>
//                ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
    
//     </div>
    
//   );

// }


import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import BASE_URL from '../../config';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function OdooProductTable() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery('(max-width: 375px)');
  const isTabletScreen = useMediaQuery('(max-width: 700px)');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay of 1 second
    const delay = setTimeout(() => {
      fetch(`${BASE_URL}/view-products/`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, 100);

    return () => clearTimeout(delay);
  }, []);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box>
       <Typography variant="h3" align='center' mt={2} mb={4} style={{fontWeight: 'bold',textAlign:'center', marginLeft: '10%'}}>
        Products
      </Typography>


      <TableContainer component={Paper} style={{ overflowX: 'auto',marginLeft: '-5%',width: '120%', }}>
        <Table sx={{ minWidth: 1150 }} aria-label="simple table" style={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '8px' : isTabletScreen ? '10px' : '15px' }}>Product Image</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '8px' : isTabletScreen ? '10px' : '15px' }}>Product Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '8px' : isTabletScreen ? '10px' : '15px' }}>Unit Price</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '8px' : isTabletScreen ? '10px' : '15px' }}>Tax</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '8px' : isTabletScreen ? '10px' : '15px' }}>Total Price (Incl.Tax) </TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: isSmallScreen ? '8px' : isTabletScreen ? '10px' : '15px' }}>Total Price (Excl.Tax) </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} onClick={() => handleRowClick(product)}>
                <TableCell component="th" scope="row">
                  <img
                    src={`${BASE_URL}/${product.image}`}
                    alt={product.name}
                    style={{ maxWidth: isSmallScreen ? '20px' : isTabletScreen ? '30px' : '100px' }}
                  />
                </TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: isSmallScreen ? '10px' : isTabletScreen ? '12px' : '14px' }}>{product.name}</TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: isSmallScreen ? '10px' : isTabletScreen ? '12px' : '14px' }}>{product.sales_price}</TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: isSmallScreen ? '10px' : isTabletScreen ? '12px' : '14px' }}>{product.customer_tax_name}</TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: isSmallScreen ? '10px' : isTabletScreen ? '12px' : '14px' }}>{product.total_price}</TableCell>
                <TableCell style={{ fontWeight: 'normal', fontSize: isSmallScreen ? '10px' : isTabletScreen ? '12px' : '14px' }}>{product.sales_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
