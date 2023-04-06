const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let users = [
    { id: 1, fullname: 'Le Phan Hoang Phuc', gender: true, age: 20 },
    { id: 2, fullname: 'Le Thi Phuc', gender: true, age: 20 }
];
// lấy tất cả thông tin user
app.get('/users', (req, res) => {
    res.json(users);
});

// lấy thông tin user theo id
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

// thêm mới một user
app.post('/users', (req, res) => {
    const user = req.body;
    user.id = users.length + 1;
    users.push(user);
    res.json(user);
});

// cập nhật thông tin user theo id
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = req.body;
        users[index].id = id;
        res.json(users[index]);
    } else {
        res.status(404).send('User not found');
    }
});

// xóa một user theo id
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        const deletedUser = users[index];
        users.splice(index, 1);
        res.json(deletedUser);
    } else {
        res.status(404).send('User not found');
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});