<?php
$startTime = $_GET['startTime'];
$period = $_GET['period']; //기간: 분 단위
$endTime = $startTime +  $period*60;

$result = array();
$cnt =0;

while($cnt <3)
{
	$startTime = $startTime + rand(1,5)*60;
	$end_time = $startTime + 120;
	if($end_time>$endTime)
	{
		$end_time = $endTime;
		$cnt=3;
	}

	$result[]=array("startTime"=>$startTime,"endTime"=>$end_time);
	/*echo  date("Y-m-d H:i:s",$startTime);
	echo "-";
	echo  date("Y-m-d H:i:s",$end_time);
	echo "<br>";*/
	$startTime = $end_time;
	$cnt++;
}

echo json_encode($result);
?>