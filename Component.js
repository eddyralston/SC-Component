const objectMapValues = function (obj) {
    var result = {}
    for (var prop in obj) result[prop] = obj[prop].value
    return result
}

const query = function (parent, attr, callback) {
    var query = parent.querySelectorAll('[' + attr + ']');
    var len = query.length;
    for (var i = 0; i < len; i++) callback(query[i], query[i].getAttribute(attr));
}

const queryToObject = (element,attr) => {
    var obj = {}
    query(element, attr, (child, attr) => obj[attr] = child)
    return obj
}

const constructMethods = ({data,child,methods}) => ({
    get data() {return objectMapValues(data)},
    get child() {return child},
    function: (name, method) => methods[name] = method
});

const queryMethods = (element,methods) => query(element, 'on', (child, attr) => {
    var [event, name] = attr.split(':')
    child.addEventListener(event, () => methods[name]())
})

const html = function (str) {
    var el = document.createElement('div')
    el.innerHTML = str
    return el.firstElementChild
}

const Component = (obj) => {
    var element = html(obj.html)
    var props = {
        data : queryToObject(element,'data'),
        child : queryToObject(element,'child'),
        methods : {}
    }
    queryMethods(element,props.methods)
    obj.construct(constructMethods(props))
    return element
}

export {Component,html}