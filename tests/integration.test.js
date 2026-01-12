const request = require('supertest');
const { app, server } = require('../server');

describe('Integration Tests - Complete Health API Flow', () => {
  afterAll((done) => {
    server.close(done);
  });

  test('Complete API workflow', async () => {
    // 1. Check root endpoint
    const root = await request(app).get('/');
    expect(root.status).toBe(200);
    expect(root.body.message).toBe('Agent Health API');

    // 2. Check liveness
    const live = await request(app).get('/health/live');
    expect(live.status).toBe(200);
    expect(live.body.status).toBe('alive');

    // 3. Check readiness
    const ready = await request(app).get('/health/ready');
    expect(ready.status).toBe(200);
    expect(ready.body.status).toBe('ready');

    // 4. Full health check
    const health = await request(app).get('/health');
    expect(health.status).toBe(200);
    expect(health.body.status).toBe('healthy');
    expect(health.body.system).toBeDefined();
    expect(health.body.dependencies).toBeDefined();

    // 5. Status endpoint
    const status = await request(app).get('/health/status');
    expect(status.status).toBe(200);
    expect(status.body.service).toBe('agent-health');
    expect(status.body.buildInfo).toBeDefined();

    // 6. Documentation endpoint
    const docs = await request(app).get('/docs');
    expect(docs.status).toBe(200);
    expect(docs.body.endpoints).toBeDefined();
  });

  test('Request correlation and tracing', async () => {
    const response = await request(app).get('/health');
    
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.body.requestId).toBeDefined();
    expect(response.headers['x-request-id']).toBe(response.body.requestId);
  });

  test('System metrics are numeric and valid', async () => {
    const response = await request(app).get('/health');
    
    expect(typeof response.body.system.cpu).toBe('number');
    expect(response.body.system.cpu).toBeGreaterThanOrEqual(0);
    expect(response.body.system.cpu).toBeLessThanOrEqual(100);
    
    expect(typeof response.body.system.memory).toBe('number');
    expect(response.body.system.memory).toBeGreaterThanOrEqual(0);
    expect(response.body.system.memory).toBeLessThanOrEqual(100);
    
    expect(typeof response.body.system.disk).toBe('number');
    expect(response.body.system.disk).toBeGreaterThanOrEqual(0);
    expect(response.body.system.disk).toBeLessThanOrEqual(100);
  });

  test('Health data structure consistency', async () => {
    const response = await request(app).get('/health');
    const data = response.body;
    
    const requiredFields = [
      'status',
      'timestamp',
      'version',
      'uptime',
      'requestId',
      'system',
      'dependencies',
      'environment'
    ];
    
    requiredFields.forEach(field => {
      expect(data).toHaveProperty(field);
    });
    
    expect(Date.parse(data.timestamp)).not.toBeNaN();
    expect(data.version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
