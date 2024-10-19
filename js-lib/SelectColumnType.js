'use strict';

class SelectColumnType {

    static get Bool() { return 0; }
    static get Float() { return 1; }
    static get Int() { return 2; }
    static get Long() { return 3; }
    static get JSON() { return 4; }
    static get String() { return 5; }

}
module.exports = SelectColumnType;