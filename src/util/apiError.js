class apiError extends Error{
    constructor(
        statusCode,
        message = "Something went Wrong !!",
        errors = [],
        stake = ""
    ){
        //overriding
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        
        if(stake){
            this.stack = stake;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export { apiError };