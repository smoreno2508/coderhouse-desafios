import { userService } from '#services/index.js';
import { successResponse } from '#utils/utils.js';

const addUser = async (req, res, next) => {

    try {
        const { firstName, lastName, email, password, age} = req.body;
        console.log(req.body);
        const userAdded = await userService.addUser({ firstName, lastName, email, password, age });
        return successResponse(res, "User added successfully.", { userAdded });
    }catch(error){
        next(error);
    }
}


const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        return successResponse(res, "User retrieved successfully.", { user });
    } catch (error) {
        next(error);
    }
}

export { 
    addUser,
    getUserById
};