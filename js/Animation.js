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





    const DEFAULT_EASING = Tween.Linear,
        STATE_INITIAL = 0,
        STATE_START = 1,
        STATE_STOP = 2,
        DEFAULT_INTERVAL = 17,
        SETPROP_DEFAULT = 0,
        SETPROP_END = 1,
        SETPROP_BEGIN = 2;

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
            animationFrameFn: null,  
            animationFrameId:null,
            timeoutId: null,
            propsCalculted: false
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
        if (this.state === STATE_INITIAL) 
        {
            return;
        }

        this.pause(); // 先暂停动画

        let task = this.taskQueue[this.taskQueue.length - 1]; // 切换到最后一个命令

        this._handleProps(task);

        this._setProperty(task, SETPROP_END);

        this._reset(); // 重置动画序列
    }

    Animation.prototype.pause = function()
    {
        if (this.state !== STATE_START)
        {
            return;
        }
        this.state = STATE_STOP;
        let task = this.taskQueue[this.index];

        if (task.animationFrameId !== null) 
        {
            cancelAnimationFrame(task.animationFrameId);
            task.animationFrameFn = null;
            task.animationFrameId = null;
        }
        if (task.timeoutId !== null) 
        {
            clearTimeout(task.timeoutId);
            task.timeoutId = null;
        }
        return this;
    }

    Animation.prototype.restart = function() 
    {
        let task = this.taskQueue[this.index];
        this.pause();

        for (let i=0; i<this.taskQueue.length; i++)
        {
            this._setProperty(this.taskQueue[i], SETPROP_BEGIN);
        }        

        this._reset();
        this.start();
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
                let begin = getComputedStyle(ele, null).getPropertyValue('transform') === 'none' ? 'matrix(1,0,0,1,0,0)' : getComputedStyle(ele, null).getPropertyValue('transform');
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
            if (task.propsCalculted === true)
            {
                return;
            }
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
            task.propsCalculted = true;            
        }

    })();


    Animation.prototype._renderFrame = function(task)
    {
        task.starttime = (new Date()).getTime() - task.lasttime;
        let self = this;
        let duration = task.duration;

        task.animationFrameFn = function()
        {
            if (self.state !== STATE_START)
            {
                return;
            }
            task.currenttime = (new Date()).getTime();  //当前时间
            task.lasttime = task.currenttime - task.starttime;  //持续了多长时间

            //如果持续时间超过了duration，直接将值置为设定值，然后执行下一个任务
            if (task.lasttime >= duration)
            {
                self._setProperty(task, SETPROP_END);

                if (task.options.after) 
                {
                    task.options.after();
                }

                // 执行下一个任务
                self._next();
            }
            else
            {
                self._setProperty(task, SETPROP_DEFAULT);
                
                task.animationFrameId = window.requestAnimationFrame(task.animationFrameFn);
            }                      
        };

        task.animationFrameFn();
    }


    Animation.prototype._setProperty = function(task, mode)
    {
        //options的形式为：let options = {easing:'Cubic.easeOut'};
        let easing;
        if(task.options.easing)
        {
            let easingFn = task.options.easing.split('.');
            easing = easingFn.length === 1 ? Tween[easingFn[0]] : Tween[easingFn[0]][easingFn[1]];
        }
        else
        {
            easing = DEFAULT_EASING;
        }
        switch(mode)
        {
            case SETPROP_DEFAULT: //正常模式，动画中
            {
                for (let i=0; i<task.targets.length; i++)
                {
                    for (let j=0; j<task.newProps[i].length; j++)
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

                                    let current = easing(task.lasttime, begin, change, task.duration);
                                    task.targets[i].style[property.propName] = current + 'px';
                                }
                                else
                                {
                                    let begin = parseFloat(property.beginValue);
                                    let change = parseFloat(property.endValue) - begin;
                                    let current = easing(task.lasttime, begin, change, task.duration);
                                    task.targets[i].style[property.propName] = current;
                                }
                                break;
                            }
                            case 'color':
                            {
                                if (property.beginValue.indexOf('rgb') >= 0 && property.endValue.indexOf('rgb') >= 0)
                                {
                                    let beginArr = property.beginValue.substring(4, property.beginValue.length-1).split(',');
                                    let endArr = property.endValue.substring(4, property.endValue.length-1).split(',');
                                    let changeArr = [];
                                    for (let k=0; k<beginArr.length; k++)
                                    {
                                        let change = parseFloat(endArr[k]) - parseFloat(beginArr[k]);
                                        changeArr.push(change);
                                    }
                                    let current = [];
                                    for (let l=0; l<beginArr.length; l++)
                                    {
                                        let curr = parseInt(easing(task.lasttime, parseFloat(beginArr[l]), parseFloat(changeArr[l]), task.duration));
                                        current.push(curr);
                                    }
                                    let currentValue = 'rgb(' + current[0] + ', ' + current[1] + ', ' + current[2] + ")";
                                    task.targets[i].style[property.propName] = currentValue;
                                }
                                break;
                            }
                            case 'transform':
                            {
                                if (property.beginValue.indexOf('matrix') >= 0)
                                {
                                    let mtxObj = {};
                                    let mtxArr = property.beginValue.substring(7, property.beginValue.length-1).split(',');
                                    mtxObj['scaleX'] = parseFloat(mtxArr[0]);
                                    mtxObj['scaleY'] = parseFloat(mtxArr[3]);
                                    mtxObj['translateX'] = parseFloat(mtxArr[4]);
                                    mtxObj['translateY'] = parseFloat(mtxArr[5]);
                                    
                                    if (property.propName.indexOf('translate') >= 0)
                                    {
                                        let change = parseFloat(property.endValue);
                                        let currentTranslate = easing(task.lasttime, parseFloat(mtxObj[property.propName]), change, task.duration);
                                        mtxObj[property.propName] = currentTranslate;
                                        let currentValue = "matrix(" + mtxObj['scaleX'] + ', 0, 0, ' + mtxObj['scaleY'] + ', ' + mtxObj['translateX'] + ', ' + mtxObj['translateY'] + ')';
                                        task.targets[i].style.transform = currentValue;

                                        console.log(currentValue);
                                    }
                                    if (property.propName.indexOf('matrix') >= 0)
                                    {
                                        let endObj = {};
                                        let endArr = property.endValue.substring(7, property.endValue.length-1).split(',');
                                        endObj['scaleX'] = parseFloat(endArr[0]);
                                        endObj['scaleY'] = parseFloat(endArr[3]);
                                        endObj['translateX'] = parseFloat(endArr[4]);
                                        endObj['translateY'] = parseFloat(endArr[5]);
                                        let changeX = endObj['translateX'] - mtxObj['translateX'];
                                        let changeY = endObj['translateY'] - mtxObj['translateY'];
                                        let changeScaleX = endObj['scaleX'] - mtxObj['scaleX'];
                                        let changeScaleY = endObj['scaleY'] - mtxObj['scaleY'];

                                        let currentX = easing(task.lasttime, parseFloat(mtxObj['translateX']), changeX, task.duration);
                                        let currentY = easing(task.lasttime, parseFloat(mtxObj['translateY']), changeY, task.duration);
                                        let currentScaleX = easing(task.lasttime, parseFloat(mtxObj['scaleX']), changeScaleX, task.duration);
                                        let currentScaleY = easing(task.lasttime, parseFloat(mtxObj['scaleY']), changeScaleY, task.duration);

                                        let currentValue = "matrix(" + currentScaleX + ', 0, 0, ' + currentScaleY + ', ' + currentX + ', ' + currentY + ')';
                                        task.targets[i].style.transform = currentValue;                                        
                                    }
                                    else
                                    {
                                        let change = parseFloat(property.endValue) - parseFloat(property.beginValue);
                                        let currentTranslate = easing(task.lasttime, parseFloat(mtxObj[property.propName]), change, task.duration);
                                        mtxObj[property.propName] = currentTranslate;
                                        let currentValue = "matrix(" + mtxObj['scaleX'] + ', 0, 0, ' + mtxObj['scaleY'] + ', ' + mtxObj['translateX'] + ', ' + mtxObj['translateY'] + ')';
                                        task.targets[i].style.transform = currentValue;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case SETPROP_END:     //动画结束，持续时间达到duration，直接将状态设置为end值
            {
                for (let i=0; i<task.targets.length; i++)
                {
                    for (let j=0; j<task.newProps[i].length; j++)
                    {
                        let property = task.newProps[i][j];
                        switch (property.type)
                        {
                            case 'default':
                            {
                                if (property.beginValue.indexOf('px') >= 0)
                                {
                                    let end = Math.round(parseFloat(property.endValue)*100)/100;
                                    task.targets[i].style[property.propName] = end + 'px';
                                }
                                else
                                {
                                    let end = Math.round(parseFloat(property.endValue)*100)/100;
                                    task.targets[i].style[property.propName] = end;
                                }
                                break;
                            }
                            case 'color':
                            {
                                if (property.beginValue.indexOf('rgb') >= 0 && property.endValue.indexOf('rgb') >= 0)
                                {                                    
                                    let end = property.endValue;
                                    task.targets[i].style[property.propName] = end;
                                }
                                break;
                            }
                            case 'transform':
                            {
                                if (property.beginValue.indexOf('matrix') >= 0)
                                {
                                    let mtxObj = {};
                                    let mtxArr = property.beginValue.substring(7, property.beginValue.length-1).split(',');
                                    mtxObj['scaleX'] = parseFloat(mtxArr[0]);
                                    mtxObj['scaleY'] = parseFloat(mtxArr[3]);
                                    mtxObj['translateX'] = parseFloat(mtxArr[4]);
                                    mtxObj['translateY'] = parseFloat(mtxArr[5]);
                                    
                                    if (property.propName.indexOf('translate') >= 0)
                                    {
                                        let end = Math.round(mtxObj[property.propName] + parseFloat(property.endValue));
                                        mtxObj[property.propName] = end;
                                        let currentValue = "matrix(" + mtxObj['scaleX'] + ', 0, 0, ' + mtxObj['scaleY'] + ', ' + mtxObj['translateX'] + ', ' + mtxObj['translateY'] + ')';
                                        task.targets[i].style.transform = currentValue;
                                    }
                                    if (property.propName.indexOf('matrix') >= 0)
                                    {
                                        let endObj = {};
                                        let endArr = property.endValue.substring(7, property.endValue.length-1).split(',');
                                        endObj['scaleX'] = parseFloat(endArr[0]);
                                        endObj['scaleY'] = parseFloat(endArr[3]);
                                        endObj['translateX'] = parseFloat(endArr[4]);
                                        endObj['translateY'] = parseFloat(endArr[5]);
                                        let changeX = endObj['translateX'] - mtxObj['translateX'];
                                        let changeY = endObj['translateY'] - mtxObj['translateY'];
                                        let changeScaleX = endObj['scaleX'] - mtxObj['scaleX'];
                                        let changeScaleY = endObj['scaleY'] - mtxObj['scaleY'];

                                        let currentValue = "matrix(" + endObj['scaleX'] + ', 0, 0, ' + endObj['scaleY'] + ', ' + endObj['translateX'] + ', ' + endObj['translateY'] + ')';
                                        task.targets[i].style.transform = currentValue;                                        
                                    }
                                    else
                                    {
                                        let end = Math.round(parseFloat(property.endValue));
                                        mtxObj[property.propName] = end;
                                        let currentValue = "matrix(" + mtxObj['scaleX'] + ', 0, 0, ' + mtxObj['scaleY'] + ', ' + mtxObj['translateX'] + ', ' + mtxObj['translateY'] + ')';
                                        task.targets[i].style.transform = currentValue;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                break;
            }
            case SETPROP_BEGIN:
            {
                for (let i=0; i<task.targets.length; i++)
                {
                    for (let j=0; j<task.newProps[i].length; j++)
                    {
                        let property = task.newProps[i][j];
                        task.targets[i].style[property.propName] = property.beginValue;
                    }
                }
                break;
            }
        }
        
    }



    Animation.prototype._next = function() 
    {
        ++this.index;
        this._runTask();
    }

    Animation.prototype._done = function() 
    {
        this._reset();
        return this;
    }

    /**
     * 对动画队列进行复位，还原到用add方法添加完任务但还没有用start执行的状态
     */
    Animation.prototype._reset = function() 
    {
        this.state = STATE_INITIAL;
        this.index = 0;

        for (let i=0; i<this.taskQueue.length; i++) 
        {
            this.taskQueue[i].starttime = null;
            this.taskQueue[i].currtime = null;
            this.taskQueue[i].lasttime = 0;
            this.taskQueue[i].requestAnimationFrameId = null;
            this.taskQueue[i].timeoutId = null;
        }
    }


    
    







    return Animation;
}))