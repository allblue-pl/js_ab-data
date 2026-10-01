import TableDef from "./TableDef.ts";
import { type ABDFieldInfo } from "./abd-fields/index.ts";
declare class RTableDef extends TableDef {
    constructor(id: number, name: string, alias: string, columns: Array<ABDFieldInfo>);
}
export default RTableDef;
