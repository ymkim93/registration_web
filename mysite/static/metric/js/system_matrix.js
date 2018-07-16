var cpuChartObj, loadChartObj, memoryChartObj;
var timer=30; //default 3분

$(document).ready(function(){
	//Chart Slide
	$("#rangeSlide").ionRangeSlider({
		type: 'single',
		grid: true,
		from: 1,
		values: [
			"5M","30M", "60M",
			"60M", "24H",
			"7D"
		]
	});

	//기간 설정 버튼 클릭
	$(".periodBtn").click(function(){
		$(".periodForm").toggle();
	});

	//기간설정 submit
	$("#timePickSubmit").click(function(){
		//기간설정 내용 유효성체크
		//기간설정 submit
		//submit후 기간 설정 레이아웃처리
		$(".timeRangeLayer").show();
		$(".timeSlideLayer").hide();
		$(".periodForm").hide();
	});

	$(".timeRangeLayer > a > i.fa-times").click(function(){
		//slide값에 따른 그래프 변경
		$(".timeRangeLayer").hide();
		$(".timeSlideLayer").show();
		$(".periodForm").hide();
	});
	
	/* Chart */
	var chartWidth = $('#cpuChart').width();

	//cpu chart dummy
	var chartConfig={chartId:'cpuChart'
		,width:chartWidth
		,height:300
		,margin:{left:50,bottom:50}
		,y:{tickformat:'%',grid:true,label:'CPU(%)'}
		,x:{tickformat:'%H:%M:%S',grid:true,label:'Time '}
		,colors: 'glueColor1'
		,timer:timer
		,showValues:true
		,dataSrc:'../plugins/gluesysChart/lineChartData.php?timer='+timer
	};
	cpuChartObj = new areaChart(chartConfig);

	//load chart dummy
	var lChartConfig={chartId:'loadChart'
		,width:chartWidth
		,height:300
		,margin:{left:50,bottom:50}
		,y:{grid:true}
		,x:{tickformat:'%H:%M:%S',grid:true,label:'Time '}
		,colors: 'category10'
		,timer:timer
		,showValues:true
	};
	loadChartObj = new lineChart(lChartConfig);

	//memory chart dummy
	var mChartConfig={chartId:'memoryChart'
		,width:chartWidth
		,height:300
		,margin:{left:50,bottom:50}
		,y:{tickformat:'%',grid:true}
		,x:{tickformat:'%H:%M:%S',grid:true,label:'Time '}
		,colors: 'glueColor2'
		,timer:timer
		,showValues:true
	};
	memoryChartObj = new areaChart(mChartConfig);
	
	loadComputeChartData();

	//Compute 차트 데이터 로드
	function loadComputeChartData()
	{
		//CPU Data
		$.ajax({
			url:'./data/system_matrix_cpu.php?timer='+timer,
			dataType:'json',
			success:function(data){
				cpuChartObj.drawChart(data);

				//CPU Data 주기적 리로드
				setInterval(function(){
					//if($('#computeTab').css("display")=="block")
					
					$.ajax({
						url:'./data/system_matrix_cpu.php?update',
						dataType:'json',
						success:function(data){
							cpuChartObj.reDrawChart(data);
						}
					});
				},timer*1000);
			}
		});

		//Load Data
		$.ajax({
			url:'./data/system_matrix_load.php?timer='+timer,
			dataType:'json',
			success:function(data){
				loadChartObj.drawChart(data);

				//Load Data 주기적 리로드
				setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_load.php?update',
						dataType:'json',
						success:function(data){
							loadChartObj.reDrawChart(data);
						}
					});
				},timer*1000);
			}
		});

		//Memory Data
		$.ajax({
			url:'./data/system_matrix_memory.php?timer='+timer,
			dataType:'json',
			success:function(data){
				memoryChartObj.drawChart(data);

				//Load Data 주기적 리로드
				setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_memory.php?update',
						dataType:'json',
						success:function(data){
							memoryChartObj.reDrawChart(data);
						}
					});
				},timer*1000);
			}
		});
	}

	$( "#cpuChart" ).mouseover(function() {
		loadChartObj.mouseover();
		memoryChartObj.mouseover();
	});
	$( "#cpuChart" ).mouseout(function() {
		loadChartObj.mouseout();
		memoryChartObj.mouseout();
	});

	cpuChartObj.multiMousemove=function(mouse)
	{
		cpuChartObj.mousemove(mouse);
		loadChartObj.mousemove(mouse);
		memoryChartObj.mousemove(mouse);
	}

	$( "#cpuChart > svg > g.focus > rect.overlay" ).mousemove(function() {

		//winMousePos=d3.mouse(document.body)[0];
								winMousePos=d3.mouse(document.getElementById(chartConfig.chartId));
								var mouse=d3.mouse(this);
console.log(mouse);
								//self.mouse=mouse;
								//self.mousemove(mouse)});
		//loadChartObj.mousemove(mouse);
	//	memoryChartObj.mousemove(mouse);
	});


	/*cpuChartObj.mouseover=function()
	{
		//console.log(this);
		loadChartObj.mouseover();
		memoryChartObj.mouseover();
	}
	cpuChartObj.mousemove=function(mouse) {
//		this.mousemove(mouse);
loadChartObj.mousemove(mouse);
		memoryChartObj.mousemove(mouse);
	}*/


	
	//Compute 차트데이터 리로드
	function reloadComputeChartData(dataUrl,chartObj)
	{
		$.ajax({
			url:dataUrl,
			dataType:'json',
			success:function(data){
				chartObj.reDrawChart(data);
			}
		});
	}

});
$(window).resize(function(){
	//차트 폭 갱신
	var chartWidth = $('#loadChart').width();
	var newConfig={width:chartWidth};
	cpuChartObj.resize(newConfig);
	loadChartObj.resize(newConfig);
	memoryChartObj.resize(newConfig);
});