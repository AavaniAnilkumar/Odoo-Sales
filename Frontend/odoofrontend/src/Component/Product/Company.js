
// import { useState, useEffect } from 'react';
// import { TextField } from "@mui/material"
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import axios from 'axios';
// import BASE_URL from '../../config';

// export default function ProductCategory() {
//     const [categories, setCategories] = useState([]);
//     const [newCategory, setNewCategory] = useState('');

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get(`http://localhost:8000/product-category/`);
//             setCategories(response.data);
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []); // Fetch categories on component mount

//     const handleCategorySubmit = async () => {
//         try {
//             await axios.post(`http://localhost:8000/product-category/`, { name: newCategory });
//             // Refresh the categories list after adding a new category
//             fetchCategories();
//         } catch (error) {
//             console.error('Error submitting category:', error);
//         }
//     };

//     return (
//         <div className="main">
//             <div className="category">
//                 <h1 style={{ marginLeft: '450px', textAlign: 'center', }}> Product Category Page</h1>
//                 <TextField
//                     id="outlined-basic"
//                     label="Product Category Name"
//                     variant="outlined"
//                     style={{ marginTop: '70px', marginLeft: '300px' }}
//                     placeholder="Enter Category"
//                     value={newCategory}
//                     onChange={(e) => setNewCategory(e.target.value)}
//                 />

               
//             </div>
//             <Button
//                     variant="contained"
//                     color="success"
//                     style={{ marginLeft: '300px' }}
//                     onClick={handleCategorySubmit}
//                 >
//                     Submit
//                 </Button>
//             <br />

//             <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: 100 }} aria-label="simple table">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Product Name</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {categories.map((category) => (
//                             <TableRow key={category.id}>
//                                 <TableCell component="th" scope="row">
//                                     {category.name}
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     );
// }


import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import axios from "axios";
import BASE_URL from "../../config";
export default function Company() {
  const [company, setCompany] = useState([]);
  const [newCompany, setNewCompany] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product/`);
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewCompany(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/company/", { name: newCompany });
      setNewCompany(""); // Clear the input field
      fetchCompany(); // Refresh the categories list
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <div className="main">
      <div className="category">
        <h1 style={{ marginLeft: "450px", textAlign: "center" }}>
         Company Page
        </h1>
        <TextField
          id="outlined-basic"
          label="Product Category Name"
          variant="outlined"
          style={{ marginTop: "70px", marginLeft: "300px" }}
          placeholder="Enter Company"
          value={newCompany}
          onChange={handleInputChange}
        />
      </div>
      <br />
      <Button
        variant="contained"
        color="success"
        style={{ marginLeft: "300px" }}
        onClick={handleSubmit}
      >
        Submit
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 100 }} aria-label="simple table">
          <TableHead>
            <TableRow>
                <TableCell> Company Id </TableCell>
              <TableCell>Company Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {company.map((company) => (
              <TableRow key={company.id}>
                 <TableCell >
                  {company.id}
                </TableCell>
                
                <TableCell >
                  {company.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

