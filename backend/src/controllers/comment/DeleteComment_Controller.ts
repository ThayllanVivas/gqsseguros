import {Request, Response} from 'express'
import {DeleteComment_SERVICE} from '../../services/comment/DeleteComment_Services'

class DeleteComment_CONTROLLER {
    async handle(req: Request, res: Response) {
        const { id } = req.body;

        const deleteComment = new DeleteComment_SERVICE

        const response = await deleteComment.handle(id)

        return res.json(response)
    }
}

export { DeleteComment_CONTROLLER }