/*
 * @author:zenggo
 * @兼容：IE,chrome,firefox;!(opera)
 */

//兼容事件处理
var eventUtil={
	getEvent: function(event){
		return event?event:window.event;
	},
	getTarget: function(event){
		return event.target||event.srcElement;
	},
	preventDefault: function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	},
	stopPropagation: function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	},
	addHandler: function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},
	removeHandler: function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	}
};
//原生js添加删除类
var classUtil={
	hasClass:function(obj, cls) {  
		//h5 dom
		if(obj.classList.contain){
			return obj.classList.contain(cls);
			//ie
		}else{
			return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));	
		}  
	},
	addClass:function(obj, cls) {  
		if(obj.classList){
			obj.classList.add(cls);
		}else{
			if (!classUtil.hasClass(obj, cls)) obj.className += " " + cls;	
		}  
	},
	removeClass:function(obj, cls) {
		if(obj.classList){
			obj.classList.remove(cls);
		}else{
			if (classUtil.hasClass(obj, cls)) {
	        	obj.className = obj.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)'), ' ');  
	    	}	
		}
    },
    toggleClass:function(obj,cls) {
    	if(obj.classList){
    		obj.classList.toggle(cls);
    	}else{
    		if(classUtil.hasClass(obj,cls)){  
	        	classUtil.removeClass(obj, cls);  
	    	}else{  
	        	classUtil.addClass(obj, cls);  
	    	}	
    	}  
	}
};
//字符转译
var charUtil={
	transSpace:function(string){
		var newstr="";
		for(var i=0;i<string.length;i++){
			if(string.charAt(i)==" "){
				newstr+="&nbsp";
			}
			newstr+=string.charAt(i);
		}
		return newstr;
	}
};
//上传图片预览
function imgPreview(file,img,imgDiv){
	if(file.value!=""){
		if(window.URL){
			//firefox,chorme
			window.URL.revokeObjectURL(img.src);
			img.src=window.URL.createObjectURL(file.files[0]);
			//标识这次设置了img
			return 1;
		}else if(window.webkitURL){
			//chrome,safari
			window.webkitURL.revokeObjectURL(img.src);
			img.src=window.webkitURL.createObjectURL(file.files[0]);
			//标识这次设置了img
			return 1;
		}else{
			//IE下 使用滤镜
			file.style.display="inline-block";
			file.select();
			file.blur();
			var imgSrc=document.selection.createRange().text;
			document.selection.empty();
			file.style.display="none";
			//ie 图片异常捕捉，防止伪造图片
			try{
				imgDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
				//标识这次设置了imgdiv
				return 2;
			}catch(e){
				clearFile(file);
				alert("请勿上传伪造图片格式的文件！");
				imgDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = "img/notice.gif";
				return 0;
			}
		}
	}else{
		if(imgDiv.filters){
			imgDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = "img/notice.gif";
		}else{
			img.src="img/notice.gif";
		}
		//标识这次没有上传图像
		return 0;	
	}
	//return true;
}
//正面预览
function showFrontLogo(type,img,div,showWrap){
	//先清除之前的
	if(showWrap.firstChild){
		showWrap.removeChild(showWrap.firstChild);
	}
	if(type){
		var logo;
		if(type==1){
			logo=img.cloneNode(false);
			logo.width=showWrap.offsetWidth;
			logo.height=showWrap.offsetHeight;
			showWrap.appendChild(logo);
		}else{
			logo=document.createElement("div");
			logo.style.width=showWrap.offsetWidth+"px";
			logo.style.height=showWrap.offsetHeight+"px";
			//ie元素一定要先已在文档中才能用滤镜 否则出错
			showWrap.appendChild(logo);	
			logo.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			logo.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src=div.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src;
		}
		logo.id="show-logo-img";
	}
}	
//背面预览
	
