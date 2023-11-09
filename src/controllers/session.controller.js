import { userService } from '#services/index.js';

// En tu session.controller.js

const findByEmail = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.getUserbyEmail(email); 

        if (!user) {
            
            res.render("noAuthorized", { message: 'User not found or invalid password.' }); 
            return;
        }

        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            res.render('login', { error: 'Contraseña incorrecta.' });
            return;
        }

        req.session.user = { id: user.id, email: user.email, firtName: user.firstName };
        res.redirect('/'); 
    } catch (error) {
        next(error);
    }
}



export {
    findByEmail,
};