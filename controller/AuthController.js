var bcrypt = require('bcryptjs');
var moment = require('moment');
var models = require('../models');
var utils = require('../utils/sendmail');
var generalFunctions = require('../utils/funcs');

var AuthController = {};

AuthController.Login=(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.json({success:false, message: 'Please provide email and password', responseType:'incomplete_fields'});
    }
    
    var email = req.body.email;
    //find the user
    models.User.findOne({
        where: {email: email}
        
    }).then(function(user){
        
        if(!user){
            return res.json({success: false, message: 'Sorry, we found no account that match the data provided', responseType:'invalid_user'})
        }
        //check if the password is valid
        var password = req.body.password;
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid){
            return res.json({ success: false, message:'Your username/password is not correct. Please try again', responseType: 'invalid_password'});
        }
        //check if the user is active
        if(user.isActive == false){
            return res.json({success: false, message: 'Your account is inactive', responseType:'account_inactive'});
        }

        //create token and send response
        // create a token
        var token = jwt.sign({ 
            id: user.id, 
            email:user.email,
         }, config.jwt.secret, {
            expiresIn: 86400 // expires in 1 day
        });
        
        // user.token = token;
        //update user's last logged in data
        models.User.update({token:token.toString(),updatedAt: `${moment(new Date())}`},{ where: { id: parseInt(user.id) } }).then(()=>{

            return res.json({ success: true, message: "Authentication successful!", authToken: token, responseType:'successful', user: user });
        }).catch(err=>{
            throw new Error(err);
        });

    })
}
AuthController.Register=(req,res)=>{
    if(!req.body.email || !req.body.password){
        return res.json({success: false, message: 'Please provide a valid email and password', responseType:'invalid_credentials'});
    } else {
 
        var username = req.body.email;
        var password = req.body.password;

                //find the user by username
                models.User.findOne({where: {email : username }})
                .then(async function(user){
                    if(user !== null){
                        return res.json({success: false, message: 'An account with similar credentials already exists', responseType:'account_exists'});
                    } 
                    else {

                        //create the new user account
                        var data = req.body;
                        var token = generalFunctions.createFiveDigitsCode();
                        data['token'] = token;
                        //hash password
                        var hashedPassword = bcrypt.hashSync(password, 8);
                        data['password'] = hashedPassword;

                        // console.log("data = ",data)
                        //run SQL create function
                        models.User.create(data)
                        .then(async function(newUser){
                            if(data.email){
                            
                            var sendMail = sendTemplatedMail(data,res);
                            }
                            return res.json({success: true, message: 'Your account was successfully created. Please check your mail-box for verification steps.', responseType:'successful'});
                        }).catch(function(err){
                            console.log(err)
                            return res.json({success: false, message: 'Error occurred'})
                        })
                    }
                })
    }
}

let sendTemplatedMail = async function(
    user, // refactor
    res,
  ) {
    try {
      const token = user.token;
      // Save the verification token
      const subject = 'Account Verification Token';
      const to = user.email;
      const from = process.env.FROM_EMAIL;

      const html = `<p>Hi ${user.firstName}<p><br>
                    <p>Please use this token <b>${token}</b> to verify your account.</p><br>
                    <p>If you did not request this, please ignore this email.</p>`;
      await utils.sendEmail({ to, from, subject, html });
      res.json({
        status:true,
        message: `A verification email has been sent to ${user.email}.`,
      });
    } catch (error) {
      res.json({status:false, message: error.message });
    }
  }
module.exports = AuthController;