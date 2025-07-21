class ExpressError extends Error{
    constructor(message, statuscode){
        super();
        this.message= message;
        this.statusCode=this.statusCode;
    }
}

module.exports=ExpressError;