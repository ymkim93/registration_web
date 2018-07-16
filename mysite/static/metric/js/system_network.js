/* system matrix network script */
/*
차트 갱신 주기
5분 : 5초마다 갱신
30분: 10초마다 갱신
60분: 5분마다 갱신
24시간: 30분마다 갱신
7일:1시간 마다 갱신
그래프 갱신 주기와 그래프 x축 ticksize와 tickformat은 변경 되어야 한다.!!
*/

var sliderObj, netChartObj;
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

	//Network chart dummy
	var chartConfig={chartId:'networkChart'
		,width:chartWidth
		,height:300
		,margin:{left:50,bottom:50}
		,y:{tickformat:'%',grid:true,label:''}
		,x:{tickformat:'%H:%M:%S',grid:true,label:'Time '}
		,tooltip:{format:'%Y-%m-%d %H:%M:%S',fixed:true}
		,colors: 'glueColor1'
		,timer:timer
		,showValues:true
		,dataSrc:'../plugins/gluesysChart/lineChartData.php?timer='+timer
	};
	netChartObj = new lineChart(chartConfig);

	//Timeline Slider chart
	var sliderConfig={chartId:'timeline'
				,width:chartWidth
				,height:70
				,margin:{left:50,bottom:30}
				,x:{tickformat:'%H:%M:%S'}
				,timeData:{startDate:startTime,endDate:endTime}
				,relativeObj:[netChartObj]
				};
	var sliderObj = new glueSlider(sliderConfig);

	loadChartData();

	//Compute 차트 데이터 로드
	var sliderIntervalId, cpuIntervalId,loadIntervalId,memoryIntervalId;
	function loadChartData()
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
		
		//Network Data
		$.ajax({
			url:'./data/system_matrix_cpu.php?startTime='+startTimeStamp+'&period='+period,
			dataType:'json',
			success:function(data){
				netChartObj.drawChart(data);
				//CPU Data 주기적 리로드
				netIntervalId = setInterval(function(){
					$.ajax({
						url:'./data/system_matrix_cpu.php?startTime='+startTimeStamp+'&period='+period,
						dataType:'json',
						success:function(data){
							netChartObj.reDrawChart(data);
						}
					});
				},timer*1000);
			}
		});
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
		clearInterval(netIntervalId);
		
		$("#timeline svg").remove();
		$("#networkChart svg").remove();
		
		netChartObj = new lineChart(chartConfig);
		sliderObj = new glueSlider(sliderConfig);
		loadChartData();
		
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
