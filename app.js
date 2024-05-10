const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const fs = require('fs').promises;

app.use(express.json()); // json 형태의 데이터를 읽어온다.
// body-parser (예전)->express가 흡수했다.
app.use(express.urlencoded({extended: true})) // form으로 된 데이터를 읽어온다.
// form으로 요청된 데이터를 가져오고 싶을 때 사용
// false : queryString, true : qs객체로 처리(queryString보다 메소드를 조금 더 많이 가지고 있다.)

let name = '';

// localhost:3000
app.get('/', (req, res) => {
    // const resPath = path.join(__dirname, './views/index.html');

    let resPath;
    if(name){
        resPath = path.join(__dirname, 'views', 'index.html');
        resPath.replace("{{%name%}}", name);
    }else{
        const resPath = path.join(__dirname, 'views', 'index.html');
    }
    res.sendFile(resPath); //html 페이지로 응답
})
app.get('/start', (req, res) => {
    const resPath = path.join(__dirname, 'views', 'start.html');
    res.sendFile(resPath); 
})
app.get('/info', (req, res) => {
    const resPath = path.join(__dirname, 'views', 'info.html');
    res.sendFile(resPath); 
})


app.get('/login', (req, res) => {
    const resPath = path.join(__dirname, 'views', 'login.html');
    res.sendFile(resPath); 
})

// 데이터를 가져오는 방법
// 1. url로 queryString
// 2. url로 params
// 3. fetch: header 
// 4. fetch: body

// localhost:3000/login/홍길동/12345
app.get('/login/:name/:pwd', (req, res) => { // url params
    console.log("params login", req.params);
    // {name:"홍길동", pwd: "12345"}
})
app.post('/login', async (req, res) => {
    console.log("post login", req.body);
    // {name:"홍길동", pwd: "12345"}

    // const name = req.body.name;
    // const pwd = req.body.pwd;
    const {id, pwd} = req.body;

    const raw = await fs.readFile(path.join(__dirname, "model", "user.json"), "utf-8");
    // database

    const datas = await JSON.parse(raw);
    const user = datas.find(data=>data.id === id && data.pwd === pwd);
    name = user.name;

    if(user){
        res.json({success: true, message: "로그인 완료", user : user.name})
    }else{
        res.json({success: false, message: "아이디 혹은 비밀번호를 확인하세요"})
    }

})
app.get('/register', (req, res) => {
    const resPath = path.join(__dirname, 'views', 'register.html');
    res.sendFile(resPath); 
})
app.post('/register', (req, res) => {
    console.log(req.body);

    const {name, pwd, id} = req.body;
    const new_user = {name, pwd, id};

    fs.writeFile(path.join(__dirname, 'model', 'user.json'),
        JSON.stringify(new_user, null, "  "), // new_user를 json으로 바꿔서 user.json으로 저장할 것이다. 
        err => {if(err) console.log(err)}
    )

    // res.send('정상등록');
    // res.send({success: true, message: "정상등록"}); //js 형태로 전송
    res.json({success: true, message: "정상등록"}); // json.stringify 전송
     
    res.send({success: true, message: "회원가입 완료"}); 
})

app.listen(port, () => {
  console.log(`Server ON, PortNum : ${port}`)
})