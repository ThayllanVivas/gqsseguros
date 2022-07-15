import {Request, Response} from 'express'
import { GetSpecificComment_SERVICES } from '../../services/comment/GetSpecificComment_Services'

class GetSpecificComment_CONTROLLER {
    async handle(req: Request, res: Response){
        const id = req.body.id as string

        const getSpecificComment = new GetSpecificComment_SERVICES

        const response = await getSpecificComment.execute(id)

        return res.json(response)
    }
}

export { GetSpecificComment_CONTROLLER }