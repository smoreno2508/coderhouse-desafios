import { userService } from '#services/index.js';
import { successResponse } from '#utils/utils.js';

const addUser = async (req, res, next) => {

    try {
        const { firstName, lastName, email, password } = req.body;
        const userAdded = await userService.addUser({ firstName, lastName, email, password });
        return successResponse(res, "User added successfully.", { userAdded });
    }catch(error){
        next(error);
    }
}

export { 
    addUser,
};