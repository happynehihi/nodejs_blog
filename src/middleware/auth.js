import { db } from '../database/knex.js';
import dotenv from 'dotenv';
dotenv.config();

export function createAuditColumns(req, _, next) {
    req.body.createdBy = req.decoded.id;
    req.body.createdAt = db.fn.now();
    next();
}