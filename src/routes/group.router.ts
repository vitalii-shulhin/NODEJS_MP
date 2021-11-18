import express from 'express';
import GroupController from '../controllers/group.controller';

const router = express.Router();

// GET /api/group/:id
router.get('/:id', GroupController.getById);

// GET  /api/group/all
router.get('/', GroupController.findAll);

// POST  /api/group
router.post('/', GroupController.create);

// PUT  /api/group
router.put('/',  GroupController.update);

// GELETE  /api/group/:id
router.delete('/:id', GroupController.delete);

// POST  /api/group/add_users
router.post('/add_users', GroupController.addUsersToGroup);

// POST  /api/group/get_user_group/:groupId
router.get('/get_user_group/:groupId', GroupController.getUserGroup);

export const groupRouter = router;
