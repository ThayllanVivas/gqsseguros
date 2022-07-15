import {Request, Response} from 'express'
import { ListTask_SERVICE } from '../../services/task/ListTask_Service'


class ListTask_CONTROLLER{
    async handle(req: Request, res: Response){

        const user_id = req.user_id

        const listProduct_Service = new ListTask_SERVICE

        const listofProducts = await listProduct_Service.execute(user_id)

        return res.json(listofProducts)
    }
}

export {ListTask_CONTROLLER}

