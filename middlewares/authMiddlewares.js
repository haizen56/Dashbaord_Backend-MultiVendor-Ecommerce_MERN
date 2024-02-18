const jwt = require('jsonwebtoken');

module.exports.authMiddlewares = async (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(409).json({ error: "Please Login First" });
    } else {
        try {
         //console.log("Secret Key:", process.env.SECRET_TOKEN);

         const decodedToken = await jwt.verify(accessToken, process.env.SECRET_TOKEN);

            req.id = decodedToken.id;
            req.role = decodedToken.role;
            next();
        } catch (error) {
            console.error("Token verification error:", error.message);
         return res.status(409).json({ error: "Please Login" });
           // return res.status(409).json({ error: "Invalid or Expired Token" });
        }
    }
};









// const jwt = require('jsonwebtoken');


// module.exports.authMiddlewares = async(req,res,next)=>{
//     const {accessToken} = req.cookies
//    if(!accessToken){
//       return res.token.status(409).json({error:"Please Login First"})
//    }else{
//       try {
//         const deCodeToken = await jwt.verify(accessToken, process.env.SECRET_TOKEN )
//         req.id = deCodeToken.id
//         req.role = deCodeToken.role
//       } catch (error) {
//       return res.token.status(409).json({error:"Please Login "})
        
//       }
//    }

// }

/*

*/