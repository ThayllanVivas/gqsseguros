import { ListAllBranches_SERVICES } from "../../services/branch/ListAllBranches_Services"
import {Request, Response} from 'express'

class ListAllBranches_CONTROLLER {
    async handle(req: Request, res: Response){
        const listAllbranches = new ListAllBranches_SERVICES

        const response = await listAllbranches.execute()

        return res.json(response)
    }
}

export {ListAllBranches_CONTROLLER}