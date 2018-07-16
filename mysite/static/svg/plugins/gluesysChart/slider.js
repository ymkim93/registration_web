/*
Time slider d3 chart
*/
function glueSlider(config)
{
	//차트 기본값 설정
	config = initConfig(config);

	//켄버스와 그래프영역 크기 설정
	var margin = config.margin,
		width = config.width - margin.left - margin.right,
		height = config.height - margin.top - margin.bottom;

	// X축========================================
	//x축형변환 함수 : date
	var formatDataValue =d3.time.format(config.x.tickformat);
		formatDate = function(d){ return formatDataValue(d);};


	/*눈금 표시를 위한 scale 설정*/
	// X축 : date형
	var timeScale = d3.time.scale()
						.domain([config.timeData.startDate, config.timeData.endDate])
						.range([0, width])
						.clamp(true);
		xAxis	= d3.svg.axis().scale(timeScale).orient("bottom");
	//x축 포맷 지정
	if (config.x.tickformat!= '')
	{
		xAxis.tickFormat(d3.time.format(config.x.tickformat));
	}
	//x축 간격 지정
	if (typeof(config.x.ticks)!= 'undefined')
	{
		xAxis.ticks(config.x.ticks);
	}
	
	var self = this;
	this.mouse = false;
	//////////
	// defines brush
	var brush = d3.svg.brush()
					.x(timeScale)
					.extent([config.timeData.startDate, config.timeData.startDate])
					.on("brush", brushed);

	//svgEl Object
	var svgEl = d3.select('#'+config.chartId).append("svg")
					.attr("width", config.width)
					.attr("height", config.height)
					.append("g")
					// classic transform to position g
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var events = svgEl.append("g").attr("class","eventChart");
	svgEl.append("g")
		.attr("class", "x axis")
		// put in middle of screen
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.select(".domain")
		.select(function() {
			return this.parentNode.appendChild(this.cloneNode(true));
		})
		//.attr("class", "halo");
	var slider = svgEl.append("g")
					.attr("class", "slider")
					.call(brush);
	slider.selectAll(".extent,.resize")
			.remove();

	slider.select(".background")
			.attr("height", height);

	var handle = slider.append("g")
					.attr("class", "handle");
	handle.append("path")
			.attr("transform", "translate(0," + height / 2 + ")")
			.attr("d", "M 0 -10 V 10")
	slider.call(brush.event)
	
	function brushed() {
		var value = brush.extent()[0];

		if (d3.event.sourceEvent) { // not a programmatic event
			value = timeScale.invert(d3.mouse(this)[0]);
			brush.extent([value, value]);
			this.mouse = d3.mouse(this)[0];
			var objList = config.relativeObj;
			
			if(objList.length >0)
			{
				for(var i=0; i<objList.length;i++)
				{
					objList[i].mouseover();
					objList[i].mousemove(d3.mouse(this))
				}
			}
		}
		handle.attr("transform", "translate(" + timeScale(value) + ",0)");
	}
	
	var dataSet = [];
	this.drawChart = function(data)
	{
		data.forEach(function(d){
			d.startTime = new Date(d.startTime * 1000);
			d.endTime  = new Date(d.endTime * 1000);
		});
		
		dataSet = data;

		//event block Chart 그리기
		self.drawBlockChart();
	}

	/* 차트 다시 그리기 */
	this.redrawChart = function(newConf,data)
	{
		data.forEach(function(d){
			d.startTime = new Date(d.startTime * 1000);
			d.endTime  = new Date(d.endTime * 1000);
		});
		
		dataSet = data;
		
		config.timeData.startDate = newConf.timeData.startDate;
		config.timeData.endDate = newConf.timeData.endDate;

		timeScale.domain([config.timeData.startDate, config.timeData.endDate]);
		brush.x(timeScale).extent([config.timeData.startDate, config.timeData.endDate]);
		
		// Select the section we want to apply our changes to
		var svg = d3.select("#"+config.chartId).transition();
		svg.select(".x.axis") // change the x axis
				.duration(750)
				.call(xAxis);

		self.drawBlockChart();
	}
	
	/* event block 차트 그리기 */
	this.drawBlockChart = function()
	{
		svgEl.selectAll(".bar").remove();
		
		//event block Chart 그리기
		events.selectAll(".bar")
					.data(dataSet)
					.enter().append("rect")
					.attr("class", "bar")
					.attr("x", function(d) { return timeScale(d.startTime); })
					.attr("y", -6)
					.attr("width", function(d) {
							var w =timeScale(d.endTime) - timeScale(d.startTime);
							if(w<0) w=0;
							return w;
						})
					.attr("height", 18);
	}
	
	/* 차트 크기 변경 */
	this.resize=function(newConf)
	{
		config.width = newConf.width;
		/* 차트 Margin 설정 */
		if (typeof(newConf.margin) != 'undefined')
		{
			if (typeof(newConf.margin.top) != 'undefined') config.margin.top = newConf.margin.top;
			if (typeof(newConf.margin.right) != 'undefined') config.margin.right = newConf.margin.right;
			if (typeof(newConf.margin.bottom) != 'undefined') config.margin.bottom=newConf.margin.bottom;
			if (typeof(newConf.margin.left) != 'undefined') config.margin.left=newConf.margin.left;
			margin = config.margin;
		}

		width = config.width - margin.left - margin.right;

		//x축 간격 지정
		if (typeof(newConf.x)!= 'undefined' && typeof(newConf.x.ticks)!= 'undefined')
		{
			xAxis.ticks(newConf.x.ticks);
		}
		// Select the section we want to apply our changes to
		var svg = d3.select("#"+config.chartId).transition();
		//resize svg width
		svg.select('svg').attr("width", config.width);
		svg.select('.background').attr("width", width);
		
		//resize xScale
		timeScale.range([0, width]);
		timeScale.domain([config.timeData.startDate, config.timeData.endDate]);
		brush.x(timeScale).extent([config.timeData.startDate, config.timeData.endDate]);

		svg.select(".x.axis") // change the x axis
				.duration(750)
				.call(xAxis);

		self.drawBlockChart();
	}
}