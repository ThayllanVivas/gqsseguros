import prismaClient from "../../prisma";
import {hash} from 'bcryptjs'

interface USERREQUEST {
    name: string;
    email: string;
    password: string
}
class CreateUser_SERVICE {
    async execute ({name, email, password}: USERREQUEST){
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
        return user;
   }
}

export { CreateUser_SERVICE }