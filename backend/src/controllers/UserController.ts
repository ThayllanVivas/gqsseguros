import { NextFunction, Request, Response } from 'express'
import prismaClient from '../prisma';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

class UserController {

    //access my profile
    async User(req: Request, res: Response, next: NextFunction){

        const user_id = req.user_id;

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            }, 
            select: {
                id: true,
                name: true,
                email: true,
                admin_mode: true,
            }
        })

        return res.json(user)
    }

    //list all users
    async Users(req: Request, res: Response, next: NextFunction){

        const user_id = req.user_id;

        //verify if the user is admin
        const userisAdmin = await prismaClient.user.findUnique({
            where: {
                id: user_id
            }
        })
        if(!userisAdmin) {
            throw new Error('Only admin users can have access to this list')
        }

        const usersList = await prismaClient.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                admin_mode: true,
                status: true
            }
        })
        
        return res.json(usersList)
    }

    //change user status
    async UserChangeStatus(req: Request, res: Response, next: NextFunction){

        const { id, status } = req.body

        console.log('id', id)
        console.log('status', typeof status)

        const response = await prismaClient.user.update({
            where: {
                id: id
            },
            data: {
                status: !status
            }
        })

        return res.json(response)
    }

    //create new user 
    async UserCreate (req: Request, res: Response, next: NextFunction){

        const { name, email, password } = req.body;
        //check if there is a email passed by param
        if(!email) {
            throw new Error("Email not fulfilled");
        }

        //check if there is a user already created
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        //If already exists, throw a error
        if(userAlreadyExists){
            throw new Error ("User already exists")
        }

        const passwordHash = await hash(password, 8) //crypt the password
        //Insert new user into database
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
            }, 
            select: {
                id: true,
                name: true,
                email: true,
            }
        })
        return res.json(user)
   }
    
   //make login
    async UserAuth (req: Request, res: Response, next: NextFunction) {

        const {email, password} = req.body;

        
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
        //check if the email exists
        if(!user){
            res.status(401).send('User not registered')
            return
        }
        //check if the user is active
        if(!user.status){
            res.status(401).send('User not authorized or inactive')
        }

        //check if the password is correct
        const passwordMatch = await compare(password, user.password)        

        if(!user || !passwordMatch) {
            throw new Error ("Email/password do not exist!")
        }

        //generating token
        const token = sign(
            {
                name: user.name,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        })
    }
}

export { UserController }