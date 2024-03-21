

import * as React from 'react';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    cursor: 'pointer', // Add cursor pointer to indicate clickable
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



const DetailsTable = ({ selectedProduct }) => {
  return (
    <TableContainer component={Paper} style={{ position: 'absolute', top: '300px', left: '590px', width: 'fit-content' }}>
      <Table sx={{ minWidth: 700 }} aria-label="details table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{fontSize: '15px'}}>Product Type</StyledTableCell>
            <StyledTableCell style={{fontSize: '15px'}}>Product Category</StyledTableCell>
            <StyledTableCell style={{fontSize: '15px'}}>Company</StyledTableCell>
            <StyledTableCell style={{fontSize: '15px'}}>Sales Price</StyledTableCell>
           
            {/* <StyledTableCell>Customer Tax</StyledTableCell> */}

            <StyledTableCell>Cost</StyledTableCell>
            {/* Add more fields here */}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow key={selectedProduct.id}>
            <StyledTableCell style={{fontSize: '14px'}}>{selectedProduct.product_type}</StyledTableCell>
            <StyledTableCell style={{fontSize: '14px'}}>{selectedProduct.product_category}</StyledTableCell>
            <StyledTableCell style={{fontSize: '14px'}}>{selectedProduct.company}</StyledTableCell>
            <StyledTableCell style={{fontSize: '14px'}}>{selectedProduct.sales_price}</StyledTableCell>
           
            {/* <StyledTableCell>{selectedProduct.customer_tax}</StyledTableCell> */}
            <StyledTableCell style={{fontSize: '14px'}}>{selectedProduct.cost}</StyledTableCell>

            {/* Add more cells here */}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>

  );
};

export default function CustomizedTables({ updatedProducts}) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  

  // useEffect(() => {
  //   // Fetch data from the backend API endpoint

  //   if (updatedProducts.)
  //   fetch('http://localhost:8000/product/')
  //     .then((response) => response.json())
  //     .then((data) => setProducts(data))
  //     .catch((error) => console.error('Error fetching data:', error));
  // }, []);

  // const handleRowClick = (product) => {
  //   // Set the selected product when a row is clicked
  //   setSelectedProduct(product);
  // };
  useEffect(() => {
    // If updatedProducts is provided, use it to set the state
    if (updatedProducts.length > 0) {
      setProducts(updatedProducts);
    } else {
      // Fetch data from the backend API endpoint
      fetch('http://localhost:8000/product/')
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }, [updatedProducts]);
  const handleRowClick = (product) => {
    // Set the selected product when a row is clicked
    setSelectedProduct(product);
  };

  return (
    <React.Fragment>
      <TableContainer component={Paper} style={{width: '500px', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        <Table sx={{ minWidth: 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{fontSize: '15px'}}>Product Name</StyledTableCell>
              <StyledTableCell style={{fontSize: '15px'}}>Product_Image</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <StyledTableRow key={product.id} onClick={() => handleRowClick(product)}>
                <StyledTableCell component="th" scope="row" style={{fontSize: '14px'}}
                >
                  {product.product_name}
                </StyledTableCell>
                <StyledTableCell>
                  <img src={product.product_image} alt={product.product_name} style={{ maxWidth: '100px' }} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedProduct && <DetailsTable selectedProduct={selectedProduct} />}
    </React.Fragment>
  );
}
