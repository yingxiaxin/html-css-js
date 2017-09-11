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
}(window, function() 
{
    const DEFAULT_EASING = 'linear',
        STATE_INITIAL = 0,
        STATE_START = 1,
        STATE_STOP = 2,
        DEFAULT_INTERVAL = 17;

    var Animation = function() 
    {
        this.state = STATE_INITIAL;
        this.taskQueue = [];
        this.index = 0; 
    }

    Animation.prototype.add = function(targets, props, duration, options) 
    {
        var isEqualLength = [targets.length, props.length];
        if (isEqualLength.indexOf(!isEqualLength[0]) >= 0)  //如果两个数组长度不等，则输入参数错误
        {
            throw '添加动画任务时动画对象个数及其属性数组内元素个数不一致，请确认输入参数';
            return;
        }
        var task = 
        {
            targets:targets,
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
        var task = this.taskQueue[this.index];

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
            //me._renderFrame(task);
        }
    }

    Animation.prototype._handleProps = (function(task) 
    {
        // transform 的属性需要特别处理
        const transformProperties = ["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ"];

        // color 的属性需要特别处理
        const colorProperties = ["color", "backgroundColor", "borderColor", "outlineColor"];

        var newProps = [];

        var propertyHandler = {};

        propertyHandler['default'] = function(ele, item) 
        {
            var begin = getComputedStyle(ele, null).getPropertyValue(item['propertyName']);
            var end = item['propertyValue'];

            var propObj = {};
            propObj.beginValue = begin;
            propObj.endValue = end;
            propObj.propName = item['propertyName'];
            propObj.type = 'default';
            return propObj;
        }

        for (var prptName of transformProperties)
        {
            propertyHandler[prptName] = function(ele, item) 
            {
                var begin = getComputedStyle(ele, null).getPropertyValue(item['propertyName']);
                var end = item['propertyValue'];
    
                var propObj = {};
                propObj.beginValue = begin;
                propObj.endValue = end;
                propObj.propName = 'transform';
                propObj.type = prptName;
                return propObj;
            }
        }

        for (var prpt of colorProperties)
        {
            propertyHandler[prpt] = function(ele, item) 
            {
                var begin = getComputedStyle(ele, null).getPropertyValue(item['propertyName']);
                var end = item['propertyValue'];
    
                var propObj = {};
                propObj.beginValue = begin;
                propObj.endValue = end;
                propObj.propName = prpt;
                propObj.type = prpt;
                return propObj;
            }
        }

        return function(task)       //targets:[ele1, ele2], props:[[{propertyName:width, propertyValue:300}, {propertyName:height, propertyValue:200}], [{propertyName:backgroundColor, propertyValue:xxx}]]
        {
            if (task.hasOwnProperty('targets'))
            {
                task.newProps = [];
                var len = task.targets.length;
                for (var i=0; i<len; i++)
                {
                    var propArr = [];
                    var ele = task.targets[i];
                    for (var propItem of task.props[i])
                    {
                        var obj;
                        if (transformProperties.indexOf(propItem['propertyName']) >= 0)
                        {
                            obj = propertyHandler[propItem['propertyName']](ele, propItem);
                        }
                        else if (colorProperties.indexOf(propItem['propertyName']) >= 0)
                        {
                            obj = propertyHandler[propItem['propertyName']](ele, propItem);
                        }
                        else
                        {
                            obj = propertyHandler['default'](ele, propItem);
                        }
                        propArr.push(obj);
                    }

                    task.newProps.push(propArr);
                }                
            }
        }

    })();


    return Animation;
}))