//检查上传图片
function checkImg(file){
	var islegal=false;
	var fileName=file.value.toLowerCase();
	if(!fileName.match(/.jpeg|.jpg|.gif|.png|.bmp/i)){
		islegal=false;
	}else{
		//gecko.webkit检测文件是否为图片
		if(file.files&&!file.files[0].type.match(/image/i)){
			islegal=false;
		}else{
			islegal=true;
		}
	}
	if(!islegal){
		clearFile(file);
	}
	return islegal;
}
//清除input file
function clearFile(file){
	if(file.value){
		try{
			file.value="";
		}catch(e){}
		//IE 无法清空value的处理
		if(file.value){
			var tf=document.createElement("form");
			var sf=file.previousSibling,pf=file.parentNode;
			tf.appendChild(file);
			tf.reset();
			pf.insertBefore(file,sf);
		}
	}
}
//新添行
function addRow(table){
	var lastRow=table.rows[table.rows.length-1];
	var newtr=lastRow.cloneNode(true);
	for(var i=1;i<9;i++){
		switch (i){
			case 1:
				newtr.cells[i].innerHTML=parseInt(lastRow.cells[i].innerHTML)+1;
				break;
			case 2:
			case 5:
			case 6:
			case 8:
				newtr.cells[i].firstChild.value="";
				break;
			case 3:
			case 7:
				newtr.cells[i].firstChild.selectedIndex=lastRow.cells[i].firstChild.selectedIndex;
				break;
			default:
				break;
		}
	}
	table.tBodies[0].appendChild(newtr);
}
//删除行后更新编号
function updateRowId(table){
	for(var i=1;i<table.rows.length;i++){
		table.rows[i].cells[1].innerHTML=i;
	}
}
//显示/隐藏删除行按钮
function toggleShowDelBut(event,table){
	event=eventUtil.getEvent(event);
	eventUtil.stopPropagation(event);
	var target=eventUtil.getTarget(event);
	if(target.nodeName=="TABLE"||target.nodeName=="TBODY"){
		return;
	}
	// if(target.nodeName=="TR"&&target!=table.rows[0]){
		// if(event.type=="mouseover"){
			// target.cells[0].firstChild.style.visibility=target.cells[target.cells.length-1].firstChild.style.visibility="visible";	
		// }else{
			// target.cells[0].firstChild.style.visibility=target.cells[target.cells.length-1].firstChild.style.visibility="hidden";
		// }
	// }
	while(target.nodeName!="TR"){
		target=target.parentNode;
	}
	if(target!=table.rows[0]){
		if(event.type=="mouseover"){
			target.cells[0].firstChild.style.visibility=target.cells[target.cells.length-1].firstChild.style.visibility="visible";	
		}else{
			target.cells[0].firstChild.style.visibility=target.cells[target.cells.length-1].firstChild.style.visibility="hidden";
		}
	}
}

