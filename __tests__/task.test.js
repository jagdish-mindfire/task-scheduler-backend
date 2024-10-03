const request = require('supertest');
const app = require('../app'); 

describe('For Tasks', () => {
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
        .get('/task/').set('Authorization', `Bearer ${accessToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('tasks');
    });
   
    // it('Get A single Task', async () => {
    //   const res = await request(app)
    //     .get(`/task/${taskId}`).set('Authorization', `Bearer ${accessToken}`);; 
        
    //   expect(res.statusCode).toBe(200);
    // });
});
