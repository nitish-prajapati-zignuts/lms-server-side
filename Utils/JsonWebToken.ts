import jwt, { JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_TOKEN!

if (!JWT_SECRET) {
    throw new Error("JWT_TOKEN is not defined in environment variables")
}

type TokenData = {
    id: string
    email: string
    role: string
}

export type DecodeTokenPayload = JwtPayload & {
    data?: TokenData
}

export const generateJsonWebToken = ({ data }: { data: TokenData }) => {
    try {
        const token = jwt.sign(data, JWT_SECRET, {
            expiresIn: "1d",
        })

        return token
    } catch (error) {
        throw new Error("Could not generate JSON Web Token")
    }
}


export const verifyJsonWebToken = ({ token }: { token: string }) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenData & JwtPayload

        return decoded
    } catch (error) {
        throw new Error("Invalid or expired JSON Web Token")
    }
}


export const decodeJsonWebToken = ({ token }: { token: string }) => {
    try {
        const decodedToken = jwt.decode(token) as DecodeTokenPayload


        if (!decodedToken) {
            throw new Error("Could not decode JSON Web Token")
        }

        if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
            throw new Error("TOKEN_EXPIRED")
        }

        return decodedToken
    } catch (error) {
        throw new Error("Could not decode JSON Web Token")
    }
}