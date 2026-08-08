import TableDef from "./TableDef.ts";
import type ABDAutoIncrementId from "./abd-fields/ABDAutoIncrementId.ts";
import type ABDBlob from "./abd-fields/ABDBlob.ts";
import type { ABDBlobValidator_Args } from "./abd-validators/ABDBlobValidator.ts";
import type ABDBool from "./abd-fields/ABDBool.ts";
import type { ABDBoolValidator_Args } from "./abd-validators/ABDBoolValidator.ts";
import type ABDDate from "./abd-fields/ABDDate.ts";
import type ABDDateTime from "./abd-fields/ABDDateTime.ts";
import type ABDFloat from "./abd-fields/ABDFloat.ts";
import type ABDId from "./abd-fields/ABDId.ts";
import type ABDInt from "./abd-fields/ABDInt.ts";
import type ABDJSON from "./abd-fields/ABDJSON.ts";
import type ABDLong from "./abd-fields/ABDLong.ts";
import type ABDString from "./abd-fields/ABDString.ts";
import type ABDTime from "./abd-fields/ABDTime.ts";
import type ABDText from "./abd-fields/ABDText.ts";
import type { ABDTimeValidator_Args } from "./abd-validators/ABDTimeValidator.ts";
import type { ABDFloatValidator_Args } from "./abd-validators/ABDFloatValidator.ts";
import type { ABDIntValidator_Args } from "./abd-validators/ABDIntValidator.ts";
import type { ABDJSONValidator_Args } from "./abd-validators/ABDJSONValidator.ts";
import type { ABDLongValidator_Args } from "./abd-validators/ABDLongValidator.ts";
import type { ABDStringValidator_Args } from "./abd-validators/ABDStringValidator.ts";
declare class RTableDef extends TableDef {
    constructor(id: number, name: string, alias: string, columns: ColumnInfos);
}
export default RTableDef;
type ColumnInfos = Array<[string, ABDAutoIncrementId] | [
    string,
    ABDBlob,
    ABDBlobValidator_Args?
] | [
    string,
    ABDBool,
    ABDBoolValidator_Args?
] | [
    string,
    ABDDate,
    ABDTimeValidator_Args?
] | [
    string,
    ABDDateTime,
    ABDTimeValidator_Args?
] | [
    string,
    ABDFloat,
    ABDFloatValidator_Args?
] | [
    string,
    ABDId
] | [
    string,
    ABDInt,
    ABDIntValidator_Args?
] | [
    string,
    ABDJSON,
    ABDJSONValidator_Args?
] | [
    string,
    ABDLong,
    ABDLongValidator_Args?
] | [
    string,
    ABDString,
    ABDStringValidator_Args?
] | [
    string,
    ABDText,
    ABDStringValidator_Args?
] | [
    string,
    ABDTime,
    ABDTimeValidator_Args?
]>;
