import { Router } from 'express';
import { db } from '../database/knex.js';
import { verifyToken } from '../helpers/hash.js';
import { createAuditColumns } from '../middleware/auth.js';

const management = Router();
export { management };

// Middleware kiểm tra xác thực
function checkAuthorization(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }
    next();
}

// Xử lý lỗi chung
function handleErrors(res, error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}

// Lấy danh sách người dùng
async function getUsers(req, res) {
    try {
        const users = await db.select('*').from('users');
        res.status(200).json(users);
    } catch (error) {
        handleErrors(res, error);
    }
}

// Thêm người dùng mới
async function createUser(req, res) {
    try {
        const userId = await db('users').insert(req.body);
        res.status(201).json({ id: userId });
    } catch (error) {
        handleErrors(res, error);
    }
}

// Cập nhật thông tin người dùng
async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        await db('users').where('id', userId).update(req.body);
        res.status(200).json({ id: userId });
    } catch (error) {
        handleErrors(res, error);
    }
}

// Xóa người dùng
async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await db('users').where('id', userId).del();
        res.status(200).json({ id: userId });
    } catch (error) {
        handleErrors(res, error);
    }
}

// Lấy danh sách người dùng theo phân trang
async function getUsersPagination(req, res) {
    try {
        const { page, limit } = req.query;
        const offset = (page - 1) * limit;
        const users = await db.select('*').from('users').limit(limit).offset(offset);
        res.status(200).json(users);
    } catch (error) {
        handleErrors(res, error);
    }
}

// Tìm kiếm người dùng theo tên người dùng, tên và email
async function searchUsers(req, res) {
    try {
        const keyword = req.query.keyword;
        const users = await db.select('*').from('users').where('username', 'like', `%${keyword}%`)
            .orWhere('name', 'like', `%${keyword}%`).orWhere('email', 'like', `%${keyword}%`);
        res.status(200).json(users);
    } catch (error) {
        handleErrors(res, error);
    }
}

management.get('/users', checkAuthorization, getUsers);
management.post('/users', verifyToken, createAuditColumns, createUser);
management.put('/users/:id', verifyToken, createAuditColumns, updateUser);
management.delete('/users/:id', verifyToken, deleteUser);
management.get('/users/pagination', checkAuthorization, getUsersPagination);
management.get('/users/search', checkAuthorization, searchUsers);
