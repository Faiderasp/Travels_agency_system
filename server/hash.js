import bcrypt from 'bcrypt';
const password = 'admin';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
