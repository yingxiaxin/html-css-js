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
    const DEFAULT_EASING = Tween.Linear,
        STATE_INITIAL = 0,
        STATE_START = 1,
        STATE_STOP = 2,
        DEFAULT_INTERVAL = 17;

    let Animation = function() 
    {
        this.state = STATE_INITIAL;
        this.taskQueue = [];
        this.index = 0; 
    }

    Animation.prototype.add = function(targets, props, duration, options) 
    {
        let isEqualLength = [targets.length, props.length];
        if (isEqualLength.indexOf(!isEqualLength[0]) >= 0)  //如果两个数组长度不等，则输入参数错误
        {
            throw '添加动画任务时动画对象个数及其属性数组内元素个数不一致，请确认输入参数';
            return;
        }
        let task = 
        {
            targets:targets,
            props: props,
            duration: duration,
            options: options || {},
            starttime: null,    //开始时间
            currenttime: null,  //进行到的时间
            lasttime: 0,     //持续到的时间
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
        let task = this.taskQueue[this.index];

        if (task === undefined) 
        {
            this._done();
            return;
        }

        this._handleProps(task);

        let me = this;

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

    Animation.prototype._handleProps = (function(task) 
    {
        // transform 的属性需要特别处理，
        const transformProperties = ["translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "scaleZ", "skewX", "skewY", "rotateX", "rotateY", "rotateZ", "matrix"];

        // color 的属性需要特别处理
        const colorProperties = ["color", "background-color", "border-color", "outline-color"];

        let newProps = [];

        let propertyHandler = {};

        propertyHandler['default'] = function(ele, item) 
        {
            let begin = getComputedStyle(ele, null).getPropertyValue(item['propertyName']);
            let end = item['propertyValue'];

            let propObj = {};
            propObj.beginValue = begin;
            propObj.endValue = end;
            propObj.propName = item['propertyName'];
            propObj.type = 'default';
            return propObj;
        }

        for (let prptName of transformProperties)
        {
            propertyHandler[prptName] = function(ele, item) 
            {
                let begin = getComputedStyle(ele, null).getPropertyValue('transform');
                let end = item['propertyValue'];
    
                let propObj = {};
                propObj.beginValue = begin;
                propObj.endValue = end;
                propObj.propName = prptName;
                propObj.type = 'transform';
                return propObj;
            }
        }

        for (let prpt of colorProperties)
        {
            propertyHandler[prpt] = function(ele, item) 
            {
                let begin = getComputedStyle(ele, null).getPropertyValue(item['propertyName']);
                let end = item['propertyValue'];
    
                let propObj = {};
                let realPrptName = nameTransform(prpt);
                propObj.beginValue = begin;
                propObj.endValue = end;
                propObj.propName = realPrptName;
                propObj.type = 'color';
                return propObj;
            }
        }

        //颜色值background-color、outline-color等在通过getComputedStyle时是用横线隔开，用js设置的时候则用驼峰名称，此函数进行名称转换
        let nameTransform = function(propName)
        {
            return propName.replace(/-[a-zA-Z]/g, function(s){return s.substring(1).toUpperCase();});
        }


        return function(task)       //targets:[ele1, ele2], props:[[{propertyName:width, propertyValue:300}, {propertyName:height, propertyValue:200}], [{propertyName:backgroundColor, propertyValue:xxx}]]
        {
            if (task.hasOwnProperty('targets'))
            {
                task.newProps = [];
                let len = task.targets.length;
                for (let i=0; i<len; i++)
                {
                    let propArr = [];
                    let ele = task.targets[i];
                    for (let propItem of task.props[i])
                    {
                        let obj;
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


    Animation.prototype._renderFrame = function(task)
    {
        task.starttime = (new Date()).getTime() - task.lasttime;
        let self = this;
        let duration = task.duration;

        task.requestAnimationFrameId = function()
        {
            if (self.state !== STATE_START)
            {
                return;
            }
            task.currenttime = (new Date()).getTime();  //当前时间
            task.lasttime = task.currenttime - task.starttime;  //持续了多长时间

            let easing = task.options.easing ? task.options.easing : DEFAULT_EASING;    //设置缓动函数

            if (task.lasttime >= duration)
            {
                
            }
            else
            {
                for (let i=0; i<task.targets.length; i++)
                {
                    for (let j=0; j<task.newProps[i]; j++)
                    {
                        let property = task.newProps[i][j];
                        switch (property.type)
                        {
                            case 'default':
                            {
                                if (property.beginValue.indexOf('px') >= 0)
                                {
                                    let begin = parseFloat(property.beginValue.replace('px', ''));
                                    let change = parseFloat(property.endValue) - begin;
                                    let current = easing(task.currenttime, begin, change, duration);
                                    task.targets[i].style[property.propName] = current + 'px';
                                }
                                else
                                {
                                    let begin = parseFloat(property.beginValue);
                                    let change = parseFloat(property.endValue) - begin;
                                    let current = easing(task.currenttime, begin, change, duration);
                                    task.targets[i].style[property.propName] = current;
                                }
                                break;
                            }
                            case 'color':
                            {
                                
                                break;
                            }
                            case 'transform':
                            {

                                break;
                            }
                        }
                    }
                }
            }




        }
    }







    
    /*缓动函数
    * Tween.js
    * t: current time（当前时间）；
    * b: beginning value（初始值）；
    * c: change in value（变化量）；
    * d: duration（持续时间）。
    * you can visit 'http://easings.net/zh-cn' to get effect
    */
    var Tween = 
    {
        Linear: function(t, b, c, d) 
        {
            return c * t / d + b; 
        },
        Quad: 
        {
            easeIn: function(t, b, c, d) 
            {
                return c * (t /= d) * t + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        Cubic: 
        {
            easeIn: function(t, b, c, d) 
            {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        Quart: 
        {
            easeIn: function(t, b, c, d) 
            {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        Quint: 
        {
            easeIn: function(t, b, c, d) 
            {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        Sine: 
        {
            easeIn: function(t, b, c, d) 
            {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        Expo: 
        {
            easeIn: function(t, b, c, d) 
            {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        Circ: 
        {
            easeIn: function(t, b, c, d) 
            {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function(t, b, c, d) 
            {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function(t, b, c, d) 
            {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        Elastic: 
        {
            easeIn: function(t, b, c, d, a, p) 
            {
                var s;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (typeof p == "undefined") p = d * .3;
                if (!a || a < Math.abs(c)) 
                {
                    s = p / 4;
                    a = c;
                } 
                else 
                {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function(t, b, c, d, a, p) 
            {
                var s;
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (typeof p == "undefined") p = d * .3;
                if (!a || a < Math.abs(c)) 
                {
                    a = c;
                    s = p / 4;
                } 
                else 
                {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function(t, b, c, d, a, p) 
            {
                var s;
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (typeof p == "undefined") p = d * (.3 * 1.5);
                if (!a || a < Math.abs(c)) 
                {
                    a = c;
                    s = p / 4;
                } 
                else 
                {
                    s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        },
        Back: 
        {
            easeIn: function(t, b, c, d, s) 
            {
                if (typeof s == "undefined") s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function(t, b, c, d, s) 
            {
                if (typeof s == "undefined") s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function(t, b, c, d, s) 
            {
                if (typeof s == "undefined") s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        Bounce: 
        {
            easeIn: function(t, b, c, d) 
            {
                return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function(t, b, c, d) 
            {
                if ((t /= d) < (1 / 2.75)) 
                {
                    return c * (7.5625 * t * t) + b;
                } 
                else if (t < (2 / 2.75)) 
                {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } 
                else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } 
                else 
                {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function(t, b, c, d) 
            {
                if (t < d / 2) 
                {
                    return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                } 
                else 
                {
                    return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                }
            }
        }
    }







    return Animation;
}))