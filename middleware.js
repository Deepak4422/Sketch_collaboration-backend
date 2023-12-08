var  jwt = require('jsonwebtoken');
const JWT_SECRET='webtokenboyoftheyear';

const fetchUser= (req,res,next)=>{
    const webtoken= req.headers['auth-token'];
    if (!webtoken)
    {
      res.status(401).send({message: 'User authentication is not correct'});
    }
    try {
        const data=jwt.verify(webtoken, JWT_SECRET);
    req.user=data.user;
    next();
    } catch (error) {
       res.status(401).send({message: 'User authntication is not correct'});
        
    }

}
module.exports=fetchUser;