
import getUserId from '../utils/getUserId'

const Query = {
    async me(parent, args, { prisma,  request}, info) {
        const userId = getUserId(request)
        if (!userId) {
            throw Error('No user found')
        }

        const user = await prisma.query.user({
            where: {
                id:userId
            }
        }, info)
        console.log('user', JSON.stringify(user, undefined, 2))
        return user
    },

    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after, 
            orderBy: args.orderBy
        }

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query

                }, {
                    email_contains: args.query
                }]
            }
        }
        return prisma.query.users(opArgs, info)
    },
}

export default Query