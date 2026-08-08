import abDate from "ab-date";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDTimeValidator extends ABDFieldValidator {
    override get args(): ABDTimeValidator_Args_Parsed {
        return super.args as ABDTimeValidator_Args_Parsed;
    }


    constructor(args: ABDTimeValidator_Args) {
        if (args.type === undefined)
            args.type = "dateTime";

        super(args);
    }

    getType(): string {
        return 'JSON';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
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

export type ABDTimeValidator_Args_Raw = {
    type?: 'dateTime'|'date'|'time',
    minDate?: number,
    maxDate?: number,
};
export type ABDTimeValidator_Args = ABDFieldValidator_Args &
        ABDTimeValidator_Args_Raw;
export type ABDTimeValidator_Args_Parsed = ABDFieldValidator_Args_Parsed &
        ABDTimeValidator_Args_Raw;