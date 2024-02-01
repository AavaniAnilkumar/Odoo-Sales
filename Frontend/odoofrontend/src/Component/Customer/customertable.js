import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Avatar ,TextField} from '@mui/material';
import CustomerForm from './customerform';
const CustomerTable = ({ shouldRefreshTable, setShouldRefreshTable }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCreateCustomerPage, setShowCreateCustomerPage] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null); // Define editedCustomer state
  const [isEditing,setIsEditing]=useState(false);
  useEffect(() => {
    fetchCustomers();
  }, [shouldRefreshTable]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/customers/');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setShouldRefreshTable(false);
      } else {
        console.error('Failed to fetch customers:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const handleDetailClick = (customer) => {
  //   setSelectedCustomer(customer);
  //   setShowDetailsDialog(true);
  // };
  const handleDetailClick = async (customer) => {
    try {
      // Fetch customer details
      const response = await fetch(`http://localhost:8000/customers/${customer.id}/`);
      if (response.ok) {
        const customerData = await response.json();
        
        // Fetch contact details for the specific customer using the API endpoint
        const contactResponse = await fetch(`http://localhost:8000/customer_contact/${customer.id}/`);
        if (contactResponse.ok) {
          const contactData = await contactResponse.json();
          // Check if contact data exists
          if (contactData.length > 0) {
            customerData.contact = contactData[0]; // Assuming a customer has only one associated contact
            setSelectedCustomer(customerData);
            setShowDetailsDialog(true);
          } else {
            console.error('No contact details found for customer:', customer.id);
          }
        } else {
          console.error('Failed to fetch contact details:', contactResponse.statusText);
        }
      } else {
        console.error('Failed to fetch customer details:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
  };

  const handleCreateCustomer = () => {
    setShowCreateCustomerPage(true);
  };

  const handleCloseCreateCustomerPage = () => {
    setShowCreateCustomerPage(false);
  };

    // Edit the selected customer's details
    const handleEditCustomer = () => {
      setEditedCustomer({ ...selectedCustomer });
      setIsEditing(true);
    };
  
    // Update the edited customer's data
  const handleSaveEdit = async () => {
  try {
    const formData = new FormData();
    formData.append('id', editedCustomer.id);
    formData.append('name', editedCustomer.name);
    formData.append('address', editedCustomer.address);
    formData.append('city', editedCustomer.city);
    formData.append('state', editedCustomer.state);
    formData.append('zip_code', editedCustomer.zip_code);
    formData.append('country', editedCustomer.country);

    const response = await fetch(`http://localhost:8000/customers/${editedCustomer.id}/update/`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      console.log('Customer updated successfully');
      if (editedCustomer.contact && editedCustomer.contact.email && editedCustomer.contact.mobile) {
        const contactFormData = new FormData();
        contactFormData.append('customer_id', editedCustomer.id);
        contactFormData.append('email', editedCustomer.contact.email);
        contactFormData.append('mobile', editedCustomer.contact.mobile);

        const contactResponse = await fetch(`http://localhost:8000/customer_contact/${editedCustomer.id}/update/`, {
          method: 'PUT',
          body: contactFormData,
        });

        if (contactResponse.ok) {
          console.log('Contact details updated successfully');
        } else {
          console.error('Failed to update contact details:', contactResponse.statusText);
        }
      }
      
      // Update selectedCustomer state with edited data
      setSelectedCustomer(editedCustomer);
      setShowDetailsDialog(true); // Open the details dialog
      setEditedCustomer(null); // Reset editedCustomer state
    } else {
      console.error('Failed to update customer:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

    // Handle changes in the edited customer's data
    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      
      // If the field is part of the contact object, update it accordingly
      if (name.startsWith('contact.')) {
        setEditedCustomer((prevCustomer) => ({
          ...prevCustomer,
          contact: {
            ...prevCustomer.contact,
            [name.split('.')[1]]: value,
          },
        }));
      } else {
        // Otherwise, update the top-level property
        setEditedCustomer((prevCustomer) => ({
          ...prevCustomer,
          [name]: value,
        }));
      }
    };
    

  return (
    <div style={{width:'100%', marginLeft:'150px'}}>
      {!showCreateCustomerPage ? (
        <>
        <h1 style={{marginLeft:'10px',fontFamily:'serif'}}>Customer</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    {/* <TableCell>
                      {customer.photo ? (
                        <Avatar alt={customer.name} src={customer.photo} variant="circular" />
                      ) : (
                        <Avatar>{customer.name.charAt(0)}</Avatar>
                      )}
                    </TableCell> */}
                     <TableCell>
    {customer.photo ? (
      <Avatar src={`http://localhost:8000${customer.photo}`} variant="circular" />

    ) : (
      <Avatar>{customer.name.charAt(0)}</Avatar>
    )}
  </TableCell>
  
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleDetailClick(customer)}>Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Customer Details Dialog */}
          <Dialog open={showDetailsDialog} onClose={handleCloseDetailsDialog} fullWidth>
  <DialogTitle style={{marginLeft:'200px'}}>Customer Details</DialogTitle>
  <DialogContent>
  {selectedCustomer ? (
  <div>
    <div style={{ textAlign: 'center' }}>
      {selectedCustomer.photo && (
        <div>
          <img src={`http://localhost:8000${selectedCustomer.photo}`} alt={selectedCustomer.name} style={{ width: 150, height: 150, borderRadius: '50%' }} />
        </div>
      )}
      {!editedCustomer ? (
            <div>
              <Typography variant="h6" style={{ marginBottom: '10px' ,fontFamily:'cursive'}}> {selectedCustomer.name}</Typography>
              <Typography variant="body1" style={{ marginBottom: '5px' ,fontFamily:'monospace'}}>Address: {selectedCustomer.address}</Typography>
              <Typography variant="body1" style={{ marginBottom: '5px',marginRight:'118px',fontFamily:'monospace' }}>City: {selectedCustomer.city}</Typography>
              <Typography variant="body1" style={{ marginBottom: '5px',marginRight:'102px',fontFamily:'monospace' }}>State: {selectedCustomer.state}</Typography>
              <Typography variant="body1" style={{ marginBottom: '5px',marginRight:'73px',fontFamily:'monospace' }}>Zip Code: {selectedCustomer.zip_code}</Typography>
              <Typography variant="body1" style={{ marginBottom: '15px',marginRight:'90px' ,fontFamily:'monospace'}}>Country: {selectedCustomer.country}</Typography>
              { selectedCustomer.contact && (
  <div>
    <Typography variant="body1" style={{ marginBottom: '5px',marginLeft:'45px',fontFamily:'monospace'}}>Email: {selectedCustomer.contact.email}</Typography>
    <Typography variant="body1" style={{ marginBottom: '5px' ,marginRight:'53px',fontFamily:'monospace'}}>Mobile: {selectedCustomer.contact.mobile}</Typography>
  </div>
)}

              {/* <Button onClick={handleEditCustomer} color="primary">
                Edit
              </Button> */}
            </div>
          ) : (
            <div>
              {/* <input
                type="file"
                name="photo"
                onChange={handlePhotoChange}
            /> */}
             <TextField name="name" label="Name" value={editedCustomer.name} onChange={handleFieldChange} fullWidth />
<br/><br/>
<TextField name="address" label="Address" value={editedCustomer.address} onChange={handleFieldChange} fullWidth />
<br/><br/>
<TextField name="city" label="City" value={editedCustomer.city} onChange={handleFieldChange} fullWidth />
<br/><br/>
<TextField name="state" label="State" value={editedCustomer.state} onChange={handleFieldChange} fullWidth />
<br/><br/>
<TextField name="zip_code" label="Zip Code" value={editedCustomer.zip_code} onChange={handleFieldChange} fullWidth />
<br/><br/>
<TextField name="country" label="Country" value={editedCustomer.country} onChange={handleFieldChange} fullWidth />
<br/><br/>
{selectedCustomer.contact && (
  <div>
    <TextField name="contact.email" label="Email" value={editedCustomer.contact?.email || ''} onChange={handleFieldChange} fullWidth />
<br/><br/>
<TextField name="contact.mobile" label="Mobile" value={editedCustomer.contact?.mobile || ''} onChange={handleFieldChange} fullWidth />
<br/><br/>

  </div>
)}

    {/* Add oth
              {/* Add other fields as necessary */}
            </div>
          )}
        </div>
      </div>
    ) : null}
  </DialogContent>
  {/* <DialogActions>
    <Button onClick={handleCloseDetailsDialog} color="primary">Close</Button>
    <Button onClick={handleEditCustomer} color="primary">Edit</Button>

  </DialogActions> */}
  <DialogActions>
    {!editedCustomer ? (
      <>
      <Button onClick={handleEditCustomer} color="primary">
        Edit
      </Button>
       <Button onClick={handleCloseDetailsDialog} color="primary">
          Close
        </Button>
      </>
    ) : (
      <>
        <Button onClick={handleSaveEdit} color="primary">
          Save
        </Button>
        <Button onClick={handleCloseDetailsDialog} color="primary">
          Close
        </Button>
      </>
    )}
  </DialogActions>
</Dialog>



          
          <Button style={{ marginLeft: '40px' }} variant="contained" color="primary" onClick={handleCreateCustomer}>Create Customer</Button>
        </>
      ) : (
        <CustomerForm onClose={handleCloseCreateCustomerPage} />
      )}
    </div>
    
  );
};

export default CustomerTable;