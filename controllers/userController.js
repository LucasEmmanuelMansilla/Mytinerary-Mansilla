const User = require('../models/User')
const bcryptjs = require('bcryptjs')

const userController = {
    addUser: async (req, res) => {
        var errores = []
        const {userName, password, name, lastName, country, profilePic} = req.body
        
        const usuarioExistente = await User.findOne({userName : userName})
        if(usuarioExistente){
            errores.push('El usuario ya existe')
        }
        if(errores.length === 0){
            const hashearPassword = bcryptjs.hashSync(password, 10)

            var userSave = new User({
                userName,
                password: hashearPassword,
                name,
                lastName,
                country,
                profilePic
            })
            var userSaved = await userSave.save()
        }
        
     return res.json({success: errores.length === 0 ? true : false,
                        errores: errores,
                        respuesta: userSaved})
        
    },

    logInUser: async (req, res) => {
        
        var {userName, password} = req.body
        const usuarioExistente = await User.findOne({userName:userName})
    
        if(!usuarioExistente){
            return res.json({success: false, respuesta: 'Usuario y/o contraseña incorrectos'})
        }
        const passwordCompare = bcryptjs.compareSync(password, usuarioExistente.password)
        if(!passwordCompare){
            return res.json({success: false, respuesta: 'Usuario y/o contraseña incorrectos'})
        }

        
        return res.json({success: true, respuesta: usuarioExistente})
    }

}

module.exports = userController