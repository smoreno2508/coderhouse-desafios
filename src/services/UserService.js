import bcrypt from 'bcrypt';
import { User } from '#models/User.js'
import { NotAvailableError, NotFoundError } from '#errors/customErrors.js';
import { validateUser } from '#validators/userValidator.js';
export default class UserService {

    async addUser(userData) {
        const { firstName, lastName, email, password, isGithub } = userData;

        validateUser(firstName, lastName, email, password);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstName, lastName, email, password: hashedPassword, isGithub });
        await newUser.save();
        return newUser;
    }

    async getUsers() {

        const users = await User.find();

        if (users.length === 0) throw new NotAvailableError('No users available.');

        return users;
    }

    async getUserById(id) {
        const user = User.findById(id).lean();
        if (!user) throw new NotFoundError(`User with ID ${id} not found!`);
        return user;
    }

    async getUserbyEmail(email) {
        const user = User.findOne({ email });
        if (!user) throw new NotFoundError(`User with email ${email} not found!`);
        return user;
    }

}