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
			if($(this)[0].id)
			{
				if( typeof clickMenu.parent().siblings('a')[0] !== "undefined")
				{
					//var layout = "layout/typePhp/set_detail.php?"+$.param({setId: $(this)[0].id});
                    //var layout = "layout/typeHtml/set_detail.html?"+$.param({setId: $(this)[0].id});
                    var layout = "layout/typeEjs/set_detail.ejs?"+$.param({setId: $(this)[0].id});
				}
				else
				{
					var layout = "layout/typeEjs/"+$(this)[0].id+".ejs";
				}
				$("#page-layout").load(layout);
			}
			
		});
	});

	// default ui
	//$("#page-layout").load('layout/dashboard.php');
    //$("#page-layout").load('layout/typePhp/device_register.php');
    //$("#page-layout").load('layout/typeHtml/device_register.html');
    $("#page-layout").load('layout/typeEjs/device_register.ejs');
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