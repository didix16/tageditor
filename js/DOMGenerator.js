function DOMGenerator() {

    this.elem = null;
    return this;
}

DOMGenerator.prototype.constructor = DOMGenerator;

DOMGenerator.prototype.INSERT_ELEMENT_BEFORE_BEGIN = "beforebegin";
DOMGenerator.prototype.INSERT_ELEMENT_AFTER_BEGIN = "afterbegin";
DOMGenerator.prototype.INSERT_ELEMENT_BEFORE_END = "beforeend";
DOMGenerator.prototype.INSERT_ELEMENT_AFTER_END = "afterend";

DOMGenerator.prototype.getElement = function () {
    
    return this.elem;
}

DOMGenerator.prototype.createElement = function (el) {
    
    this.elem = document.createElement(el);
    return this;
}

DOMGenerator.prototype.addClass = function (clas) {
    
    this.elem.className += " " + clas;
    return this;
}

DOMGenerator.prototype.removeClass = function (clas) {
    
    let classes = this.elem.className.split(" ");
    let i = 0, notFound = true;
    for (; notFound && i < classes.length; i++){
        
        if (classes[i] === clas) {
            notFound = false;
            classes.splice(i, 1);
        }
    }
    this.elem.className = classes.join(" ");
    return this;
}

DOMGenerator.prototype.html = function (data) {
    
    if (typeof data === "string") {
        
        this.elem.innerHTML = data;
        return this;
    } else {
        return this.elem.innerHTML;
    }
}

DOMGenerator.prototype.text = function (data) {
    
    if (typeof data === "string") {
        
        this.elem.innerText = data;
        return this;
    } else {
        return this.elem.innerText;
    }
}

DOMGenerator.prototype.attr = function (attr, value) {
    
    if (typeof value === "undefined") {
        
        return this.elem.getAttribute(attr);
    } else {
        this.elem.setAttribute(attr, value);
        return this;
    }
}

DOMGenerator.prototype.id = function (data) {
    
    if (typeof data === "string" || typeof data === "number") {
        
        this.elem.id = data;
        return this;
    } else {
        return this.elem.id;
    }
}

DOMGenerator.prototype.on = function (evtName, callback) {
    
    this.elem.addEventListener(evtName, callback);
    return this;
};

module.exports = new DOMGenerator();