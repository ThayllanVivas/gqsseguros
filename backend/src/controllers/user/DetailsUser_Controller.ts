import {NextFunction, Request, Response} from 'express'
import { DetailsUser_Service } from '../../services/user/DetailsUser_Service'

class DetailsUser_CONTROLLER{
    async handle(req: Request, res: Response, next: NextFunction){

        const user_id = req.user_id;

        const detailsUser_Service = new DetailsUser_Service();

        const user = await detailsUser_Service.execute(user_id);

        return res.json(user);
    }
}

export {DetailsUser_CONTROLLER}