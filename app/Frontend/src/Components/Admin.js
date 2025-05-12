import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput, MDBCardHeader } from 'mdb-react-ui-kit';
import ResponsiveAppBar from './ResponsiveAppBar';
import Buttons from './Buttons';

const Admin = () => {
  const [adminName, setAdminName] = useState('');
  const [empId, setEmpId] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [allAdmins, setAllAdmins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }
      const data = await response.json();
      setAdmins(data);
      setAllAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleSubmit = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    const adminData = { adminName, empId, city, password };
    const url = editingAdmin ? `http://localhost:5000/api/admins/${editingAdmin._id}` : 'http://localhost:5000/api/admins';
    const method = editingAdmin ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(adminData),
      });

      if (response.ok) {
        alert(`${editingAdmin ? 'Admin updated' : 'Admin created'} successfully!`);
        handleReset();
        fetchAdmins();
      } else {
        alert(`Failed to ${editingAdmin ? 'update' : 'create'} admin.`);
      }
    } catch (error) {
      console.error(`Error ${editingAdmin ? 'updating' : 'creating'} admin:`, error);
      alert(`An error occurred while ${editingAdmin ? 'updating' : 'creating'} admin.`);
    }
  };

  const handleReset = () => {
    setAdminName('');
    setEmpId('');
    setCity('');
    setPassword('');
    setEditingAdmin(null);
  };

  const handleEdit = (admin) => {
    setAdminName(admin.adminName);
    setEmpId(admin.empId);
    setCity(admin.city);
    setPassword(admin.password);
    setEditingAdmin(admin);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admins/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Admin deleted successfully!');
        fetchAdmins();
      } else {
        alert('Failed to delete admin.');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('An error occurred while deleting admin.');
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredAdmins = allAdmins.filter(admin =>
      admin.adminName.toLowerCase().includes(searchTerm)
    );
    setAdmins(searchTerm ? filteredAdmins : allAdmins);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <MDBContainer className="my-5">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', height: '50px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <Typography variant="h5">
              {editingAdmin ? 'Edit Admin' : 'Create Admin'}
            </Typography> 
          </MDBCardHeader>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="6" className="mb-3">
              <label>Admin Name</label>
                <MDBInput
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Employee ID</label>
                <MDBInput
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Select City</label>
                <FormControl fullWidth size="small">
                  <Select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Islamabad">Islamabad</MenuItem>
                    <MenuItem value="Karachi">Karachi</MenuItem>
                    <MenuItem value="Lahore">Lahore</MenuItem>
                  </Select>
                </FormControl>
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Password</label>
                <MDBInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
              </MDBCol>
              <MDBCol className="d-flex justify-content-end">
                <Buttons
                  color="success"
                  label="Submit"
                  onClick={handleSubmit}
                  x="10px"
                />
                <Buttons
                  color="danger"
                  label="Reset"
                  onClick={handleReset}
                  x="10px"
                />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className='mb-4'>
          <MDBCardHeader style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          height: '75px', 
          backdropFilter: 'blur(10px)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
            <Typography variant="h6">Admin List</Typography>
            <MDBCol md="4" className="mb-3">
            <label>Search</label>
              <MDBInput
                value={searchTerm}
                onChange={handleSearch}
                size="sm"
              />
            </MDBCol>
          </MDBCardHeader>
          <MDBCardBody>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Serial No.</TableCell>
                    <TableCell>Admin Name</TableCell>
                    <TableCell>Emp ID</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell>Entry Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentAdmins.map((admin, index) => (
                    <TableRow key={admin._id}>
                      <TableCell>{indexOfFirstAdmin + index + 1}</TableCell>
                      <TableCell>{admin.adminName}</TableCell>
                      <TableCell>{admin.empId}</TableCell>
                      <TableCell>{admin.city}</TableCell>
                      <TableCell>{admin.password}</TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton color='primary' onClick={() => handleEdit(admin)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton style={{ color: 'red' }} onClick={() => handleDelete(admin._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <Pagination
                count={Math.ceil(admins.length / adminsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default Admin;
