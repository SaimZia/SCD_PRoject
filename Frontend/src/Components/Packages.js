import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import ResponsiveAppBar from './ResponsiveAppBar';
import '../styles/Packages.css';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/packages');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleEdit = (pkg) => {
    setEditMode(true);
    setCurrentPackage(pkg);
  };

  const handleCreate = () => {
    setCreateMode(true);
    setNewPackage({ name: '', description: '', price: '' });
  };

  const handleSave = async () => {
    try {
      await fetch(`http://localhost:5000/api/packages/${currentPackage._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPackage),
      });
      fetchPackages();
      setEditMode(false);
      setCurrentPackage(null);
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleCreateSave = async () => {
    try {
      await fetch('http://localhost:5000/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPackage),
      });
      fetchPackages();
      setCreateMode(false);
      setNewPackage({ name: '', description: '', price: '' });
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/packages/${id}`, {
        method: 'DELETE',
      });
      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setCurrentPackage({ ...currentPackage, [name]: value.replace(/[^0-9.]/g, '') });
    } else {
      setCurrentPackage({ ...currentPackage, [name]: value });
    }
  };

  const handleNewPackageChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setNewPackage({ ...newPackage, [name]: value.replace(/[^0-9.]/g, '') });
    } else {
      setNewPackage({ ...newPackage, [name]: value });
    }
  };

  return (
    <div style={{ backgroundColor: '#EEEEEE', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <MDBContainer className="my-5" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button className="button mb-4 btn btn-success" onClick={handleCreate}>Create New Package</button>
        <MDBRow>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <MDBCol md="4" key={pkg._id} className="mb-4">
                <MDBCard>
                  <MDBCardBody>
                    <h5>{pkg.name}</h5>
                    <p>{pkg.description}</p>
                    <p><strong>Price:</strong> Rs.{pkg.price}</p>
                    <button className="btn btn-warning" onClick={() => handleEdit(pkg)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(pkg._id)}>Delete</button>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))
          ) : (
            <MDBCol>
              <p>No packages available</p>
            </MDBCol>
          )}
        </MDBRow>

        {editMode && currentPackage && (
          <MDBCard className="mt-4">
            <MDBCardBody>
            <label>Package Name</label>
              <MDBInput
                name="name"
                value={currentPackage.name}
                onChange={handleChange}
              />
              <label>Description</label>
              <MDBInput
                name="description"
                value={currentPackage.description}
                onChange={handleChange}
              />
              <label>Price</label>
              <MDBInput
                name="price"
                type="number"
                value={currentPackage.price}
                onChange={handleChange}
              />
              <button className="btn btn-primary mt-2" onClick={handleSave}>Save</button>
            </MDBCardBody>
          </MDBCard>
        )}

        {createMode && (
          <MDBCard className="mt-4">
            <MDBCardBody>
            <label>Package Name</label>
              <MDBInput
                name="name"
                value={newPackage.name}
                onChange={handleNewPackageChange}
              />
              <label>Description</label>
              <MDBInput
                name="description"
                value={newPackage.description}
                onChange={handleNewPackageChange}
              />
              <label>Price</label>
              <MDBInput
                name="price"
                type="number"
                value={newPackage.price}
                onChange={handleNewPackageChange}
              />
              <button className="btn btn-primary mt-2" onClick={handleCreateSave}>Create</button>
            </MDBCardBody>
          </MDBCard>
        )}
      </MDBContainer>
    </div>
  );
}

export default Packages;
