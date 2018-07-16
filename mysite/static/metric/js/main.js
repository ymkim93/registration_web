$(document).ready(function(){

	// load left menu
	$.getJSON( "data/menu.json", function( data ) {
		var menuHtml = loadMenu(data);
		$("#side-menu").append(menuHtml);

		// MetsiMenu
	    $('#side-menu').metisMenu();
		$('#side-menu li a').click(function(){
			var clickMenu = $(this).parent();

			//clear active menu
			if(clickMenu.parent().parent()[0].tagName !='LI')
			{
				$( ".active" ).removeClass('active');
			}
			else
			{
				//submenu active
				clickMenu.siblings('li').removeClass('active');
			}

			clickMenu.attr('class','active');
			var pageId = $(this)[0].id;

			if(pageId)
			{
				//var layout = "layout/"+pageId+".php";
                var layout = "layout/"+pageId+".ejs";
				$("#page-layout").load(layout);
			}



			/*
            else if(pageId)
            {
                var layout = "layout/"+pageId+".php";
                //var layout = "layout/"+pageId+".ejs";
                $("#page-layout").load(layout);
            }

            나중에 확장자 추출할 예정
function getExtensionOfFilename(filename) {

var _fileLen = filename.length;
var _lastDot = filename.lastIndexOf('.');
var _fileExt = filename.substring(_lastDot, _fileLen).toLowerCase();
	return _fileExt;
}
			*/
			//page script load
			var scriptUrl = "js/"+pageId+".js";
			//$.getScript(scriptUrl);
		});
	});

	// default ui
	//$("#page-layout").load('layout/dashboard.php');
	//$.getScript('js/dashboard.js');
    $("#page-layout").load('layout/dashboardOnP.ejs');
    $.getScript('js/dashboard.js');
	//$("#page-layout").load('layout/system_matrix.php');
});

function loadMenu(menu)
{
	var html ='';
	$.each(menu,function(key){
		
		if (html ==='')
		{
			html += '<li class="active">';
		}
		else
		{
			html += '<li>';
		}

		var menuIcon ='';
		if(menu[key].icon) menuIcon = menu[key].icon;
		if(menu[key].id)
		{
			html += '<a href="#" id="'+menu[key].id+'">';
		}
		else
		{
			html += '<a href="#">';
		}
		html += '<i class="fa '+menuIcon+'"></i> <span class="nav-label">'+menu[key].text+'</span></a>';
		if(menu[key].children)
		{
			html += '<ul class="nav nav-second-level">';
			html += loadSubMenu(menu[key].children);
			html += '</ul>';
		}
        html +='</li>';
	});

	return html;
}

function loadSubMenu(menu)
{
	var html ='';
	$.each(menu,function(key){
		
		html += '<li><a href="#" id="'+menu[key].id+'">'+menu[key].text+'</a></li>';
	});

	return html;
}