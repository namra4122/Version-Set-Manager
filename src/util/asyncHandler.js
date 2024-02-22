const aysncHandler = (reqHandler) => (req,res,next) => {
    
    Promise.resolve(reqHandler(req,res,next)).catch((error) => next(error));
    
    // try{
    //     await reqHandler(req,res,next);
    // }catch(error){
    //     res.status(error.code || 500).json({
    //         success : false,
    //         message : error.message,
    //     })
    // }
}

export { aysncHandler }