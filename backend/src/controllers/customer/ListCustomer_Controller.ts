import { Request, Response } from 'express'
import { ListCustomer_SERVICE } from '../../services/customer/ListCustomer_Service'

class ListCustomer_CONTROLLER {
    async handle(req: Request, res: Response){

        const listCustomer = new ListCustomer_SERVICE  
        const response = await listCustomer.execute()

        return res.json(response)
    }
}

export { ListCustomer_CONTROLLER }