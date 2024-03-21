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
  Grid
} from '@mui/material';
import BASE_URL from '../../config';

const SaleorderCreation= () => {
  const [saleOrders, setSaleOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  const [orderProducts, setOrderProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productData, setProductData] = useState({});
  const [showTable, setShowTable] = useState(false);
  

  useEffect(() => {
    // Fetch existing sale orders, customers, and products
    axios.get(`${BASE_URL}/saleorders/`)
      .then(response => {
        setSaleOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching sale orders:', error);
      });

    axios.get(`${BASE_URL}/view-customers/`)
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });

    axios.get(`${BASE_URL}/view-products/`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  


  const handleCreateSaleOrder = () => {
    axios.post(`${BASE_URL}/saleorders/`, formData)
      .then(response => {
        setSaleOrders([...saleOrders, response.data]);
        setShowForm(false);
        setOrderProducts([]);
        window.location.href = '/SaleOrder1';
      })
      .catch(error => console.error('Error creating sale order:', error));
  };

  const handleSaleOrder = () => {
    axios.delete(`${BASE_URL}/orderproducts/delete/`)
      .then(response => {
        console.log('Order Product deleted successfully');
        setOrderProducts([]);
      })
      .catch(error => {
        console.error('Error deleting Order Product:', error);
      });
  };

  const handleAddOrderProduct = () => {
    axios.post(`${BASE_URL}/orderproducts/`, productData)
      .then(response => {
        setOrderProducts([...orderProducts, response.data]);
        setShowModal(false);
        setShowTable(true);
      })
      .catch(error => console.error('Error adding order product:', error));
  };

  const handleCloseForm = () => {
    setOrderProducts([]);
    setShowForm(false);
  };



return (
  <Grid container>
    <Grid item xs={15}>
      <Typography variant="h3" component="h2" className='typography' style={{ fontWeight: 'bold' }}>
        Sale Order
      </Typography>
    </Grid>
    <Grid item xs={9} ml={23} >
      <Paper elevation={3} className='sale-order-paper'>
      <FormControl fullWidth>
            <InputLabel htmlFor="customer">Customer</InputLabel>
            <Select
              id="customer"
              value={formData.customer || ''}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              style={{ marginBottom: '20px' }}
            >
              <MenuItem value="">
                <em>Select a customer</em>
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>

            <div style={{ display: 'flex', marginBottom: '20px' }}>
            <TextField
              id="invoiceAddress"
              label="Invoice Address"
              multiline
              rows={5}
              value={formData.invoice_address || ''}
              onChange={(e) => setFormData({ ...formData, invoice_address: e.target.value })}
              style={{ marginRight: '30px',marginBottom: '20px',width: '40%' }}
            />
            <TextField
              id="deliveryAddress"
              label="Delivery Address"
              multiline
              rows={5}
              value={formData.delivery_address || ''}
              onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
              style={{ marginBottom: '20px',marginLeft: '30px', width:'40%' }}
           
            />
            </div>
            <TextField
              id="expirationDate"
              label="Expiration Date"
              type="date"
              value={formData.expiration_date || ''}
              onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
              style={{ marginBottom: '20px' }}
             
            />

            <TextField
              id="paymentTerms"
              label="Payment Terms"
              type="text"
              value={formData.payment_terms || ''}
              onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
              style={{ marginBottom: '20px' }}
              
            />

            <Button 
              variant="contained" 
              style={{ marginBottom: '20px' }}
              onClick={() => {setShowModal(true);
                setShowTable(false);
              }}
            >
              Add Order Lines
            </Button>
            {showTable && (
            <TableContainer>
            <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit price</TableCell>
                <TableCell>Taxes</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Subtotal Price</TableCell>
                {/* Add more headers as needed */}
              </TableRow>
            </TableHead>
              <TableBody>
                {orderProducts.filter(orderProduct => orderProduct.sale_order === null).map(orderProduct => (
                  <TableRow key={orderProduct.id}>
                    {/* Order Product table data */}
                    <TableCell>{orderProduct.product.name}</TableCell>
                    <TableCell>{orderProduct.quantity}</TableCell>
                    <TableCell>{orderProduct.unit_price}</TableCell>
                    <TableCell>{orderProduct.additional_taxes}</TableCell>
                    <TableCell>{orderProduct.discount}</TableCell>
                    <TableCell>{orderProduct.subtotal_price}</TableCell>
                    {/* Add more order product data as needed */}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5}>Total</TableCell>
                  <TableCell>
                
                    {orderProducts
                      .filter(orderProduct => orderProduct.sale_order === null)
                      .reduce((total, orderProduct) => total + parseFloat(orderProduct.subtotal_price), 0)
                    }
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

            )}
          
            
            <Button 
              variant="contained" 
              color='success'
              onClick={handleCreateSaleOrder}
              style={{ marginTop: '20px' }}
            >
              Create Sale Order
            </Button>
          </FormControl>
      </Paper>
    </Grid>
    <Modal open={showModal} onClose={() => setShowModal(false)} 
      style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <InputLabel htmlFor="product">Product</InputLabel>
          <Select
            id="product"
            value={productData.product || ''}
            onChange={(e) => {
              const selectedProductId = e.target.value;
              const selectedProduct = products.find(product => product.id === selectedProductId);
              setProductData({ ...productData, product: selectedProductId,unit_price: selectedProduct.sales_price });
            }}
            // onChange={(e) => setProductData({ ...productData, product: e.target.value })}
            style={{ marginBottom: '20px',width: '20%' }}
          >
            <MenuItem value="">
              <em>Select a product</em>
            </MenuItem>
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            id="unitPrice"
            label="Unit Price"
            type="number"
            value={productData.unit_price || ''}
            onChange={(e) => setProductData({ ...productData, unit_price: e.target.value })}
            style={{ marginBottom: '20px', marginLeft: '20px'}}
          /><br/>

          <TextField
            id="quantity"
            label="Quantity"
            type="number"
            value={productData.quantity || ''}
            onChange={(e) => setProductData({ ...productData, quantity: e.target.value })}
            style={{ marginBottom: '20px' }}
          />

          <TextField
            id="additionalTaxes"
            label="Additional Taxes"
            type="number"
            value={productData.additional_taxes || ''}
            onChange={(e) => setProductData({ ...productData, additional_taxes: e.target.value })}
            style={{ marginBottom: '20px' ,marginLeft: '20px' }}
          /><br/>

          <TextField
            id="discount"
            label="Discount"
            type="number"
            value={productData.discount || ''}
            onChange={(e) => setProductData({ ...productData, discount: e.target.value })}
            style={{ marginBottom: '20px' }}
          /><br/>

          <Button variant="contained" onClick={handleAddOrderProduct}>Add Order Product</Button>
        </div>
      </Modal>

  </Grid>
);
};

export default SaleorderCreation;

