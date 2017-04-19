function Tool(opts) {
    
    // Initialize Tool by opts
    for (let prop in this) {
        
        if (opts[prop]) this[prop] = opts[prop];
    }
    return this;
}

Tool.prototype.constructor = Tool;
/**
 *@var internalName
 *@description An internal name that indentificates the tageditor tool
 */
Tool.prototype.internalName = "";

/**
 *@var icon
 *@description A fontawesome class icon
 */
Tool.prototype.icon = "";

Tool.prototype.code = function () {
    
    // Execution tool code
}

module.exports = Tool;