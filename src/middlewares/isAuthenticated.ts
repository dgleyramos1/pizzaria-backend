import {NextFunction, Request, Response} from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: String
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
){

    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end()
    }

    const [, token] = authToken.split(" ")

    try {
        // validar o token
        const { sub } = verify(
            token,
            process.env.JWT_SECRET
        ) as Payload;

        // Recuper o id do token e colocar dentro de uma variavel user_id dentro do req
        req.user_id = sub;

        return next();
    } catch (erro) {
        return res.status(401).end();
    }
}