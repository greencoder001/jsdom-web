(function(){

function JSDOM (html, options) {
    // Check if called with new, else return new instance
    if (!(this instanceof JSDOM)) {
        return new JSDOM(html, options);
    }

    var p = this

    // Constructor
    var ttbh = ['title', 'base', 'link', 'meta', 'style', 'script', 'noscript', 'template']

    p.sb = document.createElement('html')

    p.sb.append(document.createElement('head'))
    p.sb.append(document.createElement('body'))

    var sbox = p.sb

    p.window = {
        eval: function (code) {
            // Generate sandboxid
            var sandboxid = Array.from({ length: 200 }, function () { return Math.floor(Math.random() * 10) }).join('')
            window['_jsdom-sandbox+' + sandboxid] = p


            // Execute the script inside the sandbox DOM context
            var scriptcode = "(function(document, window) {" + code + "})(window['_jsdom-sandbox+" + sandboxid + "'].document, window['_jsdom-sandbox+" + sandboxid + "'].window);"

            // Evaluate it
            eval(scriptcode)
        },
        document: {
            get body() {
                return p.querySelector('body')
            },
            get head() {
                return p.querySelector('head')
            },
            get documentElement() {
                return p.querySelector('html')
            },

            querySelector: function (selector) {
                return sbox.querySelector(selector)
            },
            querySelectorAll: function (selector) {
                return sbox.querySelectorAll(selector)
            },
            getElementsByTagName: function (tagName) {
                return sbox.getElementsByTagName(tagName)
            },
            getElementsByTagNameNS: function (namespace, tagName) {
                return sbox.getElementsByTagNameNS(namespace, tagName)
            },
            getElementsByClassName: function (className) {
                return sbox.getElementsByClassName(className)
            },
            getElementsByName: function (name) {
                return sbox.getElementsByName(name)
            },
            getElementsByNameNS: function (namespace, name) {
                return sbox.getElementsByNameNS(namespace, name)
            },

            appendChild: function (child) {
                // Check if child belongs in head
                if (ttbh.includes(child.tagName.toLowerCase())) {
                    sbox.querySelector('head').appendChild(child)
                } else {
                    return sbox.querySelector('body').appendChild(child)
                }
            },
            append: function () {
                for (var _ic = 0; _ic < arguments.length; _ic++) {
                    var child = arguments[_ic]
                    if (typeof child === 'string') {
                        sbox.querySelector('body').append(child);
                    } else {
                        if (ttbh.includes(child.tagName.toLowerCase())) {
                            sbox.querySelector('head').appendChild(child);
                        } else {
                            sbox.querySelector('body').appendChild(child);
                        }
                    }
                }
            },
            insertBefore: function (child, referenceNode) {
                if (ttbh.includes(child.tagName.toLowerCase())) {
                    sbox.querySelector('head').insertBefore(child, referenceNode)
                } else {
                    return sbox.querySelector('body').insertBefore(child, referenceNode)
                }
            },
            insertAdjacentHTML: function (position, html) {
                sbox.querySelector('body').insertAdjacentHTML(position, html)
            },
            insertAdjacentText: function (position, text) {
                sbox.querySelector('body').insertAdjacentText(position, text)
            }
        },
        window: p,
        navigator: navigator,
        history: {
            pushState: function () { },
            replaceState: function () { }
        },
        location: location,
        screen: screen,
        addEventListener: function (type, listener) {
            if (type === 'load') {
                listener()
                return
            }

            if (type === 'error') {
                listener()
                return
            }

            if (type === 'DOMContentLoaded') {
                listener()
                return
            }

            if (type === 'readystatechange') {
                listener()
                return
            }

            p.sb.addEventListener(type, listener)
        }
    }

    var dcfn = [
        'createElement',
        'createTextNode',
        'createComment',
        'createDocumentFragment',
        'createEvent',
        'createRange',
        'createNodeIterator',
        'createTreeWalker',
        'createElementNS',
        'createTextNodeNS',
        'createCommentNS',
        'createDocumentFragmentNS',
        'createEventNS',
        'createRangeNS',
        'createNodeIteratorNS',
        'createTreeWalkerNS',
        'createExpression',
        'createExpressionNS',
        'createXPathEvaluator',
        'createXPathNSResolver'
    ]

    dcfn.forEach(function _(fn) {
        p.window.document[fn] = function () {
            return document[fn].apply(document, arguments)
        }
    })

    p.sb.querySelector('body').innerHTML = html

    // Run scripts if options.runScripts is "dangerously"
    if (options && options.runScripts === 'dangerously') {
        var scripts = p.sb.querySelectorAll('script')
        for (var _ia = 0; _ia < scripts.length; _ia++) {
            var script = scripts[_ia]
            var scriptText = script.innerHTML

            p.window.eval(scriptText)
        }
    }
    // Go through every element in the body and put it in the head if it belongs in head
    for (var _ib = 0; _ib < p.sb.querySelector('body').length; _ib++) {
        var element = p.sb.querySelector('body')[_ib]
        if (ttbh.includes(element.tagName.toLowerCase())) {
            p.window.document.head.appendChild(element)
        }
    }


    p.document = p.window.document;
}

window.JSDOM = JSDOM

})();