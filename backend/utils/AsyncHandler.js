const AsyncHandler=(fn)=>{
    return async (req,res,next)=>{
        try{
            return await fn(req,res,next);
        }catch(err){
            next(err)
        }
    }
}
export default AsyncHandler;
