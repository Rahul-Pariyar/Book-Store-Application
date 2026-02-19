const globalErrorHandler=(err,req,res,next)=>{
    
    console.error('ERROR:', err);

    const statusCode=err.statusCode || 500 

    if(err.isOperational){
        return res.status(statusCode).json({
            success:false,
            message:err.message
        });
    }

    res.status(500).json({
        success:false,
        message:'Internal server Error'
    })
}

export default globalErrorHandler;
