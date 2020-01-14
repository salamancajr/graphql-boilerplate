import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('Red098!@#yuiyui')
    },
    user: undefined,
    jwt: undefined,
}

const userTwo = {
    input: {
        name: 'Mike',
        email: 'Mike@example.com',
        password: bcrypt.hashSync('Red098!@#yuiyui')
    },
    user: undefined,
    jwt: undefined,
}

export default async () => { 
    await prisma.mutation.deleteManyUsers()
    userOne.user = await prisma.mutation.createUser({ 
        data: userOne.input
    }, '{ id }')
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET)

    userTwo.user = await prisma.mutation.createUser({ 
        data: userTwo.input
    }, '{ id }')
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)
}

export { userOne, userTwo }