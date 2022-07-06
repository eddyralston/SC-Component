const objectMap = function (obj, callback) {
    var result = {}
    for (var prop in obj) result[prop] = callback(obj[prop])
    return result
}
const html = function (str) {
    var el = document.createElement('div')
    el.innerHTML = str
    return el.firstElementChild
}
const queryChildren = function (parent, attr, callback) {
    var query = parent.querySelectorAll('[' + attr + ']');
    var len = query.length
    for (var i = 0; i < len; i++) callback(query[i], query[i].getAttribute(attr))
}

function Component(obj) {
    var self = {
        element: html(obj.html),
        data: {},
        methods: {},
        child: {}
    }

    queryChildren(self.element, 'data', (child, attr) => self.data[attr] = child)

    queryChildren(self.element, 'child', (child, attr) => self.child[attr] = child)
    
    queryChildren(self.element, 'on', (child, attr) => {
        var [event, name] = attr.split(':')
        child.addEventListener(event, () => self.methods[name]())
    })

    obj.construct({
        get data() {
            return objectMap(self.data, (child) => child.value)
        },
        function: (name, method) => self.methods[name] = method,
        child:self.child
    })
    return self.element
}

export {Component,html}