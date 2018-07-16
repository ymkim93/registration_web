/** Chart Legend **/
var pieChartLegend = function(data,config)
{
	//chart color
	var color = d3.scale.ordinal().range(config.colors);

	var svgEl =  d3.select('#'+config.chartId+ ' svg');
	var legendWrap = svgEl.append("g")
							.attr("class", "legendWrap")
	//범례 위치 지정
	if(config.legend.position=='top') legendWrap.attr("transform", "translate("+(config.margin.left-5)+",0)");
	else legendWrap.attr("transform", "translate("+config.margin.left+","+(config.height-config.margin.bottom+10)+")");
	var legend = legendWrap.selectAll(".legend")
							.data(data)
							.enter().append("g")
							.attr("class", "legend");
	if(config.legend.shape=='circle')
	{
		var legendShape = legend.append("circle")
								.attr("cx", 5)
								.attr("cy", 10)
								.attr("r", 6);
	}
	else
	{
		var legendShape = legend.append("rect")
								.attr("x", 0)
								.attr("y", 3)
								.attr("rx",2)
								.attr("ry",2)
								.attr("width", 12)
								.attr("height", 12);
	}
	legendShape.style("stroke", function(d) {return color(d);})
				.style("fill", function(d) {return color(d);});
	legend.append("text")
					.attr("x", 18)
					.attr("y", 8)
					.attr("dy", ".35em")
					.style("text-anchor", "start")
					.text(function(d) { return d; });

	var dataH=0
	legend.attr('transform', function(d, i) {
									//글자의 크기에 따라 간격을 설정한다.
									var offset = d3.select(this).select('text').node().getComputedTextLength() + 28;
									if (i === 0) {
										dataL = d.length + offset
										return "translate(0,0)" //첫번째 범례위치
									} else { 
										var newdataL = dataL
										dataL +=  d.length + offset;
										//범례의 표시 위치가 캔버스의 크기를 벗어나면 줄바꿔주기를 하여 위치를 지정한다.
										if(dataL>=config.width) {newdataL=0;dataL = d.length + offset; dataH+=20}

										return "translate(" + (newdataL) + ","+(dataH)+")"
									}
				});
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

/* pie chart */
function pieChart(config)
{
	//차트 기본값 설정
	config = initConfig(config);
	//켄버스와 그래프영역 크기 설정
	var margin = config.margin,
		width = config.width,
		height = config.height,
		radius = Math.min(width, height) / 2 - Math.max(margin.top,margin.bottom)/2;
	var chartXpos = width/2, 
		chartYpos = height/2;
	if(config.legend.show==true)
	{
		if(config.legend.position=='top')	chartYpos = chartYpos+margin.top/2;
		else	chartYpos = chartYpos - margin.bottom/2;
	}

	// tooltip data Format
	if (typeof(config.tooltip.format)!= 'undefined')
	{
		var formatDataValue = d3.format(config.tooltip.format);
		var tooltipFormatData=function(d){ return formatDataValue(d);}
	}
	else {
		var tooltipFormatData=function(d){ return d;} 
	}

	//chart color
	var color = d3.scale.ordinal().range(config.colors);
	//그래프의 안쪽, 바깥쪽 반지름 설정
	var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius*config.innerRadius);
	//레이블 위치 설정
	var labelArc = d3.svg.arc().outerRadius(radius - 40).innerRadius(radius - 40);
	//원그래프 좌표 메서드
	var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });

	//원그래프 그리기
	var svgEl = d3.select('#'+config.chartId).append("svg")
								.attr("width", width)
								.attr("height", height)
								.append("g")
								.attr("transform", "translate(" +chartXpos + "," + chartYpos + ")");
	var infoBox = d3.select('#'+config.chartId)
						.append("div")
						.attr("class","infoBox")
						.style("display","none");
	var self = this;
	var dataSet=[];
	
	//차트의 데이터를 파일에서 가져오기
	this.getData=function()
	{
		d3.json(config.dataSrc,  function(error, data) {
		  if (error) throw error;
			self.drawChart(data);
		});
	}
	
	//초기화 차트 그리기
	this.drawChart=function(data)
	{
		dataSet = data;

		var labelNames = new Array();
		var tots = d3.sum(data, function(d) { 
            return d.value; 
        });
		data.forEach(function(d){
			labelNames.push(d.key);
			d.percentage = (d.value  / tots * 100).toFixed(1);
		});

		var arcs = svgEl.selectAll(".arc")
					.data(pie(data))
					.enter().append("g")
					.attr("class", "arc");

		arcs.append("path")
					.attr("fill", function(d, i) { return color(i); })
					.each(function(d){this._current=d})
					.transition()
					.ease("linear")
					.duration(1000)
					.attrTween("d", function(b){
						b.innerRadius = 0;
						var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
						//시간에 따라 처리
						return function(t) { return arc(i(t)); };
					})
		if(config.showValues===true)
		{
			arcs.append("text")
				.text(function(d) { return d.data.percentage+'%'; })
				.attr("dy", ".35em")
				.attr("class", 'barValue')
				.transition()
				.ease("linear")
				.duration(1000)
				.delay(function(d,i) { return i*10;})
				.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		}
		////////////////////////////////////////////////////////////////////////
		/* 메인그래프 legend(범례) */
		if(config.legend.show==true) pieChartLegend(labelNames,config);
		/* Tooltip */
		if(config.tooltip.show===true)
		{
			var path = svgEl.selectAll("#"+config.chartId+' path');
			path.on('mouseover',function(d,i){
				d3.select(this).attr('opacity',0.8);
				var xPosition = d3.event.pageX;
				var yPosition = d3.event.pageY;
				var textColor=color(i);
				var infoHtml ="<div class='label' style='color:"+textColor+"'>"+d.data.key+"</div>";
				infoHtml += "<div>"+tooltipFormatData(d.data.value)+"</div>";

				infoBox.style("left",xPosition+"px")
						.style("top",yPosition+"px")
						.style("display",null)
						.html(infoHtml);

			});
			path.on('mouseout',function(){
				d3.select(this).attr('opacity',1);
				infoBox.style("display","none");
			});

			path.on('mousemove',function(d){
				var xPosition = d3.event.pageX;
				var yPosition = d3.event.pageY;
				infoBox.style("left",xPosition+"px")
						.style("top",yPosition+"px");
			});
		}
	}

	/* data 갱신 */
	this.updateData = function() {
		d3.json(config.dataSrc,  function(error, data) {
		  if (error) throw error;
			self.reDrawChart(data);
		});
	}
	/* 차트 다시 그리기 */
	this.reDrawChart=function(data)
	{
		self.dataSet = data;
		var tots = d3.sum(data, function(d) { 
            return d.value; 
        });
		data.forEach(function(d){
			d.percentage = (d.value  / tots * 100).toFixed(1);
		});

		var path = svgEl.selectAll("#"+config.chartId+' path');

		pie.value(function(d) { return d.value; }); // change the value function
	    path = path.data(pie(data)); // compute the new angles
		path.transition().duration(750).attrTween("d", function(a){
			var i = d3.interpolate(this._current,a);
			this._current = i(0);
			return function(t){return arc(i(t));};
		}); // redraw the arcs
		if(config.showValues===true)
		{
			var text = svgEl.selectAll("#"+config.chartId+' .barValue');
			text.data(pie(data))
				.text(function(d) {return d.data.percentage+'%'; })
				.transition().duration(750)
				.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		}
    }
	
	/* 차트 크기 변경 */
	this.resize=function(newConf)
	{
		//켄버스와 그래프영역 크기 설정
		config.width = newConf.width;
		
		if(typeof(newConf.height)!= 'undefined') config.height=newConf.height;
		/* 차트 Margin 설정 */
		if (typeof(newConf.margin) != 'undefined')
		{
			if (typeof(newConf.margin.top) != 'undefined') config.margin.top = newConf.margin.top;
			if (typeof(newConf.margin.right) != 'undefined') config.margin.right = newConf.margin.right;
			if (typeof(newConf.margin.bottom) != 'undefined') config.margin.bottom=newConf.margin.bottom;
			if (typeof(newConf.margin.left) != 'undefined') config.margin.left=newConf.margin.left;
		}
		
		var margin = config.margin,
			width = config.width,
			height = config.height,
			radius = Math.min(width, height) / 2 - Math.max(margin.top,margin.bottom)/2;
		var chartXpos = width/2, 
			chartYpos = height/2;
		if(config.legend.show==true)
		{
			if(config.legend.position=='top')	chartYpos = chartYpos+margin.top/2;
			else	chartYpos = chartYpos - margin.bottom/2;
		}
		//그래프의 안쪽, 바깥쪽 반지름 설정
		var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius*config.innerRadius);
		//레이블 위치 설정
		var labelArc = d3.svg.arc().outerRadius(radius - 40).innerRadius(radius - 40);

		// Select the section we want to apply our changes to
		var svgEl= d3.select('#'+config.chartId + ' svg');
		svgEl.attr("width", width).attr("height", height);
		var gEl= d3.select('#'+config.chartId + ' svg g');
		gEl.attr("transform", "translate(" +chartXpos + "," + chartYpos + ")");

		var path = svgEl.selectAll("#"+config.chartId+' path');
		pie.value(function(d) { return d.value; }); // change the value function
	    path = path.data(pie(dataSet)); // compute the new angles
		path.transition().duration(750).attrTween("d", function(a){
			var i = d3.interpolate(this._current,a);
			this._current = i(0);
			return function(t){return arc(i(t));};
		});
		if(config.showValues===true)
		{
			var text = svgEl.selectAll("#"+config.chartId+' .barValue');
			text.data(pie(dataSet))
				.text(function(d) {return d.data.percentage+'%'; })
				.transition().duration(750)
				.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		}

		if(config.legend.show==true && config.legend.position=='bottom')
		{
			//범례 위치 지정
			var legendWrap =  d3.select('#'+config.chartId+ ' .legendWrap');
			
			legendWrap.attr("transform", "translate("+config.margin.left+","+(config.height-config.margin.bottom+10)+")");
		}
	}
}