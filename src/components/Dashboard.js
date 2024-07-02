import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import ChartComponent from './ChartComponent';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [role, setRole] = useState('');
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setRole(decoded.role);

        try {
          const response = await axios.get('/api/data', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/data', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const response = await axios.get('/api/data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(response.data);
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const onDragEnd = (result) => {
    // Logic to handle drag and drop
    const { source, destination } = result;

    // If dropped outside the droppable area, return
    if (!destination) {
      return;
    }

    // Reorder the data array based on the drag-and-drop result
    const items = Array.from(data);
    const [removed] = items.splice(source.index, 1);
    items.splice(destination.index, 0, removed);

    // Update state with the reordered data
    setData(items);
  };

  return (
    <Container>
      <h2>Dashboard</h2>
      {/* Toggle dark mode button */}
      <Button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </Button>
      <Button onClick={handleShowModal}>Add Data</Button>
      <Row>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="dataList">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-item" // Added class for styling
                      >
                        <div className="data-card">
                          <h3>{item.name}</h3>
                          <p>{item.value}</p>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control type="number" name="value" onChange={handleFormChange} required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ChartComponent data={data} />
    </Container>
  );
};

export default Dashboard;
