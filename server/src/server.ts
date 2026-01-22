import express, { Request, Response } from 'express';
import Docker, { ContainerInfo } from 'dockerode';
import path, { join } from 'path';
import cors from 'cors';

const app = express();
const port = 5002;

// Docker connection (Colima socket)
const docker = new Docker({
  socketPath: path.join(process.env.HOME ?? '', '.colima', 'docker.sock'),
});

// Container status type
interface ContainerStatus {
  id: string;
  name: string[];
  status: string;
}

// This will hold the container statuses
let containersStatus: ContainerStatus[] = [];

// Function to fetch container status
const updateContainersStatus = async (): Promise<void> => {
  try {
    const containers: ContainerInfo[] = await docker.listContainers({ all: true });

    containersStatus = containers.map((container) => ({
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
app.use(cors());

app.use(express.static(join(__dirname, "..", "public")));

// Get all containers' status
app.get('/containers', (_req: Request, res: Response) => {
  res.json(containersStatus);
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

// Get logs of a specific container
app.get('/containers/:id/logs', async (req: Request, res: Response) => {
  const { id } = req.params;
  const container = docker.getContainer(id as string);

  try {
    const logsBuffer = await container.logs({
      stdout: true,
      stderr: true,
      timestamps: false,
      follow: false,
    });

    const logs = logsBuffer.toString('utf-8');
    res.send(logs);
  } catch (err: any) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start a specific container
app.post('/containers/:id/start', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const container = docker.getContainer(id as string);
    await container.start();
    res.status(200).json({ message: 'Container started' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stop a specific container
app.post('/containers/:id/stop', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const container = docker.getContainer(id as string);
    await container.stop();
    res.status(200).json({ message: 'Container stopped' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Remove a specific container
app.delete('/containers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const container = docker.getContainer(id as string);
    await container.remove();
    res.status(200).json({ message: 'Container removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/',(req, res) => {
    res.sendFile(join(__dirname, "..", "public", 'index.html'))
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
