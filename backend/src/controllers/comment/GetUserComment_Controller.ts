import {Request, Response} from 'express'
import { GetComment_SERVICE } from '../../services/comment/GetUserComment_Services';

class GetComment_CONTROLLER {
    async handle(req: Request, res: Response) {
        const user_id = req.user_id

        const getUserComment = new GetComment_SERVICE

        const response = await getUserComment.execute({user_id})

        return res.json(response)
    }
}

export { GetComment_CONTROLLER }