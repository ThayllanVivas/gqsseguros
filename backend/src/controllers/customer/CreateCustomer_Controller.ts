import { Request, Response } from 'express'
import { CreateCustomer_SERVICE } from '../../services/customer/CreateCustomer_Service'

class CreateCustomer_CONTROLLER {
    async handle(req: Request, res: Response){

        const {cpf, name, phoneNumber} = req.body

        const createCustomer = new CreateCustomer_SERVICE  
        const response = await createCustomer.execute({cpf, name, phoneNumber})

        return res.json(response)
    }
}

export { CreateCustomer_CONTROLLER }