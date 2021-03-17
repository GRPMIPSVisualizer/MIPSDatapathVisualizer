export class ExceptionReporter{
    private static exceptionReporter:ExceptionReporter = new ExceptionReporter();
    private ExceptionArray:string[] = new Array<string>(); 


    private constructor(){

    }


    public static getReporter():ExceptionReporter{
        return this.exceptionReporter;
    }

    public addException(newExcp:string){
        this.ExceptionArray.push(newExcp);
    }

    public isEmpty(){
        if (this.ExceptionArray.length == 0)
            return true;
        return false;
    }

    public reportException():string[]{
        return this.ExceptionArray;        
    }

    public clearException():void{
        this.ExceptionArray = new Array<string>();
    }
}