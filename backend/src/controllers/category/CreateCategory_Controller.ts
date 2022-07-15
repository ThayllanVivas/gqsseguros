import { Request, Response } from "express";
import { CreateCategory_SERVICE } from "../../services/category/CreateCatetgory_Service";

class CreateCategory_CONTROLLER {
    async handle(Request, Response){
        const {name} = Request.body;

        const createCategory = new CreateCategory_SERVICE();

        const response = await createCategory.execute({name});

        return Response.json(response)
    }
}

export { CreateCategory_CONTROLLER }