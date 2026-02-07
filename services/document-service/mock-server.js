const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mock data
let projects = [
  {
    id: '1',
    name: 'Sample Project 1',
    description: 'This is a sample project for testing',
    organization_id: 'org-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sample Project 2',
    description: 'Another sample project',
    organization_id: 'org-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let nextId = 3;
let nextDocId = 3; // Start from 3 to avoid conflicts with existing documents
let nextPresentationId = 1;
let nextCanvasId = 1;

// Mock documents storage
const documents = [
  {
    id: '1',
    title: 'Sample Document 1',
    content: 'This is a sample document content',
    project_id: '1',
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2', 
    title: 'Sample Document 2',
    content: 'Another sample document',
    project_id: '1',
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock presentations storage
const presentations = [
  {
    id: '1',
    title: 'Sample Presentation 1',
    project_id: '1',
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock canvases storage
const canvases = [
  {
    id: '1',
    title: 'Sample Canvas 1',
    content: '{}',
    project_id: '1',
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Auth mock endpoints for testing
app.get('/auth/me', (req, res) => {
  console.log('[MOCK] GET /auth/me');
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Mock user response
  res.json({
    id: 'user-1',
    email: 'test@example.com',
    full_name: 'Test User',
    name: 'Test User'
  });
});

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'document-service-mock' });
});

// GET /projects - Fetch all projects
app.get('/projects', (req, res) => {
  console.log('[MOCK] GET /projects');
  res.json({ projects });
});

// POST /projects - Create new project
app.post('/projects', (req, res) => {
  console.log('[MOCK] POST /projects', req.body);
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }
  
  const newProject = {
    id: String(nextId++),
    name,
    description: description || null,
    organization_id: 'org-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  projects.push(newProject);
  res.status(201).json(newProject);
});

// GET /projects/:id - Get specific project
app.get('/projects/:id', (req, res) => {
  console.log('[MOCK] GET /projects/:id', req.params.id);
  const project = projects.find(p => p.id === req.params.id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json(project);
});

// PUT /projects/:id - Update project
app.put('/projects/:id', (req, res) => {
  console.log('[MOCK] PUT /projects/:id', req.params.id, req.body);
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const { name, description } = req.body;
  projects[projectIndex] = {
    ...projects[projectIndex],
    name: name || projects[projectIndex].name,
    description: description !== undefined ? description : projects[projectIndex].description,
    updated_at: new Date().toISOString()
  };
  
  res.json(projects[projectIndex]);
});

// DELETE /projects/:id - Delete project
app.delete('/projects/:id', (req, res) => {
  console.log('[MOCK] DELETE /projects/:id', req.params.id);
  const projectIndex = projects.findIndex(p => p.id === req.params.id);
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  projects.splice(projectIndex, 1);
  res.status(204).send();
});

// Document endpoints

// GET /projects/:projectId/documents - Get documents for a project
app.get('/projects/:projectId/documents', (req, res) => {
  console.log('[MOCK] GET /projects/:projectId/documents', req.params.projectId);
  const projectId = req.params.projectId;
  const projectDocuments = documents.filter(doc => doc.project_id === projectId);
  res.json({ documents: projectDocuments });
});

// POST /projects/:projectId/documents - Create document in project
app.post('/projects/:projectId/documents', (req, res) => {
  console.log('[MOCK] POST /projects/:projectId/documents', req.params.projectId, req.body);
  const { title } = req.body;
  const projectId = req.params.projectId;
  
  if (!title) {
    return res.status(400).json({ error: 'Document title is required' });
  }
  
  // Check if project exists
  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const newDocument = {
    id: String(nextDocId++),
    title,
    content: null,
    project_id: projectId,
    created_by: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// GET /documents/:id - Get specific document
app.get('/documents/:id', (req, res) => {
  console.log('[MOCK] GET /documents/:id', req.params.id);
  const document = documents.find(doc => doc.id === req.params.id);
  
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  res.json(document);
});

// PUT /documents/:id - Update document
app.put('/documents/:id', (req, res) => {
  console.log('[MOCK] PUT /documents/:id', req.params.id, req.body);
  const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
  
  if (documentIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  const { title, content } = req.body;
  documents[documentIndex] = {
    ...documents[documentIndex],
    title: title !== undefined ? title : documents[documentIndex].title,
    content: content !== undefined ? content : documents[documentIndex].content,
    updated_at: new Date().toISOString()
  };
  
  res.json(documents[documentIndex]);
});

// DELETE /documents/:id - Delete document
app.delete('/documents/:id', (req, res) => {
  console.log('[MOCK] DELETE /documents/:id', req.params.id);
  const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
  
  if (documentIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }
  
  documents.splice(documentIndex, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Document Service running on port ${PORT}`);
  console.log(`📝 Projects API available at http://localhost:${PORT}/projects`);
});

module.exports = app;
