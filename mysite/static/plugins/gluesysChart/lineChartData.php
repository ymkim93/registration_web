<?php
function randomeNum()
{
	return rand(0,100)/100;
}

$nowTime = time();
if(isSet($_GET['update']))
{
	$result[]=array("key"=>$nowTime,"Sample Sample Chart1"=>randomeNum(),"Sample Sample Chart2"=>randomeNum(),"Sample Sample Chart3"=>randomeNum(),"Sample Sample Chart4"=>randomeNum(),"Sample Sample Chart5"=>randomeNum());
}
else
{
	$timer=$_GET['timer'];
	if($timer=='') $timer=2;
	$scale=20;
	$startTime = $nowTime-($scale*$timer);
	$result = array();
	while($startTime<=$nowTime)
	{
		$result[]=array("key"=>$startTime,"Sample Sample Chart1"=>randomeNum(),"Sample Sample Chart2"=>randomeNum(),"Sample Sample Chart3"=>randomeNum(),"Sample Sample Chart4"=>randomeNum(),"Sample Sample Chart5"=>randomeNum());
		$startTime+=$timer;
	}
}
echo json_encode($result);

exit;



function getMemStat()
{
	exec("sudo free -m",$output);
	$output[1] = preg_replace ( "!Mem: +!", "", $output[1] );

	if($output[1]=='') return false;

	$parts = explode(" ",preg_replace("/\\s{2,}/", ' ', $output[1]));
	
	$return = array ();
	$return ['total'] = $parts [0];
	$return ['used'] = $parts [1];
	$return ['free'] = $parts [2];
	$return ['shared'] = $parts [3];
	$return ['buffers'] = $parts [4];
	$return ['cached'] = $parts [5];

	return $return;
}
function getStat($_statPath) {
	if (trim ( $_statPath ) == '') {
		$_statPath = '/proc/stat';
	}

	ob_start ();
	@readfile($_statPath);
	$stat = ob_get_contents ();
	ob_end_clean ();
			
	if (substr ( $stat, 0, 3 ) == 'cpu') {
		$parts = explode ( " ", preg_replace ( "!cpu +!", "", $stat ) );
	} else {
		return false;
	}
	
	$return = array ();
	$return ['user'] = $parts [0];
	$return ['nice'] = $parts [1];
	$return ['system'] = $parts [2];
	$return ['idle'] = $parts [3];
	return $return;
}

function getCpuUsage($_statPath = '/proc/stat') {
	$time1 = getStat ( $_statPath );
	if (!$time1) return -1;
	sleep ( 1 );
	$time2 = getStat ( $_statPath );

	$delta = array ();

	foreach ( $time1 as $k => $v ) {
		$delta [$k] = $time2 [$k] - $v;
	}

	$deltaTotal = array_sum ( $delta );
	$percentages = array ();

	foreach ( $delta as $k => $v ) {
		$percentages [$k] = @round ( $v / $deltaTotal * 100, 2 );
	}
	return $percentages;
}

if(isSet($_GET['update']))
{
	$result = array();
	if (($cpu = getCpuUsage()) === -1) { $cpu_percentage = 0; }
	else {
		$cpulast = 100 - $cpu ['idle'];
		$cpu_percentage = round ( $cpulast, 2 )+4;
	}
	$usage = getMemStat();
	$mem_percentage = @round ( ($usage['used']-$usage['buffers']-$usage['cached']) / $usage['total'] * 100, 2 );

	$result[]=array('key'=>time(),'cpu'=>$cpu_percentage,'memory'=>$mem_percentage);

	echo json_encode($result);
}
else
{
	echo '
	[{"key":1470112959,"cpu":10,"memory":13.78}
	,{"key":1470112962,"cpu":2.5,"memory":12.5}
	,{"key":1470112965,"cpu":0.5,"memory":11.78}
	,{"key":1470112969,"cpu":0,"memory":13.7}
	,{"key":1470112972,"cpu":8,"memory":14.78}
	,{"key":1470112975,"cpu":13.3,"memory":5.28}
	,{"key":1470112978,"cpu":0,"memory":4.78}
	,{"key":1470112981,"cpu":0,"memory":3.78}
	,{"key":1470112984,"cpu":1.2,"memory":8.8}
	,{"key":1470112987,"cpu":9,"memory":9.7}
	,{"key":1470112990,"cpu":6,"memory":13.2}
	,{"key":1470112993,"cpu":2.5,"memory":3.9}
	,{"key":1470112996,"cpu":0.5,"memory":6.2}
	,{"key":1470112999,"cpu":0.5,"memory":13.78}
	,{"key":1470113002,"cpu":2.5,"memory":13}
	,{"key":1470113005,"cpu":3,"memory":7}
	,{"key":1470113008,"cpu":11.2,"memory":8}
	,{"key":1470113011,"cpu":4,"memory":13.78}
	,{"key":1470113014,"cpu":3,"memory":13.78}
	,{"key":1470113017,"cpu":0,"memory":13.78}
	]';
}
?>