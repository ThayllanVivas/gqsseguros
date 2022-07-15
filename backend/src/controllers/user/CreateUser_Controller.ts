import { NextFunction, Request, Response } from 'express'
import { CreateUser_SERVICE } from '../../services/user/CreateUser_Service'

class CreateUser_CONTROLLER {
    async handle (req: Request, res: Response, next: NextFunction) {
        const { name, email, password } = req.body;

        const createUserService = new CreateUser_SERVICE;

        const user = await createUserService.execute({
            name,
            email, 
            password
        });

        return next()
    }
}

export { CreateUser_CONTROLLER }