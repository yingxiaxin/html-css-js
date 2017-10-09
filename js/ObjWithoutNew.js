'use strict'

;
(function(root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        define(['ObjWithoutNew'], factory);
    }
    else if (typeof exports === 'object')
    {
        module.exports = factory();
    }
    else
    {
        root['ObjWithoutNew'] = factory();
    }
}(window, function(){

    let ObjWithoutNew = function()
    {
        return new ObjWithoutNew.prototype.init();
    }

    ObjWithoutNew.fn = ObjWithoutNew.prototype = 
    {
        constructor: ObjWithoutNew,
        state: 1, 
        index: 0,
        init: function()
        {
            return this;
        },
        doit: function()
        {
            console.log('name invoked');
        }
    }

    ObjWithoutNew.fn.init.prototype = ObjWithoutNew.prototype;

    ObjWithoutNew.prototype.fu = function()
    {
        console.log('1');
    }

    ObjWithoutNew.fuckit = function()
    {
        console.log('3342342');
    }

    ObjWithoutNew.num = 2;

    return ObjWithoutNew;
}));