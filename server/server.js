const express = require('express');
const Docker = require('dockerode');
const path = require('path');
const app = express();
const port = 5002;



const docker = new Docker({ socketPath: path.join(process.env.HOME, '.colima', 'docker.sock') });

// This will hold the container statuses
let containersStatus = [];

// Function to fetch container status
const updateContainersStatus = async () => {
  try {
    const containers = await docker.listContainers({ all: true });
    containersStatus = containers.map(container => ({
      id: container.Id,
      name: container.Names,
      status: container.State,
    }));
  } catch (err) {
    console.error('Error fetching container status:', err);
  }
};

// Periodically check the container status every 5 seconds
setInterval(updateContainersStatus, 5000);

// Enable CORS for frontend communication
const cors = require('cors');
app.use(cors());

// Get all containers' status
app.get('/containers', (req, res) => {
  res.json(containersStatus);
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Get logs of a specific container
app.get('/containers/:id/logs', async (req, res) => {
  const containerId = req.params.id;
  const container = docker.getContainer(containerId);

  try {
    const logsBuffer = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: false, // This is the key!
    });

    const logs = logsBuffer.toString('utf-8');
    res.send(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start a specific container
app.post('/containers/:id/start', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    await container.start();
    res.status(200).json({ message: 'Container started' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop a specific container
app.post('/containers/:id/stop', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    await container.stop();
    res.status(200).json({ message: 'Container stopped' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a specific container
app.delete('/containers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const container = docker.getContainer(id);
    await container.remove();
    res.status(200).json({ message: 'Container removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
