import supertest from 'supertest';
import server from '../index';

export const appRequest = supertest.agent(server);

describe('authorization should fail', () => {
  it('should require authorization', (done) => {
    appRequest
        .get('/api/users/')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          return done();
        });
  });
});

let token = '';

describe('authorization success', () => {
  it('should set authorization token', (done) => {
    appRequest
    .post('/login')
    .send({ login: 'XXXXXX222222222222XXXXXX', password: 'ass1231231222222' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      token = res.body.token;
      return done();
    });
  });
});

describe('User Controller', () => {
  let createdUserID: string;

  it('return all users', (done) => {
    appRequest
      .get('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Array);

        return done();
      });
  });

  it('return auto suggest users', (done) => {
    appRequest
      .get('/api/users/auto_suggest?loginSubstring=T&limit=9')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Array);

        return done();
      });
  });

  it('create user', (done) => {
    appRequest
      .post('/api/users')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        login: 'TESTfromJEST',
        password: 'csdd32',
        age: 23,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        createdUserID = res.body.id;
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });

  it('return user by Id', (done) => {
    appRequest
      .get(`/api/users/${createdUserID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });

  it('update user', (done) => {
    appRequest
      .put(`/api/users/${createdUserID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        login: 'TESTfromJESTzNEW',
        password: 'csdd32',
        age: 22,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });

  it('delete user', (done) => {
    appRequest
      .delete(`/api/users/${createdUserID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });
});

describe('Group Controller', () => {
  let createdGroupsID: string;

  it('return all groups', (done) => {
    appRequest
      .get('/api/group')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Array);

        return done();
      });
  });

  it('create group', (done) => {
    appRequest
      .post('/api/group')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TEST group 99999 (\'DELETE, UPLOAD_FILES\')',
        permission: ['DELETE', 'UPLOAD_FILES'],
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        createdGroupsID = res.body.id;
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });

  it('return group by Id', (done) => {
    appRequest
      .get(`/api/group/${createdGroupsID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });

  it('return user group', (done) => {
    appRequest
      .get(`/api/group/get_user_group/${createdGroupsID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Array);
        return done();
      });
  });

  it('add users to group', (done) => {
    appRequest
    .post('/api/group/add_users')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      groupid: createdGroupsID,
      userids: ['4b532abb-c06c-4bd5-a975-e983b3380421'],
    })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err);
      expect(res.body).toBeInstanceOf(Object);
      return done();
    });
  });

  it('delete group', (done) => {
    appRequest
      .delete(`/api/group/${createdGroupsID}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        return done();
      });
  });
});
