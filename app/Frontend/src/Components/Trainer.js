import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton, Pagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput, MDBCardHeader } from 'mdb-react-ui-kit';
import ResponsiveAppBar from './ResponsiveAppBar';
import Buttons from './Buttons';

const Trainer = () => {
  const [trainerID, setTrainerID] = useState('');
  const [name, setName] = useState('');
  const [cnic, setCNIC] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [allTrainers, setAllTrainers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const trainersPerPage = 5;

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch trainers');
      }
      const data = await response.json();
      setTrainers(data);
      setAllTrainers(data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const handleSubmit = async () => {
    const trainerData = { trainerID, name, cnic, phoneNumber, emailAddress, city, status };
    const url = editingTrainer ? `http://localhost:5000/api/trainer/${editingTrainer._id}` : 'http://localhost:5000/api/trainer';
    const method = editingTrainer ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(trainerData),
      });

      if (response.ok) {
        alert(`${editingTrainer ? 'Trainer updated' : 'Trainer created'} successfully!`);
        handleReset();
        fetchTrainers();
      } else {
        alert(`Failed to ${editingTrainer ? 'update' : 'create'} trainer.`);
      }
    } catch (error) {
      console.error(`Error ${editingTrainer ? 'updating' : 'creating'} trainer:`, error);
      alert(`An error occurred while ${editingTrainer ? 'updating' : 'creating'} trainer.`);
    }
  };

  const handleReset = () => {
    setTrainerID('');
    setName('');
    setCNIC('');
    setPhoneNumber('');
    setEmailAddress('');
    setCity('');
    setStatus('');
    setEditingTrainer(null);
  };

  const handleEdit = (trainer) => {
    setTrainerID(trainer.trainerID);
    setName(trainer.name);
    setCNIC(trainer.cnic);
    setPhoneNumber(trainer.phoneNumber);
    setEmailAddress(trainer.emailAddress);
    setCity(trainer.city);
    setStatus(trainer.status);
    setEditingTrainer(trainer);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trainer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        alert('Trainer deleted successfully!');
        fetchTrainers();
      } else {
        alert('Failed to delete trainer.');
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
      alert('An error occurred while deleting trainer.');
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredTrainers = allTrainers.filter(trainer =>
      trainer.name.toLowerCase().includes(searchTerm)
    );
    setTrainers(searchTerm ? filteredTrainers : allTrainers);
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

  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = trainers.slice(indexOfFirstTrainer, indexOfLastTrainer);

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <MDBContainer className="my-5">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', height: '50px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <Typography variant="h5">
              {editingTrainer ? 'Edit Trainer' : 'Create Trainer'}
            </Typography>
          </MDBCardHeader>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="6" className="mb-3">
                <label>Trainer ID</label>
                <MDBInput
                  name="trainerID"
                  value={trainerID}
                  onChange={(e) => setTrainerID(e.target.value)}
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
              <MDBCol md="6" className="mb-3"></MDBCol>
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
            <Typography variant="h6">Trainer List</Typography>
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
                    <TableCell>Trainer ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>CNIC</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Email Address</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTrainers.map((trainer, index) => (
                    <TableRow key={trainer._id}>
                      <TableCell>{indexOfFirstTrainer + index + 1}</TableCell>
                      <TableCell>{trainer.trainerID}</TableCell>
                      <TableCell>{trainer.name}</TableCell>
                      <TableCell>{trainer.cnic}</TableCell>
                      <TableCell>{trainer.phoneNumber}</TableCell>
                      <TableCell>{trainer.emailAddress}</TableCell>
                      <TableCell>{trainer.city}</TableCell>
                      <TableCell>{trainer.status}</TableCell>
                      <TableCell>
                        <IconButton color='primary' onClick={() => handleEdit(trainer)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton style={{ color: 'red' }} onClick={() => handleDelete(trainer._id)}>
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
                count={Math.ceil(trainers.length / trainersPerPage)}
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

export default Trainer;
