import {Request, Response} from 'express'
import {CreateComment_SERVICE} from '../../services/comment/CreateComment_Services'

class CreateComment_CONTROLLER {
    async handle(req: Request, res: Response) {
        const { text, task_id } = req.body;
        const user_id = req.user_id

        const createComment = new CreateComment_SERVICE

        const response = await createComment.handle({text, task_id, user_id})

        return res.json(response)
    }
}

export { CreateComment_CONTROLLER }