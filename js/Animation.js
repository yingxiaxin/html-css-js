'use strict'

;
(function(root, factory) 
{
    if (typeof define === 'function' && define.amd)
    {
        define(['Animation'], factory);
    } 
    else if (typeof exports === 'object') 
    {
        module.exports = factory();
    } 
    else 
    {
        root['Animation'] = factory();
    }
})(this, function() 
{
    const DEFAULT_EASING = Math.tween.Linear,
        STATE_INITIAL = 0,
        STATE_START = 1,
        STATE_STOP = 2,
        DEFAULT_INTERVAL = 17;

    var Animation = function(ele) 
    {
        this.state = STATE_INITIAL;
        this.taskQueue = [];
        this.index = 0;
        this.ele = ele;
    }

    Animation.prototype.add = function(props, duration, options) 
    {
        var task = 
        {
            props: props,
            duration: duration,
            options: options || {},
            starttime: null,
            currenttime: null,
            lasttime: null,
            requestAnimationFrameId: null,
            timeoutId: null
        }
        this.taskQueue.push(task);
        return this;
    }

    Animation.prototype.start = function() 
    {
        if (this.state === STATE_START) 
        {
            return;
        }
        if (this.taskQueue.length === 0) 
        {
            return;
        }
        this.state = STATE_START;
        this._runTask();
    }

    Animation.prototype.stop = function() 
    {

    }

    Animation.prototype.pause = function() 
    {

    }

    Animation.prototype.restart = function() 
    {

    }

    Animation.prototype._runTask = function() 
    {
        var task = this.taskQueue[index];

        if (task === undefined) 
        {
            this._done();
            return;
        }

        this._handleProps(task);

        var me = this;

        if (task.options.delay !== undefined) 
        {
            task.timeoutId = setTimeout(
                function() 
                {
                    if (task.options.before !== undefined) 
                    {
                        task.options.before();
                    }
                    me._renderFrame(task);
                }, task.options.delay);
        } 
        else 
        {
            if (task.options.before !== undefined) 
            {
                task.options.before();
            }
            me._renderFrame(task);
        }
    }

    Animation.prototype._handleProps = function(task) 
    {
        // transform 的属性需要特别处理
        const transformProperties = ["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ"];

        // color 的属性需要特别处理
        const colorProperties = ["color", "background-color", "border-color", "outline-color"];

        var newProps = [];

        var propertyHandler = {};
        propertyHandler['default'] = function(item) 
        {
            var ele = this.ele;
            var begin = getComputedStyle(ele, null).getPropertyValue(item['propertyName']);
            var end = item['propertyValue'];

            var propObj = {};
            propObj.beginValue = begin;
            propObj.endValue = end;
            propObj.propName = item['propertyName'];
            return propObj;
        }
    }



})