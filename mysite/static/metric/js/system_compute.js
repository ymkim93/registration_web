/* system matrix compute script */
/*
차트 갱신 주기
5분 : 5초마다 갱신
30분: 10초마다 갱신
60분: 5분마다 갱신
24시간: 30분마다 갱신
7일:1시간 마다 갱신
그래프 갱신 주기와 그래프 x축 ticksize와 tickformat은 변경 되어야 한다.!!
*/

var sliderObj, cpuChartObj, loadChartObj, memoryChartObj;
$(document).ready(function(){
	/*
		기본값은 30분, 5초 갱신이다
	*/
	//var timer = 5; //초단위
	var timer =600;
	var period = 30; //30분
	var endTime=new Date();
	var startTime = new Date(Date.parse(endTime) - period *1000 * 60); 
	var startTimeStamp = startTime.getTime()/1000;
	var chartWidth = $('#timeline').width();

	//cpu chart dummy
	var chartConfig={chartId:'cpuChart'
		,width:chartWidth
		,height:300
		,margin:{left:50,bottom:50}
		,y:{tickformat:'%',grid:true,label:'CPU(%)'}
		,x:{tickformat:'%H:%M:%S',grid:true,label:'Time '}
		,tooltip:{format:'%Y-%m-%d %H:%M:%S',fixed:true}
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
		,tooltip:{format:'%Y-%m-%d %H:%M:%S',fixed:true}
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
		,tooltip:{format:'%Y-%m-%d %H:%M:%S',fixed:true}
		,showValues:true
	};
	memoryChartObj = new areaChart(mChartConfig);
	
	//Timeline Slider chart
	var sliderConfig={chartId:'timeline'
				,width:chartWidth
				,height:70
				,margin:{left:50,bottom:30}
				,x:{tickformat:'%H:%M:%S'}
				,timeData:{startDate:startTime,endDate:endTime}
				,relativeObj:[cpuChartObj, loadChartObj, memoryChartObj]
				};
	var sliderObj = new glueSlider(sliderConfig);

	loadComputeChartData();

	//Compute 차트 데이터 로드
	var sliderIntervalId, cpuIntervalId,loadIntervalId,memoryIntervalId;
	function loadComputeChartData()
	{
		//이벤트 리스트 가져오기
		$.ajax({
			url:'./data/system_matrix_event.php?startTime='+startTimeStamp+'&period='+period,
			dataType:'json',
			success:function(data){
				sliderObj.drawChart(data);
				sliderIntervalId = setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_event.php?startTime='+startTimeStamp+'&period='+period,
						dataType:'json',
						success:function(data){
							endTime=new Date();
							startTime = new Date(Date.parse(endTime) - period *1000 * 60); 
							startTimeStamp = startTime.getTime()/1000;

							var newConfig={timeData:{startDate:startTime,endDate:endTime}};
							sliderObj.redrawChart(newConfig,data);
						}
					});
				},timer*1000);
			}
		});
		
		//CPU Data
		$.ajax({
			url:'./data/system_matrix_cpu.php?startTime='+startTimeStamp+'&period='+period,
			dataType:'json',
			success:function(data){
				cpuChartObj.drawChart(data);
				//CPU Data 주기적 리로드
				cpuIntervalId = setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_cpu.php?startTime='+startTimeStamp+'&period='+period,
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
			url:'./data/system_matrix_load.php?startTime='+startTimeStamp+'&period='+period,
			dataType:'json',
			success:function(data){
				loadChartObj.drawChart(data);
				//Load Data 주기적 리로드
				loadIntervalId = setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_load.php?startTime='+startTimeStamp+'&period='+period,
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
			url:'./data/system_matrix_memory.php?startTime='+startTimeStamp+'&period='+period,
			dataType:'json',
			success:function(data){
				memoryChartObj.drawChart(data);
				//Memory Data 주기적 리로드
				memoryIntervalId = setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_memory.php?startTime='+startTimeStamp+'&period='+period,
						dataType:'json',
						success:function(data){
							memoryChartObj.reDrawChart(data);
						}
					});
				},timer*1000);
			}
		});
	}
	
	//차트 마우스오버 이벤트
	$( "#cpuChart" ).mouseover(function() {
		loadChartObj.mouseover();
		memoryChartObj.mouseover();
	});
	$( "#cpuChart" ).mouseout(function() {
		loadChartObj.mouseout();
		memoryChartObj.mouseout();
	});
	$( "#loadChart" ).mouseover(function() {
		cpuChartObj.mouseover();
		memoryChartObj.mouseover();
	});
	$( "#loadChart" ).mouseout(function() {
		cpuChartObj.mouseout();
		memoryChartObj.mouseout();
	});
	$( "#memoryChart" ).mouseover(function() {
		cpuChartObj.mouseover();
		loadChartObj.mouseover();
	});
	$( "#memoryChart" ).mouseout(function() {
		cpuChartObj.mouseout();
		loadChartObj.mouseout();
	});

	cpuChartObj.multiMousemove=function(mouse)
	{
		cpuChartObj.mousemove(mouse);
		loadChartObj.mousemove(mouse);
		memoryChartObj.mousemove(mouse);
	}
	loadChartObj.multiMousemove=function(mouse)
	{
		cpuChartObj.mousemove(mouse);
		loadChartObj.mousemove(mouse);
		memoryChartObj.mousemove(mouse);
	}
	memoryChartObj.multiMousemove=function(mouse)
	{
		cpuChartObj.mousemove(mouse);
		loadChartObj.mousemove(mouse);
		memoryChartObj.mousemove(mouse);
	}

	//기간 변경
	$(".period_buttons .btn").click(function(){
		if($(this).hasClass("btn-primary")) return;
		$(".period_buttons .btn-primary").removeClass("btn-primary").addClass("btn-white");
		$(this).removeClass("btn-white").addClass("btn-primary");

		switch($(this).text()) {
			case "5M":
				period = 5;//분
				timer = 5;//초
			break;
			case "30M":
				period = 30;//분
				timer = 10;//초
			break;
			case "60M":
				period = 60;//분
				timer = 300;//초=>5분
			break;
			case "24H":
				period = 24*60;//분
				timer = 30*60;//초=>30분
			break;
			case "7D":
				period = 24*60*7;
				timer = 60*60;//1시간
			break;
		}
		
		/* refreshIntervalId 중지 */
		clearInterval(sliderIntervalId);
		clearInterval(cpuIntervalId);
		clearInterval(loadIntervalId);
		clearInterval(memoryIntervalId);
		
		$("#timeline svg").remove();
		$("#cpuChart svg").remove();
		$("#loadChart svg").remove();
		$("#memoryChart svg").remove();
		
		cpuChartObj = new areaChart(chartConfig);
		loadChartObj = new lineChart(lChartConfig);
		memoryChartObj = new areaChart(mChartConfig);
		sliderObj = new glueSlider(sliderConfig);
		loadComputeChartData();
		
		//차트 마우스오버 이벤트
		$( "#cpuChart" ).mouseover(function() {
			loadChartObj.mouseover();
			memoryChartObj.mouseover();
		});
		$( "#cpuChart" ).mouseout(function() {
			loadChartObj.mouseout();
			memoryChartObj.mouseout();
		});
		$( "#loadChart" ).mouseover(function() {
			cpuChartObj.mouseover();
			memoryChartObj.mouseover();
		});
		$( "#loadChart" ).mouseout(function() {
			cpuChartObj.mouseout();
			memoryChartObj.mouseout();
		});
		$( "#memoryChart" ).mouseover(function() {
			cpuChartObj.mouseover();
			loadChartObj.mouseover();
		});
		$( "#memoryChart" ).mouseout(function() {
			cpuChartObj.mouseout();
			loadChartObj.mouseout();
		});
		cpuChartObj.multiMousemove=function(mouse)
		{
			cpuChartObj.mousemove(mouse);
			loadChartObj.mousemove(mouse);
			memoryChartObj.mousemove(mouse);
		}
		loadChartObj.multiMousemove=function(mouse)
		{
			cpuChartObj.mousemove(mouse);
			loadChartObj.mousemove(mouse);
			memoryChartObj.mousemove(mouse);
		}
		memoryChartObj.multiMousemove=function(mouse)
		{
			cpuChartObj.mousemove(mouse);
			loadChartObj.mousemove(mouse);
			memoryChartObj.mousemove(mouse);
		}
	});

	//기간 설정 버튼 클릭
	$(".periodBtn").click(function(){
		$(".periodForm").toggle();
	});
	$(".timeRangeLayer .fa-times").click(function(){
		$(".timeRangeLayer").hide();
		$(".period_buttons").show();
		$(".periodForm").hide();
	});
	//기간설정 submit
	$("#timePickSubmit").click(function(){
		//기간설정 내용 유효성체크
		//기간설정 submit
		//submit후 기간 설정 레이아웃처리
		$(".timeRangeLayer").show();
		$(".period_buttons").hide();
		$(".periodForm").hide();
	});
	$( ".periodForm from" ).submit(function( event ) {
	  event.preventDefault();
	});
});
$(window).resize(function(){
	//차트 폭 갱신
	var chartWidth = $('#timeline').width();
	var newConfig={width:chartWidth};
	//sliderObj.resize(newConfig);
	//cpuChartObj.resize(newConfig);
	//loadChartObj.resize(newConfig);
	//memoryChartObj.resize(newConfig);
});
