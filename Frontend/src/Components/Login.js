import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import gymImage from '../assets/images/gms.jpg'; 
import '../styles/Login.css';
import { Button } from 'react-bootstrap';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <MDBContainer className="login-container" style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
        <MDBCard className="login-card">
          <MDBRow className='g-0 w-100'>
            <MDBCol md='6' className='d-flex'>
              <MDBCardImage
                src={gymImage}
                alt="login form"
                className='login-image'
              />
            </MDBCol>

            <MDBCol md='6'>
              <MDBCardBody className='login-form'>
                <div className='d-flex flex-column align-items-center'>
                  <MDBIcon fas icon="dumbbell fa-3x mb-3" style={{ color: '#ff6219' }} />
                  <span className="form-title">Gym Management System</span>
                </div>

                <h5 className="form-subtitle">Sign into your account</h5>

                {error && <div className="text-danger mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <label>Username</label>
                  <MDBInput
                    wrapperClass='form-input'
                    id='username'
                    type='text'
                    size="lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label>Password</label>
                  <MDBInput
                    wrapperClass='form-input'
                    id='password'
                    type='password'
                    size="lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button className="form-button" variant='dark' size='lg' type="submit">Login</Button>
                </form>

                <a className="small text-muted" href="#!">Forgot password?</a>

                <div className='d-flex flex-row justify-content-start'>
                  <a href="#!" className="small text-muted me-1">Terms of use.</a>
                  <a href="#!" className="small text-muted">Privacy policy</a>
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}
