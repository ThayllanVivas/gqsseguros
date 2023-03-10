import prismaClient from '../prisma';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

class UserController {

    //access profile
    async Me(req: Request, res: Response, next: NextFunction){

        const user_id = req.user_id;

        const user = await prismaClient.user.findFirst({
            where: {
                id: user_id
            }, 
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                admin_mode: true,
            }
        })

        return res.json(user)
    }

    //get all specific user info
    async User(req: Request, res: Response, next: NextFunction){
        const email= req.query.email as string;

        const response = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        return res.json(response)
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
            res.status(401).send('Only admin users can have access to this list')
            return
        }

        const response = await prismaClient.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                admin_mode: true,
                status: true
            }
        })

        const usersList = response.filter((user) => !user.admin_mode)
        
        return res.json(response)
    }

    //change user status
    async UserChangeStatus(req: Request, res: Response, next: NextFunction){

        const { id, status } = req.body

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

        const { name, email, password, typeUser } = req.body;
        const adminOrUser = (typeUser == 'true') //convert string to boolean
        // console.log(adminOrUser)
        // return;
        //check if there is a email passed by param
        if(!email) {
            res.status(400).send("Email not fulfilled");
            return
        }

        //check if there is a user already created
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        //If already exists, throw a error
        if(userAlreadyExists){
            res.status(400).send("User already exists")
            return
        }

        const passwordHash = await hash(password, 8) //crypt the password
        //Insert new user into database
        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
                admin_mode: adminOrUser
            }, 
            select: {
                id: true,
                name: true,
                email: true,
            }
        })
        return res.json(user)
   }

   //edit user info
    async UserEdit (req: Request, res: Response, next: NextFunction){
        const { userEditInfoID, name, email, password, admin_mode } = req.body;

        const adminOrUser = (admin_mode == 'true') //convert string to boolean
        const passwordHash = await hash(password, 8) //turn the password into hash password type

        const response = await prismaClient.user.update({
            where: {
                id: userEditInfoID
            },
            data: {
                name: name,
                email: email,
                password: passwordHash,
                admin_mode: adminOrUser
            },
            select: {
                id: true,
                name: true,
                email: true,
                admin_mode: true
            }
        })

        return res.json(response)
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

        if(!passwordMatch) {
            res.status(401).send("Password do not exist!")
            return
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