var TagEditorManager = require("./manager");
window.onload = function () {
    // Find all elements with data-tageditor and instantiate it
    let elements = document.querySelectorAll("[data-tageditor]");
    let i = 0;
    for (; i < elements.length; i++) {
        
        // Generate
        TagEditorManager.build(elements[i]);
    }

};
window.TagEditorManager = TagEditorManager;