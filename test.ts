
import abUUID from "./ts-lib/abUUID.ts";

let uuid = abUUID.generate();
console.log("Time", abUUID.getTime(uuid), abUUID.validate(uuid));
console.log(abUUID.validate(crypto.randomUUID()));