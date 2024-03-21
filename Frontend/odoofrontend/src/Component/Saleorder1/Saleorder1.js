import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Modal,
  Button,
  Table,
  FormControl,
  TextField,
  Select,
  Paper,
  MenuItem,
  InputLabel,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Grid,
  Box,
} from '@mui/material';

const SaleOrder1 = ({ handlePageChange }) => {
  const [saleOrders, setSaleOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const [orderProducts, setOrderProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [selectedSaleOrder, setSelectedSaleOrder] = useState(null);
  

  useEffect(() => {
    // Fetch existing sale orders, customers, and products
    axios.get('http://localhost:8000/saleorders/')
      .then(response => {
        setSaleOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching sale orders:', error);
      });

    axios.get('http://localhost:8000/view-customers/')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });

    axios.get('http://localhost:8000/view-products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  


  const handleCreateSaleOrder = () => {
    axios.post('http://localhost:8000/saleorders/', formData)
      .then(response => {
        setSaleOrders([...saleOrders, response.data]);
        setShowForm(false);
        setOrderProducts([]);
      })
      .catch(error => console.error('Error creating sale order:', error));
  };

  const handleSaleOrder = () => {
    axios.delete(`http://localhost:8000/orderproducts/delete/`)
      .then(response => {
        console.log('Order Product deleted successfully');
        setOrderProducts([]);
      })
      .catch(error => {
        console.error('Error in Deleting the product', error);
      });
  };

  const handleAddOrderProduct = () => {
    axios.post('http://localhost:8000/orderproducts/', productData)
      .then(response => {
        setOrderProducts([...orderProducts, response.data]);
        setShowModal(false);
      })
      .catch(error => console.error('Error adding order product:', error));
  };

  const handleTableRowClick = (saleOrder) => {
    // Set the selected sale order and open the modal
    setSelectedSaleOrder(saleOrder);
    setViewModal(true);
  };

  const handleCloseForm = () => {
    setOrderProducts([]);
    setShowForm(false);
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box m={2}>
          <Typography variant="h3" component="h2" fontWeight="bold">
            Sale Order Details
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end" m={2}>
          <Button
            variant="contained"
            onClick={() => {
              handlePageChange('Sale-Order-Creation');
              handleSaleOrder();
            }}
          >
            Create Sale Order
          </Button>
        </Box>
      </Grid>
      <Grid item xs={20}>
        <Box display="flex" justifyContent="center" alignItems="center">
        <TableContainer component={Paper} style={{ padding: '20px', margin: '20px', marginLeft: '20px', backgroundColor: '#f5f5f5',width:'100%' }}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell style={{fontSize: '15px'}}>Order ID</TableCell>
                          <TableCell style={{fontSize: '15px'}}>Customer</TableCell>
                          <TableCell style={{fontSize: '15px'}}>Invoice Address</TableCell>
                          <TableCell style={{fontSize: '15px'}}>Delivery Address</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {saleOrders.map(order => (
                          <TableRow key={order.id} onClick={() => handleTableRowClick(order)} style={{ cursor: 'pointer' }}>
                              <TableCell style={{fontSize: '14px'}}>{order.id}</TableCell>
                              <TableCell style={{fontSize: '14px'}}>{order.customer.name}</TableCell>
                              <TableCell style={{fontSize: '14px'}}>{order.invoice_address}</TableCell>
                              <TableCell style={{fontSize: '14px'}}>{order.delivery_address}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
        </Box>
      </Grid>
      <Grid item xs={12}>
      <Modal open={viewModal} onClose={() => setViewModal(false)}>
                  <div style={{ margin: 20, padding: 20, backgroundColor: 'white',maxWidth: '600px', maxHeight: '100vh', overflowY: 'auto', marginBottom: '50px',marginLeft: '500px'}}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
                          <Button onClick={() => setViewModal(false)} style={{ padding: '0', marginRight: '-10px', marginTop: '-10px' }}>
                              X
                          </Button>
                      </div>
                      {/* <h2>{`Sale Order Details - ID: ${selectedSaleOrder ? selectedSaleOrder.id : ''}`}</h2> */}
                      <h2>
                      <span style={{ fontSize: 'larger' }}>
                        {`Sale Order Details - ID: ${selectedSaleOrder ? selectedSaleOrder.id : ''}`}
                      </span>
                    </h2>

                      {selectedSaleOrder && (
                          <>
                          <TableContainer component={Paper}>
          <Table>
              <TableBody>
                  <TableRow>
                      <TableCell>Customer:</TableCell>
                      <TableCell>{selectedSaleOrder.customer.name}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Invoice Address:</TableCell>
                      <TableCell>{selectedSaleOrder.invoice_address}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Delivery Address:</TableCell>
                      <TableCell>{selectedSaleOrder.delivery_address}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Expiration Date:</TableCell>
                      <TableCell>{selectedSaleOrder.expiration_date}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Payment Terms:</TableCell>
                      <TableCell>{selectedSaleOrder.payment_terms}</TableCell>
                  </TableRow>
                  <TableRow>
                      <TableCell>Total Price:</TableCell>
                      <TableCell>{selectedSaleOrder.total_price}</TableCell>
                  </TableRow>
              </TableBody>
          </Table>
  
          <h5>Order Products:</h5>
  
          <Table>
              <TableHead>
                  <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Additional Taxes</TableCell>
                      <TableCell>Discount</TableCell>
                      <TableCell>Subtotal Price</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {selectedSaleOrder.order_products.map(product => (
                      <TableRow key={product.id}>
                          <TableCell>{product.product.name}</TableCell>
                          <TableCell>{product.unit_price}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.additional_taxes}</TableCell>
                          <TableCell>{product.discount}</TableCell>
                          <TableCell>{product.subtotal_price}</TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
  
                         
                          </>
                      )}
                      <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={() => setViewModal(false)}>
                  Close
              </Button>
          </div>
                  </div>
              </Modal>
      </Grid>
    </Grid>
  );
};

export default SaleOrder1;
