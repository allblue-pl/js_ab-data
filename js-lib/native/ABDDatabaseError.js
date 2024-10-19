'use strict';

class ABDDatabaseError extends Error
{
    constructor(message) {
        super(message);

        this.name = 'ABDDatabaseError';
    }
    
}
module.exports = ABDDatabaseError;