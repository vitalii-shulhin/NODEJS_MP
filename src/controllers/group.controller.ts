import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import UserGroupModel from '../models/user.group.model';
import GroupModel from '../models/group.model';
import { Group } from '../types/group.types';
import { logger } from '../common/logger';

const groupService = new GroupService(GroupModel, UserGroupModel);
const groupNotFound = 'Group not found';

interface IGroupController {
  findAll: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
  delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
  addUsersToGroup: (req: Request, res: Response) => Promise<void>;
  getUserGroup: (req: Request, res: Response) => Promise<void>;
}

class GroupController implements IGroupController {

  findAll = async (req: Request, res: Response) => {
    try {
      const groups = await groupService.findAll();

      res.status(200).send(groups);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.findAll',
      });

      res.status(500).send(errorMessage);
    }
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const group = await groupService.getById(id);

      res.status(200).json(group);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.getById',
        arguments: req.params,
      });

      res.status(500).send(errorMessage);
    }
  }

  create = async (req: Request, res: Response) => {
    const group: Group = req.body;

    try {
      const newGroup = await groupService.create(group);

      res.status(201).json(newGroup);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.create',
        arguments: req.body,
      });
      res.status(500).send(errorMessage);
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
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.update',
        arguments: { body: req.body, params: req.params },
      });
      res.status(500).send(errorMessage);
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
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.delete',
        arguments: req.params,
      });
      res.status(500).send(errorMessage);
    }
  }

  addUsersToGroup = async (req: Request, res: Response) => {
    const { groupid, userids } = req.body;

    try {
      const group = await groupService.addUsersToGroup(groupid, userids);

      res.status(200).send(group);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.addUsersToGroup',
        arguments: req.body,
      });
      res.status(500).send(errorMessage);
    }
  }

  getUserGroup = async (req: Request, res: Response) => {
    const { groupId } = req.params;

    try {
      const groupList = await groupService.getUserGroup(groupId);

      res.status(200).send(groupList);
    } catch (err) {
      const { message: errorMessage } = err as Error;

      logger.error({
        errorMessage,
        methodName: 'GroupController.getUserGroup',
        arguments: req.params,
      });
      res.status(500).send(errorMessage);
    }
  }
}

export default new GroupController();
