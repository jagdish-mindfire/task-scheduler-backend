const request = require('supertest');
const app = require('../app');

describe('For General App', () => {
    it('should return 200 for GET /', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Welcome To task Scheduler APIs');
    });
  
    it('should return 404 for an unknown route', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.statusCode).toBe(404);
    });

});