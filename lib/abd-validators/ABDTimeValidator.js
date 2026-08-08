import abDate from "ab-date";
import abText from "ab-text";
import ts0, {                  } from "@allblue/ts0"

import ABDFieldValidator, {                                                                 } from "./ABDFieldValidator.js";
                                             

class ABDTimeValidator extends ABDFieldValidator {
             get args()                               {
        return super.args                                ;
    }


    constructor(args                       ) {
        if (args.type === undefined)
            args.type = "dateTime";

        super(args);
    }

    getType()         {
        return 'JSON';
    }


    __validate(validator           , fieldName        , value             ) 
                 {
        if (value === null) {
            if (this.args.required)
                validator.fieldError(fieldName, abText.$('abData.NotSet'));
            else
                return;
        } else {
            if (isNaN(Number(value))) {
                validator.fieldError(fieldName, abText.$('abData.Time_WrongFormat'));
                return;
            }

            value = Number.parseInt(String(value));

            if (this.args.minDate !== undefined) {
                if (value < this.args.minDate) {
                    let formattedTime = "-";
                    switch(this.args.type) {
                        case "dateTime":
                            formattedTime = abDate.format_DateTime_UTC(
                                    this.args.minDate);
                            break;
                        case "date":
                            formattedTime = abDate.format_Date_UTC(
                                    this.args.minDate);
                            break;
                        case "time":
                            formattedTime = abDate.format_Time(
                                    this.args.minDate);
                            break;
                    }

                    validator.fieldError(fieldName, abText.$('abData.Time_BelowMinDate', 
                            { time: formattedTime }));
                }
            }

            if (this.args.maxDate !== undefined) {
                if (value > this.args.maxDate) {
                     let formattedTime = "-";
                    switch(this.args.type) {
                        case "dateTime":
                            formattedTime = abDate.format_DateTime_UTC(
                                    this.args.maxDate);
                            break;
                        case "date":
                            formattedTime = abDate.format_Date_UTC(
                                    this.args.maxDate);
                            break;
                        case "time":
                            formattedTime = abDate.format_Time(
                                    this.args.maxDate);
                            break;
                    }

                    validator.fieldError(fieldName, abText.$('abData.Time_AboveMaxDate', 
                            { time: formattedTime }));
                }
            }
        }
    }

}
export default ABDTimeValidator;

                                         
                                    
                     
                     
  
                                                            
                                  
                                                                          
                                  