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
	$result[]=array("key"=>$startTime,"Load Average One Minute"=>randomeNum(),"Load Average Five Minute"=>randomeNum(),"Load Average Fiteen Minute"=>randomeNum());
	$startTime+=100;
}
echo json_encode($result);
?>