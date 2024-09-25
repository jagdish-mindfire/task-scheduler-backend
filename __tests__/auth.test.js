const request = require('supertest');
const app = require('../app'); 

describe('For General App', () => {
    it('Login with the right credentials and receive a refresh token', async () => {
      const res = await request(app)
        .post('/auth/login') 
        .send({
          email: 'jagdishp@mindfire.com',  
          password: '12345678'
        });

      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty('refresh_token');

      expect(typeof res.body.refresh_token).toBe('string');
      expect(res.body.refresh_token.length).toBeGreaterThan(0);
    });
   
    it('Login with the invalid credentials and receive error message', async () => {
      const res = await request(app)
        .post('/auth/login') 
        .send({
          email: 'jagdishpin@dfire.com',   
          password: '123456aa78'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
});
