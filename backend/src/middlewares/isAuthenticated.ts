import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";


interface Payload {
    sub: string
}

function isAuthenticated(req: Request, res: Response, next: NextFunction){

    //receber token
    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(401).end()
    }

    const [, token] = authToken.split(" ")

    try{
        const { sub } = verify(
            token, 
            process.env.JWT_SECRET
        ) as Payload;

        //adicionar o id do usuário dentro da variavel user_id para que fique visivel global
        req.user_id = sub

        return next();
    }catch {
        return res.status(401).end();
    }
}

export default isAuthenticated