import jwt from 'jsonwebtoken'

export default (request, requireAuth = true) => {
    const header = request.request ? 
    request.request.headers.authorization :
    request.connection.context.Authorization

    if (!header) {
        if (!requireAuth) {
            return null
        }
        throw Error('Authentication required')
    }
    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return decoded.userId
}