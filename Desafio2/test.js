const assert = require('assert');
const request = require('supertest');
const app = require('./index');

describe('Testes unitários', function () {
  it('Deve criar um usuario', function (done) {
    const postData = {
      name: "Kadu",
      email: "kadu123@gmail.com",
      password: "senhasegura",
      telefone: { numero: "987654321", ddd: "85" },
    };

    request(app)
      .post('/product')
      .send(postData)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
