import {Request, Response, NextFunction} from 'express'
import { FinishTask_SERVICE } from '../../services/task/FinishTask_Service'

class FinishTask_CONTROLLER{
    async handle (req: Request, resp: Response){
        const {id, status} = req.body
        
        const finishTask = new FinishTask_SERVICE()
        const response = await finishTask.execute(id, status)

        return resp.json(response)      

    }
}

export {FinishTask_CONTROLLER}