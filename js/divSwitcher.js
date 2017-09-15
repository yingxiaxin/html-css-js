
/*window.onload = function()
{
  let swapsmArray = document.getElementsByClassName("switch");
  for (let i=0; i<swapsmArray.length; i++)
  {
	let item = swapsmArray[i];
	item.ondblclick  = function()
	{
	  let tgt = event.currentTarget;
	  let main = getSwitchMajor();
	  swap(tgt, main);
	};
  }
}    */

this.ready(function(){
  let swapsmArray = document.getElementsByClassName("switch");
  for (let i=0; i<swapsmArray.length; i++)
  {
	let item = swapsmArray[i];
	item.ondblclick  = function()
	{
	  let tgt = event.currentTarget;
	  let main = getSwitchMajor();
	  swap(tgt, main);
	};
  }
});


function ready(fn)
{
	if(document.addEventListener)
	{		//标准浏览器
		document.addEventListener('DOMContentLoaded',function()
		{
			//注销时间，避免重复触发
			document.removeEventListener('DOMContentLoaded',arguments.callee,false);
			fn();		//运行函数
		},false);
	}
	else if(document.attachEvent)
	{		//IE浏览器
		document.attachEvent('onreadystatechange',function()
		{
			if(document.readyState=='complete')
			{
				document.detachEvent('onreadystatechange',arguments.callee);
				fn();		//函数运行
			}
		});
	}
}

function getSwitchMajor()
{
  let swapMainContainer = document.getElementsByClassName('switchMajor')[0];
  let swapMain;
  for (let j=0; j<swapMainContainer.children.length; j++)
  {
	let divitem = swapMainContainer.children[j];
	if (divitem.className.indexOf('switch') >= 0)
	{
	  swapMain = divitem;
	  break;
	}
  }
  return swapMain;
}

function swap(divsm, divlg)
{

  //let divlg = document.getElementsByClassName('swapLG')[0];
  //let divsm = document.getElementsByClassName("swapSM")[0];     
  


  let lgWidth = getComputedStyle(divlg, null).getPropertyValue('width');
  let lgHeight = getComputedStyle(divlg, null).getPropertyValue('height');

  let smWidth = getComputedStyle(divsm, null).getPropertyValue('width');
  let smHeight = getComputedStyle(divsm, null).getPropertyValue('height');

  let lgtop = divlg.getBoundingClientRect().top;
  let lgleft = divlg.getBoundingClientRect().left;

  let smtop = divsm.getBoundingClientRect().top;
  let smleft = divsm.getBoundingClientRect().left;

  let sm2lgTranslateX = lgleft - smleft;
  let sm2lgTranslateY = lgtop - smtop;

  let lg2smTranslateX = smleft- lgleft;
  let lg2smTranslateY = smtop - lgtop;

  smWidth = parseInt(smWidth.replace('px', ''));
  smHeight = parseInt(smHeight.replace('px', ''));
  lgWidth = parseInt(lgWidth.replace('px', ''));
  lgHeight = parseInt(lgHeight.replace('px', ''));

  let lgtranslateValue = 'matrix(1,0,0,1,' + lg2smTranslateX + ',' + lg2smTranslateY + ')';
  let smtranslateValue = 'matrix(1,0,0,1,' + sm2lgTranslateX + ',' + sm2lgTranslateY + ')';

  let ani = new Animation();
  let targets = [divlg, divsm];
  
  let props5 = [[{propertyName:'width', propertyValue:smWidth}, {propertyName:'height', propertyValue:smHeight}, {propertyName:'matrix', propertyValue:lgtranslateValue}, {propertyName:'opacity', propertyValue:0.12}], 
  [{propertyName:'width', propertyValue:lgWidth}, {propertyName:'height', propertyValue:lgHeight}, {propertyName:'matrix', propertyValue:smtranslateValue}, {propertyName:'opacity', propertyValue:0.12}]];
  
  let props6 = [[{propertyName:'opacity', propertyValue:1}], 
  [{propertyName:'opacity', propertyValue:1}]];

  let gaplg = document.createElement('div');
  gaplg.style.height = '0px';
  let gapsm = document.createElement('div');
  gapsm.style.height = '0px';

  let lgParent = divlg.parentNode;
  let smParent = divsm.parentNode;

  lgParent.insertBefore(gaplg, divlg);
  smParent.insertBefore(gapsm, divsm);


  let options = {easing:'Back.easeOut',
				after:function()
				{
				  doit();
				}
			  };
  ani.add(targets, props5, 1000, options).add(targets, props6, 1000).start();


  function doit()
  {
	lgParent.insertBefore(divsm, gaplg);
	smParent.insertBefore(divlg, gapsm);

	lgParent.removeChild(gaplg);
	smParent.removeChild(gapsm);

	divsm.style.transform = 'none';
	divlg.style.transform = 'none';		
	
	let smchild = divsm.getElementsByTagName('div');
	let lgchild = divlg.getElementsByTagName('div');
	
	Array.prototype.forEach.call(smchild, function(div)
	{
		if (div.attributes._echarts_instance_ !== undefined)
		{
			let eId = div.attributes._echarts_instance_.value;
			let eInstances = echarts.getInstanceById(eId);
			eInstances.resize();
		}
	});
	
	Array.prototype.forEach.call(lgchild, function(div)
	{
		if (div.attributes._echarts_instance_ !== undefined)
		{
			let eId = div.attributes._echarts_instance_.value;
			let eInstances = echarts.getInstanceById(eId);
			eInstances.resize();
		}
	});
  };
}
