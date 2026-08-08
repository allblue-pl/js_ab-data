import RequestDef from "./RequestDef.ts";
import { type ABDataDefPreset } from "./abDataDefTypes.ts";
declare class TableRequestDef extends RequestDef {
    static Args_Delete(): ABDataDefPreset;
    static Args_Select(): ABDataDefPreset;
    constructor(readOnly?: boolean);
}
export default TableRequestDef;
