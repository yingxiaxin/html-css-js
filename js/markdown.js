function parseInput(str)
{
    let rows = autoSplit(str);

    addRowNumber(rows.length);

    let res = '';

    for(let i=0; i<rows.length; i++)
    {
        let t = rows[i].match(/^#\s/)       //h1
            || rows[i].match(/^##\s/)       //h2
            || rows[i].match(/^###\s/)      //h3
            || rows[i].match(/^####\s/)     //h4
            || rows[i].match(/^#####\s/)    //h5
            || rows[i].match(/^######\s/)   //h6
            || rows[i].match(/^[\*-]\s/)    //无序列表
            || rows[i].match(/^\d\.\s/)     //有序列表
            || rows[i].match(/^>\s/)        //引用
            || rows[i].match(/^\*\*\*+/)    //分割线
            || rows[i].match(/^```/)        //代码
            || rows[i].match(/^!\[.+]\(.*\)/);  //匹配插入图片，形式如：![此处是图片alt属性](此处是图片路径)

        if(t != null)
        {
            switch(t[0])
            {
                case '# ':
                {
                    res = res + header(rows[i].substring(2), 1) //#和空格不能加入到header内容里，故有substring操作
                    break;
                }
                case '## ':
                {
                    res = res + header(rows[i].substring(3), 2) //#和空格不能加入到header内容里，故有substring操作
                    break;
                }
                case '### ':
                {
                    res = res + header(rows[i].substring(4), 3) //#和空格不能加入到header内容里，故有substring操作
                    break;
                }
                case '#### ':
                {
                    res = res + header(rows[i].substring(5), 4) //#和空格不能加入到header内容里，故有substring操作
                    break;
                }
                case '##### ':
                {
                    res = res + header(rows[i].substring(6), 5) //#和空格不能加入到header内容里，故有substring操作
                    break;
                }
                case '###### ':
                {
                    res = res + header(rows[i].substring(7), 6) //#和空格不能加入到header内容里，故有substring操作
                    break;
                }
                case '* ':
                {
                    let uls = [];
                    while(i<rows.length && rows[i].match(/^\*\s/))  //判断下一行是不是也是无序列表，如果是则加入同一个ul内
                    {
                        uls.push(format(rows[i].substring(rows[i].match(/^\*\s/)[0].length),'normal'));
                        i++;
                    }
                    res = res + ul(uls);
                    i = i - 1;  //上面while循环时循环不满足跳出循环，但上次循环时已执行了i++，故要减去1，否则下一行将跳过不显示了
                    break;
                }
                case '> ':
                {
                    let blqs = [];
                    while(i<rows.length && rows[i].match(/^>\s/))   //判断下一行是不是也是引用，如果是则加入同一个ul内
                    {
                        blqs.push(format(rows[i].substring(rows[i].match(/^>\s/)[0].length), 'normal'));
                        i++;
                    }
                    res = res + blq(blqs);
                    i = i - 1;
                    break;
                }
                case '```':     //判断是不是<pre>标签内容，键盘左上角的三个`符号表示<pre>预处理标签
                {
                    i = i + 1;
                    let mc = '\n';
                    while(i<rows.length && rows[i].match(/^```/)==null)
                    {
                        mc = mc + rows[i] + '\n';
                        i++;                        
                    }
                    res = res + multiCode(format(mc, "simple"));
                    break;
                }
                case(rows[i].match(/^!\[.+]\(.*\)/) && rows[i].match(/^!\[.+]\(.*\)/)[0]):  ////匹配到图片的正则
                {
                    var alt = rows[i].match(/^!\[.+]/);
                    var src = rows[i].match(/\(.*\)/);
                    res = res + img(alt[0].substring(2, alt[0].length-1), src[0].substring(1, src[0].length-1));
                    break;
                }
                case(rows[i].match(/^\d\.\s/) && rows[i].match(/^\d\.\s/)[0]):      //匹配有序列表
                {
                    let ols = [];
                    while(i<rows.length && rows[i].match(/^\d\.\s/))
                    {
                        ols.push(format(rows[i].substring(rows[i].match(/^\d\.\s/)[0].length), 'normal'));
                        i++;
                    }
                    i = i - 1;
                    res = res + ol(ols);
                    break;
                }
                case(rows[i].match(/^\*\*\*+/) && rows[i].match(/^\*\*\*+/)[0]):
                {
                    res = res + line();
                    break;
                }
            }
        }
        else if(rows[i].length > 0)
        {
            res += rows[i];
        }
        res = res + "</br>";    //换行
    }


    return res;
}

function addRowNumber(num)
{
    let linecounter = document.getElementById("line-counter");
    removeAllChild(linecounter);
    for(let i=1; i<=num; i++)
    {
        let rowNum = document.createElement("div");
        rowNum.innerText = i;
        linecounter.appendChild(rowNum);
    }
}

function removeAllChild(ele)
{
    while(ele.hasChildNodes())
    {
        ele.removeChild(ele.firstChild);
    }
}

function autoSplit(str)
{
    return str.split("\n");
}

function replaceAll(originalStr, targetStr, newStr)
{
    var reg = new RegExp(targetStr, 'g');
    return originalStr.replace(reg, newStr);
}

function format(str, formatMode)
{
    switch(formatMode)
    {
        case 'normal':
        {
            str = replaceAll(str, '<', '&lt;');
            str = replaceAll(str, '>', '&gt;');
            str = replaceAll(str, ' ', '&nbsp;');
            //str = ;
            break;
        }
        case 'simple':
        {
            str = replaceAll(str, '<', '&lt;');
            str = replaceAll(str, '>', '&gt;');
            break;
        }
        default:
        {
            str = replaceAll(str, '<', '&lt;');
            str = replaceAll(str, '>', '&gt;');
            str = replaceAll(str, ' ', '&nbsp;');
            break;
        }
    }
    return str;
}

function header(str, hnum)
{
    if(hnum < 1)
    {
        hnum = 1;
    }
    if(hnum > 6)
    {
        hnum = 6;
    }
    return '<h' + hnum + '>' + str + '</h' + hnum + '>';
}

function ul(uls)
{
    let res = '<ul>\n';
    for(let item of uls)
    {
        let liitem = '<li>' + item + '</li>\n';
        res = res + liitem;
    }
    res = res + '</ul>';
    return res;
}

function ol(ols)
{
    let res = '<ol>\n';
    for(let item of ols)
    {
        let olitem = '<li>' + item + '</li>\n';
        res = res + olitem;
    }
    res = res + '</ol>';
    return res;
}

function blq(blqs)
{
    let res = '<blockquote>\n';
    for(let item of blqs)
    {
        let blqitem = item + '</br>';
        res = res + blqitem;
    }
    res = res + '</blockquote>';
    return res;
}

function multiCode(mc)
{
    let res = '<pre>' + mc + '</pre>\n';
    return res;
}

function img(alt, src)
{
    let res = '<img alt="' + alt + '" src="' + src + '"/>\n';
    return res;
}

function line()
{
    let res = '<hr/>\n';
    return res;
}