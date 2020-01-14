
import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import createToken from '../utils/createToken'
import hashedPassword from '../utils/hashPassword'

export default {
    async createUser(parent, args, { prisma }, info) {
        const { password } = args.data
        
        const hpword = await hashedPassword(password)
        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data,
                password: hpword,
            }
        })

        return {
            user,
            token: createToken(user.id)
        }
         
    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({ 
            where : {
                email: args.email 
            }
        }) 
        if (!user) {
            throw Error('No user found')
        } 
      
        const isPassword = await bcrypt.compare(args.password, user.password) 
   
        if (!isPassword) {
            throw Error('Unable to login')
        }
        return { 
            user, 
            token: createToken(user.id)
        }
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        const userExists = prisma.exists.User({ id: userId })
        if (!userExists) {
            throw new Error('Email Taken')

        }
        return prisma.mutation.deleteUser({ where: {id: userId} }, info)
    },
    async updateUser(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request)

        if(typeof data.password === 'string') {
            data.password = await hashedPassword(data.password)
        }
        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data
        }, info)    
    }
}