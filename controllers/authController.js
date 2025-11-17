const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateUUID } = require("../lib/generateUUID.js");
const {registationEmailNotification} = require("../templates/userEmailNotifications.js")
const userModel = require("../model/userModel.js");
const refreshTokenModel = require("../model/tokenModel.js");
const {generateAccessToken, generateRefreshToken} = require("../utils/generateToken.js");

const RegisterController = async (req, res) => {
    try{
        const {firstName, lastName, username, email, password, agreeToTerms} = req.body;

        console.log(firstName, lastName, username, email, password);
        if(!email || !password ){
            return res.status(400).json({
                status: "error",
                message: "Email and password are required."
            })
        }
        
        const checkIfEmailIsExisting = userModel.findOne({email: email});
        if(checkIfEmailIsExisting.length > 0){
            return res.status(400).json({
                status: "error",
                message: "The email that the user has inputted is already used."
            })

        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // console.log(hashedPassword);
        const newUser = new userModel({
            userId: generateUUID(),
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            passwordHash: hashedPassword,
            agreeToTerms: agreeToTerms,
            lastSeen: new Date(),
            createdAt: new Date()
        })
        const test = await newUser.save();
        console.log(test)

        const name = `${firstName} ${lastName}`
        await registationEmailNotification(email, name);

        res.status(201).json({
            status: "success",
            message: "User is created successfully."
        })

    } catch (error) {
        console.error("Registration failed:", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to create a new user.",
            // error: error
        })
    }
}

const LoginController = async (req, res) => {
      try{
        const {email, password} = req.body;
    
        if(!email && !password){
            return res.status(400).json({
                status: "error",
                message: "Email and password are required."
            })
        }

        const existingUser = await userModel.findOne({email: email});
        const {username, passwordHash} = existingUser
        const isPasswordMatched = await bcrypt.compare(password, passwordHash);
        if(isPasswordMatched){
           const userCredentials = {email, username, passwordHash}
           const accessToken = generateAccessToken(userCredentials);
           const refreshToken = generateRefreshToken(userCredentials);
            
                res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Lax',
                path: '/',
                });

                res.cookie('sample', "Test", {
                httpOnly: true,
                secure: true,
                sameSite: 'Lax',
                path: '/',
                });
                
        
            return res.status(201).json({
                status: "success",
                message: "User is retrieved successfully.",
                accessToken: accessToken,
            });
        } else {
            res.status(400).json({
                status: "error",
                message: "Password doesn't matched."
            });
        }

    } catch (error) {
        console.error("Login failed", error);
        return res.status(500).json({
            status: "error",
            message: "Failed to create a new user.",
            error: error
        })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const {email, new_password} = req.body;
    
        //Encrypting the newPassword

        if(!email || !new_password){
            return res.status(400).json({
                status  : "error",
                message: "Email and password is required."
            });
        }
    
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);
        const userToUpdate = await userModel.findOneAndUpdate({email: email}, {password: hashedPassword});

        if(userToUpdate){
            return res.status(200).json({
                status: "success",
                message: "The password has been reset successfully"
            });
        } else {
            return res.status(400).send('Invalid or expired reset token');
        }

    } catch (error) {
        console.error("Unable to reset the password:", error);
        return res.status(500).json({
            status: "error",
            message: "Unable to reset the password",
            error: error
        }) 
    }
}

const verifyResetToken = async (req, res) => {
    //get token parameter from the url 
    const {token} = req.params;
    //check
    if(!token){
        return res.status(400).send('reset password token is required');      
    } 
        jwt.verify(token, process.env.JWT_SECRET_KEY);
    
  // Render password reset form (or send front-end signal)
//   res.send('Reset form goes here');
}

const refreshTokenController =  async (req, res) => {
  const token = req.cookies.refreshToken;
  const doesTokenExist = await refreshTokenModel.findOne({token: token})
  if (!token || !doesTokenExist) return res.sendStatus(403);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
     
    const accessToken = generateAccessToken({ email: user.email, });
    res.json({ accessToken });
  });
};

const logOutController = (req, res) => {
  const token = req.cookies.refreshToken;
  refreshTokenModel.findOneAndDelete({token: token});
  res.clearCookie('refreshToken', { path: '/refresh' });
  res.sendStatus(204);
};

const isUserAuthorized = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: `Welcome, ${user.username}!` });
  });
};

module.exports = {
    RegisterController,
    LoginController,
    ResetPassword,
    refreshTokenController,    
    logOutController,
    verifyResetToken,
    isUserAuthorized
}