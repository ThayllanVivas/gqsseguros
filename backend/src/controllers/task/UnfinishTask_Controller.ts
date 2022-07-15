import {Request, Response, NextFunction} from 'express'
import { UnfinishTask_SERVICE } from '../../services/task/UnfinishTask_Service'

class UnfinishTask_CONTROLLER{
    async handle (req: Request, resp: Response){
        const {id} = req.body
        
        const unfinishTask = new UnfinishTask_SERVICE()
        const response = await unfinishTask.execute(id)

        return resp.json({
            ok: true
        })      

    }
}

export {UnfinishTask_CONTROLLER}