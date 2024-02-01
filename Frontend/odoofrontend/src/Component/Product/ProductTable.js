

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
            <StyledTableCell>Product Type</StyledTableCell>
            <StyledTableCell>Product Category</StyledTableCell>
            <StyledTableCell>Company</StyledTableCell>
            <StyledTableCell>Sales Price</StyledTableCell>
           
            {/* <StyledTableCell>Customer Tax</StyledTableCell> */}

            <StyledTableCell>Cost</StyledTableCell>
            {/* Add more fields here */}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow key={selectedProduct.id}>
            <StyledTableCell>{selectedProduct.product_type}</StyledTableCell>
            <StyledTableCell>{selectedProduct.product_category}</StyledTableCell>
            <StyledTableCell>{selectedProduct.company}</StyledTableCell>
            <StyledTableCell>{selectedProduct.sales_price}</StyledTableCell>
           
            {/* <StyledTableCell>{selectedProduct.customer_tax}</StyledTableCell> */}
            <StyledTableCell>{selectedProduct.cost}</StyledTableCell>

            {/* Add more cells here */}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
    // <Paper elevation={3} style={{ padding: '20px', marginTop: '-400px', marginLeft: '900px', width: 'fit-content' }}>
    //   <Typography variant="h6">Product Details</Typography>
    //   <Typography variant="body1">
    //     <strong>Product Type:</strong> {selectedProduct.product_type}
    //   </Typography>
    //   <Typography variant="body1">
    //     <strong>Product Category:</strong> {selectedProduct.product_category}
    //   </Typography>
    //   <Typography variant="body1">
    //     <strong>Company:</strong> {selectedProduct.company}
    //   </Typography>
    //   <Typography variant="body1">
    //     <strong>Sales Price:</strong> {selectedProduct.sales_price}
    //   </Typography>
    //   {/* Uncomment the next line if customer_tax is needed */}
    //   {/* <Typography variant="body1"><strong>Customer Tax:</strong> {selectedProduct.customer_tax}</Typography> */}
    //   <Typography variant="body1">
    //     <strong>Cost:</strong> {selectedProduct.cost}
    //   </Typography>
    //   {/* Add more fields here */}
    // </Paper>
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
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Product_Image</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <StyledTableRow key={product.id} onClick={() => handleRowClick(product)}>
                <StyledTableCell component="th" scope="row" 
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
