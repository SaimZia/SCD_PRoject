import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBCardHeader, MDBTypography, MDBCardText, MDBIcon } from 'mdb-react-ui-kit';
import ResponsiveAppBar from './ResponsiveAppBar';
import { BarChart, Bar, CartesianGrid, Tooltip, Legend, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [adminsCountByCity, setAdminsCountByCity] = useState([]);
  const [trainersCountByCity, setTrainersCountByCity] = useState([]);
  const [traineesCountByCity, setTraineesCountByCity] = useState([]);
  const [monthlyPayments, setMonthlyPayments] = useState([]);

  useEffect(() => {
    fetchCountsByCity();
    fetchMonthlyPayments();
  }, []);

  const fetchCountsByCity = async () => {
    try {
      const responseAdmins = await fetch('http://localhost:5000/api/admins/city-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const dataAdmins = await responseAdmins.json();
      setAdminsCountByCity(dataAdmins);

      const responseTrainers = await fetch('http://localhost:5000/api/trainer/city-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const dataTrainers = await responseTrainers.json();
      setTrainersCountByCity(dataTrainers);

      const responseTrainees = await fetch('http://localhost:5000/api/trainee/city-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const dataTrainees = await responseTrainees.json();
      setTraineesCountByCity(dataTrainees);
    } catch (error) {
      console.error('Error fetching counts by city:', error);
    }
  };

  const fetchMonthlyPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/monthly');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Monthly payments data:', data);
      setMonthlyPayments(data);
    } catch (error) {
      console.error('Error fetching monthly payments data:', error);
    }
  };

  const cityData = adminsCountByCity.map(city => ({
    city: city.city,
    Admins: city.count,
    Trainers: trainersCountByCity.find(t => t.city === city.city)?.count || 0,
    Trainees: traineesCountByCity.find(t => t.city === city.city)?.count || 0
  }));

  const sortedCityData = cityData.sort((a, b) => (b.Admins + b.Trainers + b.Trainees) - (a.Admins + a.Trainers + a.Trainees));

  const monthlyPaymentsData = monthlyPayments.map(payment => ({
    month: payment.month,
    amount: payment.amount
  }));

  const getTotalCount = (data) => data.reduce((acc, item) => acc + item.count, 0);

  const adminsCount = getTotalCount(adminsCountByCity);
  const trainersCount = getTotalCount(trainersCountByCity);
  const traineesCount = getTotalCount(traineesCountByCity);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <MDBContainer className="my-5">
        <MDBCard className="mb-4" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <MDBCardHeader style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', height: '50px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <MDBTypography tag="h5">Dashboard</MDBTypography>
          </MDBCardHeader>
          <MDBCardBody>
            <MDBRow className="mb-4">
              <MDBCol md="4">
                <MDBCard className="text-center">
                  <MDBCardBody>
                    <MDBIcon fas icon="user-shield" size="3x" />
                    <MDBTypography tag="h5" className="my-2">Admins</MDBTypography>
                    <MDBCardText>{adminsCount}</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard className="text-center">
                  <MDBCardBody>
                    <MDBIcon fas icon="user-tie" size="3x" />
                    <MDBTypography tag="h5" className="my-2">Trainers</MDBTypography>
                    <MDBCardText>{trainersCount}</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard className="text-center">
                  <MDBCardBody>
                    <MDBIcon fas icon="user-graduate" size="3x" />
                    <MDBTypography tag="h5" className="my-2">Trainees</MDBTypography>
                    <MDBCardText>{traineesCount}</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="text-center">
                  <MDBCardBody>
                    <MDBTypography tag="h5" className="mb-4">Payments Overview</MDBTypography>
                    <div style={{ width: '100%', height: 400, overflow: 'hidden' }}>
                      <PieChart width={500} height={400}>
                        <Pie
                          data={monthlyPaymentsData}
                          cx={250}
                          cy={200}
                          labelLine={false}
                          label={({ month, amount }) => `Month ${month}: Rs. ${amount}`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="amount"
                        >
                          {monthlyPaymentsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="6">
                <MDBCard className="text-center">
                  <MDBCardBody>
                    <MDBTypography tag="h5" className="mb-4">User Distribution</MDBTypography>
                    <div style={{ width: '100%', height: 400, overflow: 'hidden' }}>
                      <BarChart
                        width={500}
                        height={400}
                        data={cityData}
                        margin={{
                          top: 5, right: 30, left: 0 , bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Admins" stackId="a" fill="#8884d8" name="Admins" />
                        <Bar dataKey="Trainers" stackId="a" fill="#82ca9d" name="Trainers" />
                        <Bar dataKey="Trainees" stackId="a" fill="#ffc658" name="Trainees" />
                      </BarChart>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default Dashboard;
