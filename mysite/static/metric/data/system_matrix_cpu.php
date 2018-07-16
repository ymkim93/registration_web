<?php
$startTime = $_GET['startTime'];
$period = $_GET['period']; //기간: 분 단위
$endTime = $startTime +  $period*60;

function randomeNum()
{
	return rand(0,20)/100;
}

while($startTime<=$endTime)
{
	$result[]=array("key"=>$startTime,"CPU User"=>randomeNum(),"CPU System"=>randomeNum());
	$startTime+=100;
}
echo json_encode($result);

?>