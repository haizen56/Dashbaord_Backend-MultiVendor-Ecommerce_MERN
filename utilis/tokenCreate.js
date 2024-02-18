const jwt = require('jsonwebtoken');

module.exports.createToken = async (data) => {
const token = await jwt.sign(data, process.env.SECRET_TOKEN,{
    expiresIn: '7d' // expires in 7 days
      })
return token
}

