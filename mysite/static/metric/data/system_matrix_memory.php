<?php
$startTime = $_GET['startTime'];
$period = $_GET['period']; //기간: 분 단위
$endTime = $startTime +  $period*60;

function randomeNum()
{
	return rand(0,50)/100;
}

while($startTime<=$endTime)
{
	$result[]=array("key"=>$startTime,"Memory Used"=>randomeNum(),"Memory Free"=>randomeNum());
	$startTime+=100;
}


echo json_encode($result);
?>