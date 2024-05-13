const user = {}
// 동적으로 속성 생성
user.name = "hong";
user.pwd = "1234";

console.log(user);
// { name: 'hong', pwd: '1234' }

user['age'] = 30;
user['addr'] = 'somewhere'
console.log(user);