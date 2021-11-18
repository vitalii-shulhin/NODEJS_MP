import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import UserGroupModel from '../models/user.group.model';
import GroupModel from '../models/group.model';
import { Group } from '../types/group.types';

const groupService = new GroupService(GroupModel, UserGroupModel);
const groupNotFound = 'Group not found';

interface IGroupController {
  findAll: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
  delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
  addUsersToGroup: (req: Request, res: Response) => Promise<void>;
}

class GroupController implements IGroupController {

  findAll = async (req: Request, res: Response) => {
    try {
      const groups = await groupService.findAll();

      res.status(200).send(groups);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const group = await groupService.getById(id);

      res.status(201).json(group);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  create = async (req: Request, res: Response) => {
    const group: Group = req.body;

    try {
      const newGroup = await groupService.create(group);

      res.status(201).json(newGroup);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  update = async (req: Request, res: Response) => {
    const groupUpdate: Group = req.body;
    const { id } = req.params;

    try {
      const [isGroupUpdated] = await groupService.update(id, groupUpdate);

      if (isGroupUpdated) {
        return res.status(200).json({ id });
      }

      res.status(404).send(groupNotFound);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const isGroupDelete = await groupService.delete(id);

      if (isGroupDelete) {
        return res.status(204).json({ id, isGroupDelete });
      }

      res.status(404).send(groupNotFound);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }

  addUsersToGroup = async (req: Request, res: Response) => {
    const { groupid, userids } = req.body;

    try {
      const group = await groupService.addUsersToGroup(groupid, userids);

      res.status(200).send(group);
    } catch (err) {
      res.status(500).send((err as Error).message);
    }
  }
}

export default new GroupController();
