import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper, TextField, Select, MenuItem, FormControl, InputLabel, TextareaAutosize } from '@mui/material';


const SaleOrder = () => {
    const [saleOrders, setSaleOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [newOrderData, setNewOrderData] = useState({
        customer: '',
        invoice_address: '',
        delivery_address:'',
        expiration_date:'',
        payment_terms:'',
        order_products: [],
    });
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedSaleOrder, setSelectedSaleOrder] = useState(null);

    useEffect(() => {
        // Fetch existing sale orders
        axios.get('http://localhost:8000/saleorders/')
            .then(response => {
                setSaleOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching sale orders:', error);
            });

        // Fetch existing customers
        axios.get('http://localhost:8000/customers/')
            .then(response => {
                setCustomers(response.data);
            })
            .catch(error => {
                console.error('Error fetching customers:', error);
            });

        // Fetch existing products
        axios.get('http://localhost:8000/product/')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewOrderData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProductChange = (event, index) => {
        const { name, value } = event.target;
        const updatedProducts = [...newOrderData.order_products];
        updatedProducts[index][name] = value;
        setNewOrderData(prevData => ({
            ...prevData,
            order_products: updatedProducts,
        }));
    };

    const handleAddProduct = () => {
        setNewOrderData(prevData => ({
            ...prevData,
            order_products: [...prevData.order_products, { product: '', quantity: '',additional_taxes:'',discount:'' }],
        }));
    };

    const handleTableRowClick = (saleOrder) => {
        // Set the selected sale order and open the modal
        setSelectedSaleOrder(saleOrder);
        setViewModal(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/saleorders/', newOrderData)
            .then(response => {
                setSaleOrders([...saleOrders, response.data]);
                setNewOrderData({
                    customer: '',
                    invoice_address: '',
                    delivery_address: '',
                    expiration_date: '',
                    payment_terms: '',
                    order_products: [],
                });
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error creating sale order:', error);
            });
    };
    

    return (
        <div>
             <h1 style={{marginLeft:'10px',fontFamily:'serif'}}> Sale Order </h1>
            <Button variant="contained" color="primary" onClick={() => setShowModal(true)} style={{marginLeft: '900px'}}>
                Add Sale Order
            </Button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TableContainer component={Paper} style={{ padding: '20px', margin: '20px', backgroundColor: '#f5f5f5',maxWidth: '500px' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize: '15px'}}>ID</TableCell>
                        <TableCell style={{fontSize: '15px'}}>Customer</TableCell>
                        <TableCell style={{fontSize: '15px'}}>Invoice Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {saleOrders.map(order => (
                        <TableRow key={order.id} onClick={() => handleTableRowClick(order)} style={{ cursor: 'pointer' }}>
                            <TableCell style={{fontSize: '14px'}}>{order.id}</TableCell>
                            <TableCell style={{fontSize: '14px'}}>{order.customer.name}</TableCell>
                            <TableCell style={{fontSize: '14px'}}>{order.invoice_address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

            </div>
            

            {/* Modal for creating sale order */}
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <div style={{ margin: 20, padding: 20, backgroundColor: 'white',maxWidth: '600px', maxHeight: '100vh', overflowY: 'auto', marginBottom: '50px',marginLeft: '250px' }}>
                
                    <h2>Add Sale Order</h2>
                    {/* Form for creating sale order */}
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Customer</InputLabel>
                            <Select name="customer" value={newOrderData.customer} onChange={handleInputChange}>
                                <MenuItem value="">Select a customer</MenuItem>
                                {customers.map(customer => (
                                    <MenuItem key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <FormControl fullWidth margin="normal">
                            <InputLabel>Invoice Address</InputLabel>
                            <TextareaAutosize style={{ minHeight: '80px' }} rowsMin={3} name="invoice_address" value={newOrderData.invoice_address} onChange={handleInputChange} />
                        </FormControl> */}

                        <TextField fullWidth label="invoice_address" id="fullWidth"  name='invoice_address'
                            value={newOrderData.invoice_address}
                            onChange={handleInputChange}
                            style={{marginBottom: '10px'}}
                            />
                        {/* <FormControl fullWidth margin="normal">
                            <InputLabel>Delivery Address</InputLabel>
                            <TextareaAutosize style={{ minHeight: '80px' }} rowsMin={3} name="delivery_address" value={newOrderData.delivery_address} onChange={handleInputChange} />
                        </FormControl> */}
                       
                           <TextField fullWidth label="Delivery address" id="fullWidth" name='delivery_address'
                                value={newOrderData.delivery_address}
                                onChange={handleInputChange}
                                style={{marginBottom: '10px'}}
                            />
                        {/* <FormControl fullWidth margin="normal">
                            <InputLabel>Expiration Date</InputLabel>
                            <TextField
                                type="date"
                                name="expiration_date"  
                                value={newOrderData.expiration_date}  
                                onChange={handleInputChange}  
                            />
                        </FormControl> */}
                           <TextField fullWidth label="Expiration date" id="fullWidth" name='expiration_date'
                                type='date'
                                value={newOrderData.expiration_date}
                                onChange={handleInputChange}
                                style={{marginBottom: '10px'}}
                           />
                       
                        <TextField fullWidth label="Payment Terms" id="fullWidth" name='payment_terms'
                               
                                value={newOrderData.payment_terms}
                                onChange={handleInputChange}
                                style={{marginBottom: '10px'}}
                           />


                        {/* Order Products */}
                        {newOrderData.order_products.map((product, index) => (
                            <div key={index}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Product</InputLabel>
                                    <Select name="product" value={product.product} onChange={(e) => handleProductChange(e, index)}>
                                        <MenuItem value="">Select a product</MenuItem>
                                        {products.map(prodItem => (
                                            <MenuItem key={prodItem.id} value={prodItem.id}>
                                                {prodItem.product_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField type="number" label="Quantity" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(e, index)} />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        type="number"
                                        label="Additional taxes"
                                        name="additional_taxes"
                                        value={product.additional_taxes}
                                        onChange={(e) => handleProductChange(e, index)}
                                        InputProps={{
                                            inputProps: {
                                                step: 0.01, // Set the step for decimal values
                                            },
                                        }}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        type="number"
                                        label="Discount"
                                        name="discount"
                                        value={product.discount}
                                        onChange={(e) => handleProductChange(e, index)}
                                        InputProps={{
                                            inputProps: {
                                                step: 0.01, // Set the step for decimal values
                                            },
                                        }}
                                    />
                                </FormControl>
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="contained" color="secondary" onClick={handleAddProduct}>Add Product</Button>

                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal for creating and displaying sale order details */}
            <Modal open={viewModal} onClose={() => setViewModal(false)}>
                <div style={{ margin: 20, padding: 20, backgroundColor: 'white',maxWidth: '600px', maxHeight: '100vh', overflowY: 'auto', marginBottom: '50px',marginLeft: '500px'}}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-20px' }}>
                        <Button onClick={() => setViewModal(false)} style={{ padding: '0', marginRight: '-10px', marginTop: '-10px' }}>
                            X
                        </Button>
                    </div>
                    <h2>{`Sale Order Details - ID: ${selectedSaleOrder ? selectedSaleOrder.id : ''}`}</h2>
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
                    <TableCell>Quantity</TableCell>
                    <TableCell>Additional Taxes</TableCell>
                    <TableCell>Discount</TableCell>
                    <TableCell>Subtotal Price</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {selectedSaleOrder.order_products.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>{product.product.product_name}</TableCell>
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
        </div>
    );
};

export default SaleOrder;














