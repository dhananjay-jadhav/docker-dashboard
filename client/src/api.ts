const BASE_URL = 'http://localhost:5002';

export const getContainers = async () => {
  const res = await fetch(`${BASE_URL}/containers`);
  return res.json();
};

export const startContainer = async (id: string) => {
  await fetch(`${BASE_URL}/containers/${id}/start`, { method: 'POST' });
};

export const stopContainer = async (id: string) => {
  await fetch(`${BASE_URL}/containers/${id}/stop`, { method: 'POST' });
};

export const deleteContainer = async (id: string) => {
  await fetch(`${BASE_URL}/containers/${id}`, { method: 'DELETE' });
};

export const getLogs = async (id: string) => {
  const res = await fetch(`${BASE_URL}/containers/${id}/logs`);
  return res.text();
};
