const request = require('supertest');
const app = require('../app'); 

describe('For Tasks Controller', () => {
    let accessToken = null;
    let refreshToken = null;
    let taskId = null;

    beforeAll(async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'jagdishp@mindfire.com',
          password: '12345678'
        });
      refreshToken = res.body.refresh_token;
        console.log({refreshToken});
      const res1 = await request(app)
      .post('/auth/token')
      .send({  refresh_token:refreshToken });
      console.log(res1.body);
      accessToken = res1.body.access_token;

      console.log(accessToken);
    });




    it('Get All Tasks', async () => {
      const res = await request(app)
        .get('/tasks/').set('Authorization', `Bearer ${accessToken}`);
      expect(res.statusCode).toBe(200);
    });
   
});

describe('For Tasks Service', () => {
    let accessToken = null;
    let refreshToken = null;
    let taskId = null;

    beforeAll(async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'jagdishp@mindfire.com',
          password: '12345678'
        });
      refreshToken = res.body.refresh_token;
        console.log({refreshToken});
      const res1 = await request(app)
      .post('/auth/token')
      .send({  refresh_token:refreshToken });
      console.log(res1.body);
      accessToken = res1.body.access_token;

      console.log(accessToken);
    });
   
});
