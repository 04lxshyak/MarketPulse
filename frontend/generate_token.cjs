const jwt = require('jsonwebtoken');

const secret = Buffer.from('mR9qZ2xWQnV4T3JkTnY1cHhFZ0s4QmF5YzJQd2RZa1pQeE5uT1VtWkRrPQ==', 'base64');
const token = jwt.sign({ sub: 'test@example.com' }, secret, { expiresIn: '1h' });

console.log(token);
