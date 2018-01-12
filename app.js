const webApp = require('./webApp.js');
const fs = require('fs');
let loginLink = `<a id="login" href="login">login to add comments</a>`
const homePage = fs.readFileSync("./public/index.html","utf8");
let app = webApp.create();

let toS = o => JSON.stringify(o, null, 2);

const logRequest = (req, res) => {
  let text = ['------------------------------',
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''
  ].join('\n');
  fs.appendFile('./logs.txt', text, () => {});
  console.log(`${req.method} ${req.url}`);
};

let registered_users = [{userName:'ashishm',name:'ashish mahindrakar'}];

const isGetRequest = function(req){
  return req.method=="GET";
}

const requestNotFound = function(req,res){
  let url = req.url;
  res.write(`${url} Not Found`);
  res.end()
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};

const isPost = function(req){
  return req.method == "POST";
}


const getLogin =(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.redirect("/login.html");
}


const logoutUser = function(req,res){
  res.setHeader('Set-Cookie', [`message=login failed; Max-Age=5`, `sessionid=0;Max-Age=5`]);
  if(req.user) delete req.user.sessionid;
  res.redirect('/');
}

const postLogin = function(req,res){
  let user = registered_users.find(u=>u.userName==req.body.userName);
  console.log(req.body)
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let date = new Date();
  let sessionid = date.getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
}

const homePageHandler = function(req,res){
    if(req.user){
        let content = homePage.replace("placeHolder","welcome");
        res.write(content);
        res.end();
    }else{
        let content = homePage.replace("placeHolder",loginLink);
        res.write(content);
        res.end();
    }
}

let fileServer = function(req, res) {
  let path = 'public' + req.url;
  if (isGetRequest(req)) {
    try {
      let data = fs.readFileSync(path);
      res.statusCode = 200;
      res.write(data);
      res.end()
    } catch (e) {
      return;
    };
  };
}

const redirectToIndexpage = function(req,res){
  res.redirect("index.html");
}

const redirectToHomePage = function(req,res){
  res.redirect("/home");
}

app.get("/",redirectToIndexpage);
app.get('/logout',logoutUser);
app.post('/login',postLogin);
app.get('/login',getLogin);
app.get('/home',homePageHandler);
app.use(logRequest);
app.use(loadUser);
app.addPostProcessor(fileServer);
app.addPostProcessor(requestNotFound);
module.exports = app;