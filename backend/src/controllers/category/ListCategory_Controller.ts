import { Request, Response } from "express";
import { ListCategory_SERVICE } from "../../services/category/ListCategory_Service";

class ListCategory_CONTROLLER{
    async handle(Request, Response){
        const listCategory_Service = new ListCategory_SERVICE();

        const categories = await listCategory_Service.execute()

        Response.json(categories)
    }
}

export {ListCategory_CONTROLLER}