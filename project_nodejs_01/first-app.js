// console.log('hello from Node.js');
const fs = require('fs');
let useName = "ChinhTQ";
var ageUser = 21;
var hasDevice = true;

const getUser = (name, age, device) => `Your name: ${name}; your age: ${age}; your device: ${device}`;
const getUserName = name => `My name is ${name}`;
const getUserAge = () => `My age is ${ageUser}`;

console.log(`abc: ${useName}`);

const user = {
    name: "ChinhTQ",
    age:21,
    checkDevice: (ages)=> ages > 20 ? true : false
};
const copyUser = {...user};
console.log(copyUser);

const listAge = [10,11,12,20,21,22];
listAge.push(23,25);
for(let device of listAge){
    console.log('device: '+user.checkDevice(device));
}

console.log(listAge.map(data => data == 10));

const copyAge = listAge.slice();
console.log("copyAge: "+copyAge);

const listName = (...name) =>{
    return name;
};
console.log('Name: '+listName('ChinhTQ; ManhDV; VinhND'));

const logName = ({name})=> fs.writeFileSync('string_05.txt','Name: '+name);
logName(user);

const [age1,age2,age3] = copyAge;
console.log('age2: '+age2);
const {name,age} = user;
console.log('Name: '+name+' Age: '+age);

fs.writeFileSync('string_01.txt', getUser(useName,ageUser,hasDevice));
fs.writeFileSync('string_02.txt', getUserName(useName));
fs.writeFileSync('string_03.txt', getUserAge());
fs.writeFileSync('string_04.txt','name: '+user.name+'; age: '+user.age+'; device: '+user.checkDevice(user.age));