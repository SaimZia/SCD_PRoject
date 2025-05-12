import React, { useState, useEffect } from 'react';
import { MenuItem, Select, FormControl, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Pagination, Button, Paper, IconButton } from '@mui/material';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBCardHeader, MDBInput } from 'mdb-react-ui-kit';
import ResponsiveAppBar from './ResponsiveAppBar';
import DeleteIcon from '@mui/icons-material/Delete';
import Buttons from './Buttons';

const Payments = () => {
  const [trainees, setTrainees] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState('');
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState([]);
  const [currentPayments, setCurrentPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentDate, setPaymentDate] = useState('');
  const traineesPerPage = 5;

  useEffect(() => {
    fetchTrainees();
    fetchPackages();
    fetchPayments();
  }, []);

  useEffect(() => {
    const indexOfLastPayment = currentPage * traineesPerPage;
    const indexOfFirstPayment = indexOfLastPayment - traineesPerPage;
    setCurrentPayments(payments.slice(indexOfFirstPayment, indexOfLastPayment));
  }, [currentPage, payments]);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data);
      setCurrentPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
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
    } catch (error) {
      console.error('Error fetching trainees:', error);
    }
  };

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

  const handleSubmit = async () => {
    const selectedTraineeData = trainees.find(trainee => trainee._id === selectedTrainee);
    const selectedPkg = selectedTraineeData ? packages.find(pkg => pkg.name === selectedTraineeData.packageName) : null;

    if (!selectedPkg) {
      alert('Selected trainee does not have a valid package.');
      return;
    }

    if (amount !== selectedPkg.price.toString()) {
      alert('The amount does not match the selected package price.');
      return;
    }
    
    if (!paymentDate) {
      alert('No Date selected!');
      return;
    }

    const validDate = new Date(paymentDate);
    if (isNaN(validDate.getTime())) {
      alert('Invalid date selected!');
      return;
    }

    const paymentData = {
      traineeId: selectedTrainee,
      packageId: selectedPkg._id,
      amount,
      status: 'Active',
      date: new Date(paymentDate).toISOString(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert('Payment recorded successfully!');
        setAmount('');
        setSelectedTrainee('');
        setPaymentDate('');
        fetchPayments();
      } else {
        alert('Failed to record payment.');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('An error occurred while recording payment.');
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredPayments = payments.filter(payment => 
      payment.traineeId.traineeID.toLowerCase().includes(searchTerm)
    );
    const indexOfLastPayment = currentPage * traineesPerPage;
    const indexOfFirstPayment = indexOfLastPayment - traineesPerPage;
    setCurrentPayments(filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment));
  };

  const validateDate = (selectedDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert('The payment date cannot be in the past.');
      return false;
    }
    const traineePayments = payments.filter(payment => payment.traineeId._id === selectedTrainee);

    if (traineePayments.length > 0) {
      const lastPaymentDate = new Date(Math.max(...traineePayments.map(payment => new Date(payment.date))));
      lastPaymentDate.setHours(0, 0, 0, 0);
      if (selectedDate <= lastPaymentDate) {
        alert('The payment date cannot be earlier than or the same as the previous payment date.');
        return false;
      }
      const nextValidPaymentDate = new Date(lastPaymentDate);
      nextValidPaymentDate.setMonth(lastPaymentDate.getMonth() + 1);
      if (selectedDate < nextValidPaymentDate) {
        alert('Payments can only be made once a month.');
        return false;
      }
    }
    return true;
  };

  const handleDateChange = (e) => {
    if (!e.target || !e.target.value) {
      console.error('Invalid event target or value:', e.target);
      return;
    }
    const selectedDate = new Date(e.target.value);
    if (validateDate(selectedDate)) {
      setPaymentDate(e.target.value);
    } else {
      setPaymentDate('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleReset = () => {
    setSelectedTrainee('');
    setAmount('');
    setPaymentDate('');
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
  };

  const indexOfLastPayment = currentPage * traineesPerPage;
  const indexOfFirstPayment = indexOfLastPayment - traineesPerPage;
  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <MDBContainer className="my-5">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', height: '50px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <Typography variant="h5">Record Payment</Typography>
          </MDBCardHeader>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md="6" className="mb-3">
                <label>Select Trainee</label>
                <FormControl fullWidth size='small'>
                  <Select
                    value={selectedTrainee}
                    onChange={(e) => setSelectedTrainee(e.target.value)}
                    label="Select Trainee"
                  >
                    {trainees.map((trainee) => (
                      <MenuItem key={trainee._id} value={trainee._id}>
                        {trainee.traineeID} - {trainee.name} - {trainee.packageName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBCol>
              <MDBCol md="6" className="mb-3">
              <label>Amount</label>
                <MDBInput
                  name="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  fullWidth
                />
              </MDBCol>
              <MDBCol md="6" className="mb-3">
                <label>Payment Date</label>
                <MDBInput
                  type="date"
                  value={paymentDate}
                  onChange={handleDateChange}
                />  
              </MDBCol>
              <MDBCol md="6" className="mb-3"></MDBCol>
              <MDBCol className="d-flex justify-content-end">
                <Button variant="contained" color="success" onClick={handleSubmit}>
                  Record Payment
                </Button>
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
        <MDBCard>
        <MDBCardHeader style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          height: '75px', 
          backdropFilter: 'blur(10px)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
            <Typography variant="h6">Payment Record</Typography>
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
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Serial No.</TableCell>
                    <TableCell>Trainee ID</TableCell>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPayments.map((payment, index) => (
                    <TableRow key={payment._id}>
                      <TableCell>{indexOfFirstPayment + index + 1}</TableCell>
                      <TableCell>{payment.traineeId.traineeID}</TableCell>
                      <TableCell>{payment.packageId.name}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton style={{ color: 'red' }} onClick={() => handleDelete(payment._id)}>
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
                count={Math.ceil(payments.length / traineesPerPage)}
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

export default Payments;
