import { compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { sign } from 'jsonwebtoken';

interface AuthRequest{
    email: String
    password: String
}


class AuthUserService{
    async execute({email, password}: AuthRequest){
        //verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where: {
                email: `${email}`
            }
        })

        if(!user){
            throw new Error("User/password incorrect")
        }

        // Verificar se a senha está correta
        const passwordMatch = await compare(`${password}`, user.password)

        if(!passwordMatch){
            throw new Error("User/password incorrect")
        }

        // se deu tudo certo, vamos gerar um token para o usuário
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

export {AuthUserService}