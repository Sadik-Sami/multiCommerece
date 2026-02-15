import { getAllUsers, updateRole } from '@/controllers/user.controllers';
import { authorize } from '@/middlewares';
import { Hono } from 'hono';

const users = new Hono();

users.get('/', authorize('admin'), getAllUsers);
users.patch('/me', authorize('admin'), updateRole);

export default users;