window.onload=function(){
	var _MAXADSIZE=10,_ADSIZEPLUS=3,_MINADSIZE=4,_NORMALADSIZE=7;
	var _MAXYINZISIZE=9,_YINZISIZEPLUS=3,_MINYINZISIZE=4,_NORMALYINZISIZE=7;
	var _MAXYINHAOSIZE=15,_YINHAOSIZEPLUS=10,_MINYINHAOSIZE=8,_NORMALYINHAOSIZE=12;
	
	var form=document.getElementsByTagName("form")[0];
	var unifiedDiv=document.getElementById("unified-div");
	
	var v_logoFile=form.elements["logo"];
	var logoPreviewImg=document.getElementById("logo-preview-img");
	var logoPreviewDiv=document.getElementById("logo-preview");
	var logoUploadButton=document.getElementById("upload-file");
	
	var showFrontDiv=document.getElementById("show-front");
	var showLogo=document.getElementById("show-logo");
	var showAd=document.getElementById("show-ad");
	var showAdSpan=showAd.getElementsByTagName("span")[0];
	var v_ad=document.getElementById("ad-content");
	var v_ad_font=document.getElementById("ad-font");
	var v_ad_color=document.getElementById("ad-color");
	var v_ad_size=document.getElementById("ad-size");
	
	var showBackDiv=document.getElementById("show-back");
	var showYinzi=document.getElementById("show-yinzi");
	var showYinziSpan=showYinzi.getElementsByTagName("span")[0];
	var v_yinzi=document.getElementById("yinzi-show-content");
	var v_yinzi_font=document.getElementById("yinzi-font");
	var v_yinzi_color=document.getElementById("yinzi-color");
	var v_yinzi_size=document.getElementById("yinzi-size");
	var showYinhao=document.getElementById("show-yinhao");
	var showYinhaoSpan=showYinhao.getElementsByTagName("span")[0];
	var v_yinhao=document.getElementById("yinhao-show-content");
	var v_yinhao_font=document.getElementById("yinhao-font");
	var v_yinhao_color=document.getElementById("yinhao-color");
	var v_yinhao_size=document.getElementById("yinhao-size");
	
	var cusTable=document.getElementById("custom-table");
	var addButton=document.getElementById("add-row");
	
	if(logoPreviewDiv.filters){
		//IE<=9 启用滤镜
		logoPreviewDiv.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
		logoPreviewDiv.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = "img/notice.gif";
		logoPreviewImg.style.display="none";
	}
	
	//上传图片
	eventUtil.addHandler(logoUploadButton,"click",function(event){
		event=eventUtil.getEvent(event);
		eventUtil.preventDefault(event);
		eventUtil.stopPropagation(event);
		//alert(v_logoFile);
		v_logoFile.click();
	});
	//检查图片并预览
	eventUtil.addHandler(v_logoFile,"change",function(){
		var checkType=checkImg(this);
		//0-failed,1-ff,ch,2-ie
		if(checkType){
			classUtil.removeClass(logoUploadButton,"wrong-border");
		}else{
			classUtil.addClass(logoUploadButton,"wrong-border");
		}
		checkType=imgPreview(this,logoPreviewImg,logoPreviewDiv);
		showFrontLogo(checkType,logoPreviewImg,logoPreviewDiv,showLogo);
	});
	//预览胸前印字
	v_ad.value="请输入胸前印字";
	showAdSpan.innerHTML=charUtil.transSpace(v_ad.value);
	eventUtil.addHandler(v_ad,"keyup",function(event){
		event=eventUtil.getEvent(event);
		eventUtil.stopPropagation(event);
		if(v_ad.value){
			showAdSpan.innerHTML=charUtil.transSpace(v_ad.value);	
		}else{
			showAdSpan.innerHTML="";
		}
	});
		//预览字体
	showAdSpan.style.fontFamily=v_ad_font.options[v_ad_font.selectedIndex].title;
	eventUtil.addHandler(v_ad_font,"change",function(){
		showAdSpan.style.fontFamily=v_ad_font.options[v_ad_font.selectedIndex].title;
	});
		//预览字体颜色
	showAdSpan.style.color=v_ad_color.options[v_ad_color.selectedIndex].title;
	eventUtil.addHandler(v_ad_color,"change",function(){
		showAdSpan.style.color=v_ad_color.options[v_ad_color.selectedIndex].title;
	});
	//预览背后印字
	showYinziSpan.innerHTML=charUtil.transSpace(v_yinzi.value);
	eventUtil.addHandler(v_yinzi,"keyup",function(event){
		event=eventUtil.getEvent(event);
		eventUtil.stopPropagation(event);
		if(v_yinzi.value){
			showYinziSpan.innerHTML=charUtil.transSpace(v_yinzi.value);	
		}else{
			showYinziSpan.innerHTML="";
		}
	});
		//预览字体
	showYinziSpan.style.fontFamily=v_yinzi_font.options[v_yinzi_font.selectedIndex].title;
	eventUtil.addHandler(v_yinzi_font,"change",function(){
		showYinziSpan.style.fontFamily=v_yinzi_font.options[v_yinzi_font.selectedIndex].title;
	});
		//预览字体颜色
	showYinziSpan.style.color=v_yinzi_color.options[v_yinzi_color.selectedIndex].title;
	eventUtil.addHandler(v_yinzi_color,"change",function(){
		showYinziSpan.style.color=v_yinzi_color.options[v_yinzi_color.selectedIndex].title;
	});
	//预览背后印号
	showYinhaoSpan.innerHTML=charUtil.transSpace(v_yinhao.value);
	eventUtil.addHandler(v_yinhao,"keyup",function(event){
		event=eventUtil.getEvent(event);
		eventUtil.stopPropagation(event);
		if(v_yinhao.value){
			showYinhaoSpan.innerHTML=charUtil.transSpace(v_yinhao.value);	
		}else{
			showYinhaoSpan.innerHTML="";
		}
	});
		//预览字体
	showYinhaoSpan.style.fontFamily=v_yinhao_font.options[v_yinhao_font.selectedIndex].title;
	eventUtil.addHandler(v_yinhao_font,"change",function(){
		showYinhaoSpan.style.fontFamily=v_yinhao_font.options[v_yinhao_font.selectedIndex].title;
	});
		//预览字体颜色
	showYinhaoSpan.style.color=v_yinhao_color.options[v_yinhao_color.selectedIndex].title;
	eventUtil.addHandler(v_yinhao_color,"change",function(){
		showYinhaoSpan.style.color=v_yinhao_color.options[v_yinhao_color.selectedIndex].title;
	});
	//修改字体大小
	v_ad_size.value=_NORMALADSIZE;
	showAdSpan.style.fontSize=_NORMALADSIZE*_ADSIZEPLUS+"px";
	v_yinzi_size.value=_NORMALYINZISIZE;
	showYinziSpan.style.fontSize=_NORMALYINZISIZE*_YINZISIZEPLUS+"px";
	v_yinhao_size.value=_NORMALYINHAOSIZE;
	showYinhaoSpan.style.fontSize=_NORMALYINHAOSIZE*_YINHAOSIZEPLUS+"px";
	eventUtil.addHandler(unifiedDiv,"click",function(event){
		event=eventUtil.getEvent(event);
		target=eventUtil.getTarget(event);
		eventUtil.stopPropagation(event);
		if(classUtil.hasClass(target,"adsub-button")){
			eventUtil.preventDefault(event);
			var input=target.parentNode.firstChild;
			var value=parseInt(input.value);
			var show,maxsize,minsize,plus;
			if(input.id=="ad-size"){
				show=showAdSpan;
				maxsize=_MAXADSIZE;
				minsize=_MINADSIZE;
				plus=_ADSIZEPLUS;
			}else if(input.id=="yinzi-size"){
				show=showYinziSpan;
				maxsize=_MAXYINZISIZE;
				minsize=_MINYINZISIZE;
				plus=_YINZISIZEPLUS;
			}else{
				show=showYinhaoSpan;
				maxsize=_MAXYINHAOSIZE;
				minsize=_MINYINHAOSIZE;
				plus=_YINHAOSIZEPLUS;
			}
			if(target.title=="add"){
				if(value<maxsize){
					input.value=++value;	
				}
			}else{
				if(value>minsize){
					input.value=--value;	
				}
			}
			show.style.fontSize=value*plus+"px";
		}
	});
	//添加订单记录行
	eventUtil.addHandler(addButton,"click",function(event){
		event=eventUtil.getEvent(event);
		eventUtil.preventDefault(event);
		eventUtil.stopPropagation(event);
		addRow(cusTable);
	});
	//初始5行
	(function (){
		for(var i=0;i<4;i++){
			addRow(cusTable);
		}	
	})();
	//事件委托-显示/隐藏删除行按钮
	// eventUtil.addHandler(cusTable,"mouseover",function(event){
		// toggleShowDelBut(event,cusTable);
	// });
	// eventUtil.addHandler(cusTable,"mouseout",function(event){
		// toggleShowDelBut(event,cusTable);
	// });
	//删除行
	eventUtil.addHandler(cusTable,"click",function(event){
		event=eventUtil.getEvent(event);
		eventUtil.stopPropagation(event);
		var target=eventUtil.getTarget(event);
		if(target.nodeName=="BUTTON"){
			eventUtil.preventDefault(event);
			if(cusTable.rows.length>6){
				cusTable.tBodies[0].removeChild(target.parentNode.parentNode);
				updateRowId(cusTable);	
			}
		}
	});
};