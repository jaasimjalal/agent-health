const request = require('supertest');
const { app, server } = require('../server');

describe('Health API Endpoints', () => {
  afterAll((done) => {
    server.close(done);
  });

  describe('GET /', () => {
    it('should return root endpoint info', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Agent Health API');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app).get('/health/live');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('GET /health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app).get('/health/ready');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ready');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /health', () => {
    it('should return comprehensive health data', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('system');
      expect(response.body).toHaveProperty('dependencies');
      expect(response.body).toHaveProperty('requestId');
      
      // System metrics
      expect(response.body.system).toHaveProperty('cpu');
      expect(response.body.system).toHaveProperty('memory');
      expect(response.body.system).toHaveProperty('disk');
      
      // Dependencies
      expect(response.body.dependencies).toBeDefined();
    });

    it('should have valid uptime value', async () => {
      const response = await request(app).get('/health');
      expect(response.body.uptime).toBeGreaterThan(0);
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('GET /health/status', () => {
    it('should return service status and metadata', async () => {
      const response = await request(app).get('/health/status');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('service', 'agent-health');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('startedAt');
      expect(response.body).toHaveProperty('uptimeSeconds');
      expect(response.body).toHaveProperty('buildInfo');
      expect(response.body.buildInfo).toHaveProperty('node');
      expect(response.body.buildInfo).toHaveProperty('platform');
      expect(response.body.buildInfo).toHaveProperty('arch');
    });
  });

  describe('GET /docs', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/docs');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Agent Health API Documentation');
      expect(response.body).toHaveProperty('endpoints');
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('requestId');
    });
  });

  describe('Request ID middleware', () => {
    it('should include X-Request-ID header in responses', async () => {
      const response = await request(app).get('/health');
      expect(response.headers).toHaveProperty('x-request-id');
      expect(typeof response.headers['x-request-id']).toBe('string');
    });
  });

  describe('Security headers', () => {
    it('should have security headers from helmet', async () => {
      const response = await request(app).get('/health');
      
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });

  describe('CORS', () => {
    it('should allow CORS requests', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://example.com');
      
      expect(response.status).toBe(200);
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
