import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput, MDBCardHeader } from 'mdb-react-ui-kit';
import ResponsiveAppBar from './ResponsiveAppBar';
import Buttons from './Buttons';

const Trainee = () => {
  const [traineeID, setTraineeID] = useState('');
  const [name, setName] = useState('');
  const [cnic, setCNIC] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [packageName, setPackageName] = useState('');
  const [packages, setPackages] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTrainee, setEditingTrainee] = useState(null);
  const [allTrainees, setAllTrainees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const traineesPerPage = 5;

  useEffect(() => {
    fetchTrainees();
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/packages', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchTrainees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainee', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trainees');
      }
      const data = await response.json();
      setTrainees(data);
      setAllTrainees(data);
    } catch (error) {
      console.error('Error fetching trainees:', error);
    }
  };

  const handleSubmit = async () => {
    const traineeData = { traineeID, name, cnic, phoneNumber, emailAddress, city, status, packageName };
    const url = editingTrainee ? `http://localhost:5000/api/trainee/${editingTrainee._id}` : 'http://localhost:5000/api/trainee';
    const method = editingTrainee ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(traineeData),
      });

      if (response.ok) {
        alert(`${editingTrainee ? 'Trainee updated' : 'Trainee created'} successfully!`);
        handleReset();
        fetchTrainees();
      } else {
        alert(`Failed to ${editingTrainee ? 'update' : 'create'} trainee.`);
      }
    } catch (error) {
      console.error(`Error ${editingTrainee ? 'updating' : 'creating'} trainee:`, error);
      alert(`An error occurred while ${editingTrainee ? 'updating' : 'creating'} trainee.`);
    }
  };

  const handleReset = () => {
    setTraineeID('');
    setName('');
    setCNIC('');
    setPhoneNumber('');
    setEmailAddress('');
    setCity('');
    setStatus('');
    setPackageName('');
    setEditingTrainee(null);
  };

  const handleEdit = (trainee) => {
    setTraineeID(trainee.traineeID);
    setName(trainee.name);
    setCNIC(trainee.cnic);
    setPhoneNumber(trainee.phoneNumber);
    setEmailAddress(trainee.emailAddress);
    setCity(trainee.city);
    setStatus(trainee.status);
    setPackageName(trainee.packageName);
    setEditingTrainee(trainee);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trainee/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Trainee deleted successfully!');
        fetchTrainees();
      } else {
        alert('Failed to delete trainee.');
      }
    } catch (error) {
      console.error('Error deleting trainee:', error);
      alert('An error occurred while deleting trainee.');
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredTrainees = allTrainees.filter(trainee =>
      trainee.name.toLowerCase().includes(searchTerm)
    );
    setTrainees(searchTerm ? filteredTrainees : allTrainees);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCNICChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCNIC(value);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setPhoneNumber(value);
  };

  const indexOfLastTrainee = currentPage * traineesPerPage;
  const indexOfFirstTrainee = indexOfLastTrainee - traineesPerPage;
  const currentTrainees = trainees.slice(indexOfFirstTrainee, indexOfLastTrainee);

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <MDBContainer className="my-5">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', height: '50px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <Typography variant="h5">
              {editingTrainee ? 'Edit Trainee' : 'Create Trainee'}
            </Typography>
          </MDBCardHeader>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="6" className="mb-3">
              <label>Trainee ID</label>
                <MDBInput
                  name="traineeID"
                  value={traineeID}
                  onChange={(e) => setTraineeID(e.target.value)}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Name</label>
                <MDBInput
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>CNIC</label>
                <MDBInput
                  name="cnic"
                  value={cnic}
                  onChange={handleCNICChange}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Phone Number</label>
                <MDBInput
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Email Address</label>
                <MDBInput
                  name="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>City</label>
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
              <label>Status</label>
              <FormControl fullWidth size="small">
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Package Name</label>
                <FormControl fullWidth size="small">
                  <Select
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    label="Package Name"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {packages.map(pkg => (
                      <MenuItem key={pkg._id} value={pkg.name}>
                        {pkg.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            <Typography variant="h6">Trainee List</Typography>
            <MDBCol md="4" className="mb-3">
              <label>Search</label>
              <MDBInput
                name="search"
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
                    <TableCell>Trainee ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>CNIC</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Email Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTrainees.map((trainee, index) => (
                    <TableRow key={trainee._id}>
                      <TableCell>{indexOfFirstTrainee + index + 1}</TableCell>
                      <TableCell>{trainee.traineeID}</TableCell>
                      <TableCell>{trainee.name}</TableCell>
                      <TableCell>{trainee.cnic}</TableCell>
                      <TableCell>{trainee.phoneNumber}</TableCell>
                      <TableCell>{trainee.emailAddress}</TableCell>
                      <TableCell>{trainee.city}</TableCell>
                      <TableCell>{trainee.status}</TableCell>
                      <TableCell>{trainee.packageName}</TableCell>
                      <TableCell>
                      <Box sx={{ display: 'flex', gap: '1px' }}>
                        <IconButton color='primary' onClick={() => handleEdit(trainee)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton style={{ color: 'red' }} onClick={() => handleDelete(trainee._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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
                count={Math.ceil(trainees.length / traineesPerPage)}
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

export default Trainee;
