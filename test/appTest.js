let th = require("./testFrame/testHelper.js");
let app = require("../app.js");
let request = require("./testFrame/requestSimulator.js");
const chai = require('chai');
const assert = chai.assert;
describe('app', () => {
  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app, {
        method: 'GET',
        url: '/bad'
      }, (res) => {
        assert.equal(res.statusCode, 404);
        done();
      })
    })
  })
  describe('GET /', () => {
    it('redirects to home', done => {
      request(app, {
        method: 'GET',
        url: '/'
      }, (res) => {
        th.should_be_redirected_to(res, '/home');
        assert.equal(res.body, "");
        done();
      })
    })
  })
  describe('GET /index.html', () => {
    it('gives the index page', done => {
      request(app, {
        method: 'GET',
        url: '/'
      }, res => {
        th.should_be_redirected_to(res, '/home');
      })
      done();
    })
  })
  describe('GET /login.html', () => {
    it('serves the login page', done => {
      request(app, {
        method: 'GET',
        url: '/login.html'
      }, res => {
        th.should_be_redirected_to(res, '/home');
        th.body_contains(res, 'userName:');
        th.body_does_not_contain(res, 'login failed');
      })
      done();
    })
  })
  describe('GET /login.html', () => {
    it('serves the login page with message for a failed login', done => {
      request(app, {
        method: 'GET',
        url: '/login.html',
        headers: {
          'cookie': 'message=login failed'
        }
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, 'User Name:');
        th.body_contains(res, 'login failed');
        th.should_not_have_cookie(res, 'message');
      })
      done();
    })
  });
  describe('POST /login', () => {
    it('redirects to home for valid user', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'userName=ashishm'
      }, res => {
        th.should_be_redirected_to(res, '/home');
        th.should_not_have_cookie(res, 'message');
      })
      done();
    })
  })
  describe('POST /login', () => {
    it('redirects to login.html with message for invalid user', done => {
      request(app, {
        method: 'POST',
        url: '/login',
        body: 'username=badUser'
      }, res => {
        th.should_be_redirected_to(res, '/login');
        th.should_have_expiring_cookie(res, 'message', 'login failed');
      })
      done();
    })
  });
  describe('GET /logout', () => {
    it('serves the home page and login link', done => {
      request(app, {
        method: 'GET',
        url: '/home'
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, `href="login">login to add todo`);
        th.body_does_not_contain(res, 'login failed');
        done();
      })
    })
  })
  describe('GET /home', () => {
    it('should serve the home page for logged in user', (done) => {
      let headers = {
        cookie: "sessionid=123456"
      }
      let user = {
        userName: 'ashishm',
        name: 'ashish mahindrakar',
      }
      request(app, {
        method: "GET",
        url: "/home",
        user: user,
        headers: headers
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, "Logout");
        done();
      })
    });
  });
  describe('GET /staticFiles', () => {
    it('should give script files when asked for', (done) => {
      request(app, {
        method: "GET",
        url: "/templatesrc/tempsrc.js"
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, "new XMLHttpRequest()");
        done();
      })
    });
  })
  describe('GET /css', () => {
    it('should serve css files when asked for ', (done) => {
      request(app, {
        method: "GET",
        url: "/css/main.css"
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, "margin-left: 900px;");
        done();
      })
    });
  });
  describe('GET /loadAllToDoList', () => {
    it('should give all the todo list of logged in user', (done) => {
      let headers = {
        cookie: "sessionid=100"
      }
      let user = {
        userName: 'ashishm',
        name: 'ashish mahindrakar',
      }
      request(app, {
        method: "GET",
        url: "/loadAllToDoList",
        user:user,
        headers: headers
      }, res => {
        th.status_is_ok(res);
        th.body_contains(res, "todo at home");
        done();
      })
    });
  });
});
