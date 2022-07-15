import {Request, Response, NextFunction} from 'express'
import { CreateTask_SERVICE } from '../../services/task/CreateTask_Service'

class CreateTask_CONTROLLER{
    async handle (req: Request, resp: Response){
        const user_id = req.user_id

        const {description, vehicleName, vehicleYear, vehiclePrice, branch_id, category_id ,customer_id} = req.body;
        
        const createProduct_service = new CreateTask_SERVICE()
        const newTask = await createProduct_service.execute(
            {
                description, 
                vehicleName, 
                vehicleYear,
                vehiclePrice, 
                user_id,
                branch_id, 
                category_id,
                customer_id
            }
        )

        return resp.json(newTask)      

    }
}

export {CreateTask_CONTROLLER}