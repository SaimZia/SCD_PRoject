import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ResponsiveAppBar from './ResponsiveAppBar';

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const user = await response.json();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Account
          </Typography>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6"><strong>Account Details</strong></Typography>
            {user ? (
              <>
                <Typography>
                  <strong>Username:</strong> {user.adminName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user.empId}
                </Typography>
                <Typography>
                  <strong>City:</strong> {user.city}
                </Typography>
                <Typography>
                  <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
                </Typography>
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Account;
