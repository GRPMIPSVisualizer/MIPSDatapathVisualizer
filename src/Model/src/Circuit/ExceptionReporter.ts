/**
 * This class accepts singleton design pattern
 */
export class ExceptionReporter{
    /**
     * the only instantiated object of this class.
     */
    private static exceptionReporter:ExceptionReporter = new ExceptionReporter();
    /**
     * an array of string which stores the exception information
     */
    private ExceptionArray:string[] = new Array<string>(); 

    /**
     * the constructor is set to private. So this class can't be instantiated outside this class
     */
    private constructor(){

    }

    /**
     * get the instantiated object of an exception reportor
     * @returns the instantiated object of this class
     */
    public static getReporter():ExceptionReporter{
        return this.exceptionReporter;
    }

    /**
     * Add a new exception information to {@link ExceptionArray}<br/>
     * This message will be passed to console and render on the screen
     * @param newExcp new exception information message 
     */
    public addException(newExcp:string){
        this.ExceptionArray.push(newExcp);
    }

    /**
     * a boolean value which indicates whether the exception array is empty
     * @returns true if empty, false otherwise
     */
    public isEmpty():boolean{
        if (this.ExceptionArray.length == 0)
            return true;
        return false;
    }
    /**
     * report exception by passing exception messages to console
     */
    public reportException():string[]{
        return this.ExceptionArray;        
    }
    /**
     * clear exceptions
     */
    public clearException():void{
        this.ExceptionArray = new Array<string>();
    }
}