

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

export default function ProductCategory() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [productTypes, setProductTypes] = useState([]);  // Renamed to productTypes
  const [newProductType, setNewProductType] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/product-category/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/product-category/", { name: newCategory });
      setNewCategory(""); // Clear the input field
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };


  // useEffect(() => {
  //   fetchProductTypes();
  // }, []);

  // const fetchProductTypes = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:8000/product-type/");
  //     setProductTypes(response.data);
  //   } catch (error) {
  //     console.error("Error fetching product type", error);
  //   }
  // };

  // const handleProductTypeInputChange = (e) => {
  //   setNewProductType(e.target.value);
  // };

  // const handleProducttypeSubmit = async () => {
  //   try {
  //     await axios.post("http://localhost:8000/product-type/", { type: newProductType });
  //     setNewProductType("");
  //     fetchProductTypes();
  //   } catch (error) {
  //     console.error("Error fetching to add product types", error);
  //   }
  // };

  return (
    <div className="main">
      <div className="category">
        <h1 style={{ marginLeft: "450px", textAlign: "center" }}>
          Product Category Page
        </h1>
        <TextField
          id="outlined-basic"
          label="Product Category Name"
          variant="outlined"
          style={{ marginTop: "70px", marginLeft: "300px" }}
          placeholder="Enter Category"
          value={newCategory}
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
        <Table sx={{ minWidth: 100 }} aria-label="simple table" >
          <TableHead>
            <TableRow >
                <TableCell > Product Id </TableCell>
              <TableCell>Product Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                 <TableCell >
                  {category.id}
                </TableCell>
                
                <TableCell >
                  {category.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>







      {/* <div className="category">
        <h1 style={{ marginLeft: "450px", textAlign: "center" }}>
          Product Type Page
        </h1>
        <TextField
          id="outlined-basic"
          label="Product Category Name"
          variant="outlined"
          style={{ marginTop: "70px", marginLeft: "300px" }}
          placeholder="Enter Product Type"
          value={newProductType}
          onChange={handleProductTypeInputChange}
        />
      </div>
      <br />
      <Button
        variant="contained"
        color="success"
        style={{ marginLeft: "300px" }}
        onClick={handleProducttypeSubmit}
      >
        Submit
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 100 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Product Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productTypes.map((productType) => (  // Updated to use productTypes
              <TableRow key={productType.id}>
                <TableCell>{productType.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </div>
  );
}

