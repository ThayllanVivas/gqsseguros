import {Request, Response} from 'express'
import { ListTaskByCategories_SERVICE } from '../../services/task/ListTaskByCategorie_Service';

class ListTaskByCategories_CONTROLLER{
    async handle(req: Request, res: Response){
        const category_id = req.query.category_id as string;

        const listProductByCategorie_Service = new ListTaskByCategories_SERVICE

        const listOfFilteredProducts = await listProductByCategorie_Service.execute(category_id)

        return res.json(listOfFilteredProducts)
    }
}

export {ListTaskByCategories_CONTROLLER}

