import {NextFunction, Request, Response} from 'express'
import {AuthUser_Service} from '../../services/user/AuthUser_Service'

class AuthUser_CONTROLLER {
    async handle (req: Request, res: Response, next: NextFunction) {

        const {email, password} = req.body;
        
        const authUser_Service = new AuthUser_Service();

        const login = await authUser_Service.execute({email, password})

        return res.json(login)
    }
}

export { AuthUser_CONTROLLER }