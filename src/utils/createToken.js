import jwt from 'jsonwebtoken'

export default (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn : '2 days' })
}