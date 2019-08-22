process.env.NODE_ENV = 'test';

const bcrypt = require('bcryptjs');
let User = require('../models/User');
let Token = require('../models/Token');

let mongoose = require('mongoose');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//Наш основной блок
const user = {
  email: '***',
  password: '123456'
};

describe('Users', () => {
  beforeEach(done => {
    //Перед каждым тестом чистим базу
    User.deleteMany({}).then(() =>
      Token.deleteMany({}).then(() => {
        done();
      })
    );
  });

  describe('Регистрация без email', () => {
    it('отказано', done => {
      chai
        .request(server)
        .post('/api/users')
        .send({ password: user.password })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          done();
        });
    });
  });
  describe('Регистрация без пароля', () => {
    it('отказано', done => {
      chai
        .request(server)
        .post('/api/users')
        .send({ email: user.email })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          done();
        });
    });
  });

  describe('Регистрация', () => {
    it('успешно, токены получены', done => {
      chai
        .request(server)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('accessToken');
          res.body.should.have.property('refreshToken');
          res.body.should.have.property('expiredDate');
          done();
        });
    });
  });

  describe('Пользователь с email уже существует', () => {
    it('отказано', done => {
      let newUser = new User(user);
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(user.password, salt);
      newUser.save((err, createdUser) => {
        chai
          .request(server)
          .post('/api/users')
          .send(user)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
          });
      });
    });
  });

  describe('Авторизация', () => {
    it('успешно, токены получены', done => {
      let newUser = new User(user);
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(user.password, salt);
      newUser.save((err, createdUser) => {
        chai
          .request(server)
          .post('/api/auth')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('accessToken');
            res.body.should.have.property('refreshToken');
            res.body.should.have.property('expiredDate');
            done();
          });
      });
    });
  });

  describe('Авторизация с неверным паролем', () => {
    it('отказано', done => {
      let newUser = new User(user);
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(user.password, salt);
      newUser.save((err, createdUser) => {
        chai
          .request(server)
          .post('/api/auth')
          .send({ email: user.email, password: 'wrongPassword' })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            done();
          });
      });
    });
  });

  describe('Получить пользователя по токену', () => {
    it('успешно', done => {
      let newUser = new User(user);
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(user.password, salt);
      newUser.save((err, createdUser) => {
        chai
          .request(server)
          .post('/api/auth')
          .send(user)
          .end((err, res) => {
            const accessToken = res.body.accessToken;
            chai
              .request(server)
              .get('/api/auth')
              .set('x-auth-token', accessToken)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.email.should.equal(user.email);
                done();
              });
          });
      });
    });
  });

  describe('Получить пользователя без токена', () => {
    it('отказано', done => {
      let newUser = new User(user);
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(user.password, salt);
      newUser.save((err, createdUser) => {
        chai
          .request(server)
          .post('/api/auth')
          .send(user)
          .end((err, res) => {
            const accessToken = res.body.accessToken;
            chai
              .request(server)
              .get('/api/auth')
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
              });
          });
      });
    });
  });

  describe('Получить пользователя с некорректным токеном', () => {
    it('отказано', done => {
      let newUser = new User(user);
      const salt = bcrypt.genSaltSync(10);
      newUser.password = bcrypt.hashSync(user.password, salt);
      newUser.save((err, createdUser) => {
        chai
          .request(server)
          .post('/api/auth')
          .send(user)
          .end((err, res) => {
            const accessToken = res.body.accessToken;
            chai
              .request(server)
              .get('/api/auth')
              .set('x-auth-token', 'wrongToken')
              .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                done();
              });
          });
      });
    });
  });
});
