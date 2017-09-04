'use strict';


/**
 * 预加载图片函数
 * @param {*} images 加载图片的数组或者对象
 * @param {*} callback 全部图片加载完毕后调用的回调函数
 * @param {*} timeout 加载超时时长
 */
function loadImage(images, callback, timeout)
{
    //加载完成图片计数器
    var count = 0;

    //全部图片加载成功的标志位
    var success = true;

    //超时timer的id
    var timeoutId = 0;

    //是否加载超时标志位
    var isTimeout = false;

    //遍历数组或对象
    for(var key in images)
    {
        //过滤prototype上的属性
        if(!images.hasOwnProperty(key))
        {
            continue;
        }

        //获得每个图片元素，期望格式是个object：{src:xxx}
        var item = images[key];

        if(typeof item === 'string')
        {
            item = iamges[key] = 
            {
                src:item
            };
        }

        //如果格式不满足期望，则丢弃此条数据进行下一次遍历
        if(!item || !item.src)
        {
            continue;
        }

        //计数+1
        count++;

        //设置图片元素的id
        item.id = '_img_' + key + getId();

        //设置图片元素的img，它是一个image对象
        item.img = window[item.id] = new Image();

        doLoad(item);
    }

    //遍历完成，如果计数为0，则直接调用callback
    if(!count)
    {
        callback(success);
    }
    else if(timeout)
    {
        timeoutId = setTimeout(onTimeout, timeout);
    }


    /**
     * 真正进行图片加载的函数
     * @param {*} item 图片元素对象
     */
    function doLoad(item)
    {
        item.status = "loading";

        var img = item.img;

        //定义图片加载成功函数
        img.onload = function()
        {
            success = success & true;
            item.status = 'loaded';
            done();
        }

        //定义图片加载失败函数
        img.onerror = function()
        {
            success = false;
            item.status = 'error';
            done();
        }

        //发起了http(s)请求
        img.src = item.src;

        /**
         * 每张图片加载完成的回调
         */
        function done()
        {
            img.onload = img.onerror = null;

            try
            {
                delete window[item.id];
            }
            catch(e)
            {

            }

            //count减到0的时候，非0为true.每张图片加载完成，计数器减一，当所有图片加载完成，且没有超时的情况，清除计时器，且执行回调函数
            if(!--count && isTimeout)
            {
                clearTimeout(timeoutId);
                callback(success);
            }
        }
    }


    function onTimeout()
    {
        isTimeout = true;
        callback(false);
    }


}

var _id = 0;
function getId()
{
    return ++_id;
}

module.exports = laodImage;