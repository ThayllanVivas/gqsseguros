import prismaClient from "../../prisma"
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface LOGIN {
    email: string, 
    password: string
}

class AuthUser_Service {
    async execute ({email, password}: LOGIN) {
        //check if the email exists
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })
        if(!user){
            throw new Error ("User incorrect")
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

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        }
    }
}

export { AuthUser_Service }