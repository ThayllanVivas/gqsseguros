import {Request, Response} from 'express'
import {EditComment_SERVICE} from '../../services/comment/EditComment_Services'

class EditComment_CONTROLLER {
    async handle(req: Request, res: Response) {
        const { text, id } = req.body;

        const editComment = new EditComment_SERVICE

        const response = await editComment.handle({text, id})

        return res.json(response)
    }
}

export { EditComment_CONTROLLER }