import bcrypt from 'bcryptjs'

export default (password) => {
    if (password.length < 8) {
        throw Error('Password must be 8 characters or longer')
    }
    return bcrypt.hash(password, 10)
}