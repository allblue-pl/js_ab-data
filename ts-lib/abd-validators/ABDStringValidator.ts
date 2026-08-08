import abStrings from "ab-strings";
import abText from "ab-text";
import ts0, { type TS0RawValue } from "@allblue/ts0"

import ABDFieldValidator, { type ABDFieldValidator_Args, type ABDFieldValidator_Args_Parsed } from "./ABDFieldValidator.ts";
import type Validator from "../Validator.ts";

class ABDStringValidator extends ABDFieldValidator {
    override get args(): ABDStringValidator_Args_Parsed {
        return super.args as ABDStringValidator_Args_Parsed;
    }


    constructor(args: ABDStringValidator_Args) {
        if (args.trim === undefined)
            args.trim = false;
        if (args.chars == undefined)
            args.chars = abStrings.getCharsRegExp_Basic();

        super(args);
    }

    getType(): string {
        return 'JSON';
    }


    __validate(validator: Validator, fieldName: string, value: TS0RawValue):
            void {
        value = String(value);

        if (this.args['trim'])
            value = value.trim();

        if (value === '') {
            if (this.args.required)
                validator.fieldError(fieldName, abText.$('abData.NotSet'));

            return;
        } else {
            if (this.args.minLength !== undefined) {
                if (value.length < this.args.minLength) {
                    validator.fieldError(fieldName, abText.$(
                            'abData.Errors_BelowMinLength', 
                            { minLength: String(this.args.minLength) }));
                }
            }

            if (this.args.maxLength !== undefined) {
                if (this.args.maxLength > 0) {
                    if (value.length > this.args.maxLength) {
                        validator.fieldError(fieldName, abText.$(
                                'abData.Errors_AboveMaxLength', 
                                { maxLength: String(this.args.maxLength) }));
                    }
                }
            }

            if (this.args.regexp !== undefined) {
                // regexp = str_replace('#', '\\#', this.args.regexp[0]);
                let regexp = this.args.regexp[0];

                if (!(new RegExp(`${regexp}`)).test(value)) {
                    validator.fieldError(fieldName, abText.$('abData.Errors_WrongFormat',
                        { format: this.args.regexp[1] }));
                }
            }

            if (this.args['chars'] !== null) {
                let chars_Escaped =  this.args['chars']; //abStrings.escapeRegExpChars(this.args['chars']);
                // value = ' hello ';
                // echo '#' . chars . '#' . value . '#';

                if (!(new RegExp(`^[${chars_Escaped}]*$`)).test(value)) {
                    let notAllowedChars = [];
                    let re = new RegExp(`[^${chars_Escaped}]`, 'g');

                    while (true) {
                        let match = re.exec(value);
                        if (!match)
                            break;

                        notAllowedChars.push(match[0]);
                    }

                    let notAllowedChars_Str = notAllowedChars.join(', ');

                    // not_allowed_chars = str_replace('\\\\', '&#92;', not_allowed_chars);
                    // not_allowed_chars = str_replace('\\', '', not_allowed_chars);
                    // not_allowed_chars = str_replace('&#92;', '\\', not_allowed_chars);

                    validator.fieldError(fieldName, abText.$(
                            'abData.Errors_NotAllowedCharacters',
                            { notAllowedChars: notAllowedChars_Str }));
                }
            }
        }
    }

}
export default ABDStringValidator;

export type ABDStringValidator_Args_Raw = {
    minLength?: number,
    maxLength?: number,
    regexp?: [ string, string ];
    trim?: boolean
    chars?: string,
};
export type ABDStringValidator_Args = ABDFieldValidator_Args &
        ABDStringValidator_Args_Raw;
export type ABDStringValidator_Args_Parsed = ABDFieldValidator_Args_Parsed &
        ABDStringValidator_Args_Raw;