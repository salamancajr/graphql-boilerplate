import 'cross-fetch/polyfill'
import prisma from '../../graphql-prisma/src/prisma'
import seed, { userOne } from './utils/seed'
import getClient from './utils/getClient'
import { getUsers, getProfile, login, createUser } from './utils/operations'
const client = getClient()

beforeEach(seed)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Sandey",
            email: "Sandey@aol.com",
            password: "MyPass123789789789789"    
        }
    }
    const response = await client.mutate({
        mutation: createUser,
        variables
    })
    
    const userExists = await prisma.exists.User({
        id: response.data.createUser.user.id
    }) 

    expect(userExists).toEqual(true)
})

test('Should expose public author profiles', async () => {

    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toEqual(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jen')
})

test('Short password at signup is rejected', async () => {
    const variables = {
        data: {
            email: "Carlos@gmail.com",
            password: "Carlos1",
            name: "Carlos"
        }
    }
 

    await expect(client.mutate({ mutation: createUser, variables })).rejects.toThrow()
})

test('Should not login with bad credentials', async () => {
    const variables = {
        email: '',
        password: ''
    }

    await expect(client.mutate({ mutation: login, variables })).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    
const { data } = await client.query({ query: getProfile })
expect(data.me.id).toBe(userOne.user.id)
})
