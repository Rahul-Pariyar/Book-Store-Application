import joi from 'joi'

const signupSchema=joi.object({
    name:joi.string().max(30).message({
        'string.max':'User is too long. Max character is 30'
    }).required(),
    email:joi.string().email().message({
        'string.email':'Please, enter valid email'
    }),
    password:joi.string().min(8).message({
        'string.min':'Password must be of atleast 8 character'
    }).required()
});

export const signupValidator=(req,res,next)=>{
    const {error}=signupSchema.validate(req.body);
    if(error){
        return res.status(422).json({errors: error.details.map(err => err.message)});
    }
    next();
}

const loginSchema=joi.object({
    email:joi.string().email().message({
        'string.email':'Please enter valid email'
    }).required(),
    password:joi.string().min(8).message({
        'string.min':'Password must be 8 character long'
    }).required()
});

export const loginValidator=(req,res,next)=>{
    const {error}=loginSchema.validate(req.body)
    if(error){
        return res.status(422).json({message:'Error validating login',success:false})
    }
    next();
}

