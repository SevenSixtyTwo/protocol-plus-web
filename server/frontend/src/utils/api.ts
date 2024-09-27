// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API base URL
const API_BASE_URL = '/api';

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  await delay(500); // Simulate network delay

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// API functions
export async function getTools(): Promise<TestTool[]> {
  return fetchAPI<TestTool[]>('/tools');
}

export async function addTool(tool: Omit<TestTool, 'id'>): Promise<TestTool> {
  return fetchAPI<TestTool>('/tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool),
  });
}

export async function updateTool(tool: TestTool): Promise<TestTool> {
  return fetchAPI<TestTool>(`/tools/${tool.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tool),
  });
}

export async function deleteTool(id: number): Promise<void> {
  await fetchAPI(`/tools/${id}`, { method: 'DELETE' });
}

export async function getMotors(): Promise<Motor[]> {
  return fetchAPI<Motor[]>('/motors');
}

export async function addMotor(motor: Omit<Motor, 'id'>): Promise<Motor> {
  return fetchAPI<Motor>('/motors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(motor),
  });
}

export async function updateMotor(motor: Motor): Promise<Motor> {
  return fetchAPI<Motor>(`/motors/${motor.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(motor),
  });
}

export async function deleteMotor(id: number): Promise<void> {
  await fetchAPI(`/motors/${id}`, { method: 'DELETE' });
}

export async function getProtocolFields(templateId: string, motorTypeId: string): Promise<FieldType[]> {
  return fetchAPI<FieldType[]>(`/protocol-fields?templateId=${templateId}&motorTypeId=${motorTypeId}`);
}

export async function submitTestReport(report: TestReport): Promise<void> {
  await fetchAPI('/test-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
}

// Types
export type TestTool = {
  id: number;
  name: string;
  serialNumber: string;
  category: string;
};

export type Motor = {
  id: number;
  model: string;
  serialNumber: string;
  power: number;
  voltage: number;
  category: string;
};

export type FieldType = {
  name: string;
  type?: string;
  value?: string;
  fields?: FieldType[];
};

export type TestReport = {
  protocolFields: FieldType[];
  testTools: TestTool[];
  motor: Motor;
};