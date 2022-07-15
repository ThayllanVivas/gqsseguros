import {Request, Response} from 'express'
import { ListTaskSpecific_SERVICE } from '../../services/task/ListTaskSpecific_Services'

class ListTaskSpecific_CONTROLLER{
    async handle(req: Request, res: Response){
        const task_id = req.query.task_id as string

        const listProductSpecific_Service = new ListTaskSpecific_SERVICE

        const listofProducts = await listProductSpecific_Service.execute(task_id)

        return res.json(listofProducts)
    }
}

export {ListTaskSpecific_CONTROLLER}

