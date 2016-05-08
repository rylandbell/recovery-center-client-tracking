// next steps:
// 'return to today' button
// fix bug for displaying full month names
// resize chart on window resize
// re-introduce animation
// filter by row


// $(document).ready(function(){
// 	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// 	var today = new Date();
// 	var targetDate = new Date();
// 	function findWeek(date){
// 		var week = {};
// 	    var dayNumber = date.getDay();
// 	    var start = date.setDate(date.getDate()-dayNumber);
// 	    week.sunday = new Date(start);
// 	    var sat = date.setDate(date.getDate()+6);
// 	    week.saturday = new Date(sat);
// 	    return(week);
// 	}

// 	function prettyDate(date){
// 	    var pretty = months[date.getMonth()]+" "+date.getDate();
// 	    return pretty;
// 	}

// 	function updateDateRange(date){
// 		var week = findWeek(date);
// 		var sunday = prettyDate(week.sunday);
// 		var saturday = prettyDate(week.saturday);
// 		if (sunday.substring(0,3)===saturday.substring(0,3)){
// 			saturday = saturday.substring(3);
// 		}
// 		var weekString = sunday+" - "+saturday;
// 		$('#date-range').text(weekString);
// 	}

// 	if($('#history').length){
// 		//Disable Next Week on load:
// 		// $('#go-future').hide();
// 		updateDateRange(targetDate);
// 		$('#go-past').click(function(){
// 			targetDate.setDate(targetDate.getDate()-7);
// 			updateDateRange(targetDate);
// 			//Enable next week:
// 			// $('#go-future').show();
// 		})
// 		$('#go-future').click(function(){
// 			targetDate.setDate(targetDate.getDate()+7);
// 			updateDateRange(targetDate);	
// 			if(targetDate>=today){
// 				//Disable next week button:
// 				// $('#go-future').hide();
// 			}	
// 		})
// 	} else {
// 		console.log('no');
// 	}
// })

$(document).ready(function(){
	google.charts.load('current', {packages: ['corechart', 'line']});
	google.charts.setOnLoadCallback(function(){
		createLineGraph(fudgeData(80),initialOptions);
	});

	function fudgeData(days){
		var outputArray = [];
		var dateArray = [];
		var today = new Date(2016, 4, 10);
		for (var i = 0; i<days; i++){
			var x;
			x = today.setDate(today.getDate()-1);
			dateArray.push(x);
		}
		for (var i = 0; i<days; i++){
			var x = [new Date(dateArray[i]),Math.min(i+6,10),10,Math.max(7-i,0),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1),Math.floor(Math.random()*10+1)];
			outputArray.push(x);
		}
		return outputArray;
	}

	var colorList = [null,'darkblue','red','gold','green','purple','blue'];

	var initialOptions = {
		colors: colorList,
		hAxis: {
		  format: 'EEE, MMM d'
		},
		vAxis: {
		  gridlines: {count: 6},
		  viewWindowMode: 'pretty',
		},
		// title: 'Daily Check-In Results',
		titleTextStyle: {
			fontName: 'Droid Serif',
			fontSize: 24
		},
		legend: {
			position: 'top',
			alignment: 'center',
		},
		height: 400,
		lineWidth: 3,
		focusTarget: 'datum',
		pointSize: 7,
		animation: {
			startup: true,
			duration: 500,
			easing: 'out'
		},
		chartArea:{
			height:'70%', 
			top: 50,
			left: 50,
			width: '90%'
		},
		fontSize: 18,
		fontName: 'Droid Sans'
	};

	//Create DataTable. This object won't change once set.
	function createTable(dataArray){
		var data = new google.visualization.DataTable();
			data.addColumn('date', 'X');
			data.addColumn('number', 'Cravings');
			data.addColumn('number', 'Sleep');
			data.addColumn('number', 'Stress');
			data.addColumn('number', 'Mood');
			data.addColumn('number', 'Energy');
			data.addColumn('number', 'Goals');
			data.addRows(dataArray);
			return data;
	};

	function createLineGraph(dataArray,options) {
		var data = createTable(dataArray);
		var currentOptions = options;
		//the Data View is the object that mutates with form input:
		var filteredData = new google.visualization.DataView(data);
		var chart = new google.visualization.LineChart(document.getElementById('line-chart'));
		var jumpSize = 7;
		var minRow = 0;
		var maxRow = Math.min(minRow+(jumpSize-1), dataArray.length);

		
		function drawGraph(cols,rows,options){
			filteredData.setColumns(cols);
			filteredData.setRows(rows);

			var tempOptions = options;
			var tempColors = [];
			//start loop at 1 to ignore the null color for x-values (dates)
			for (var i=1; i<cols.length; i++){
				tempColors.push(colorList[cols[i]]);
			}
			tempOptions.colors = tempColors;
			// According to the Google documentation, I shouldn't need to use the 
			// toDataTable method, but I get an error message without it (as far as 
			// I can tell, this is a bug in the library)
			chart.draw(filteredData.toDataTable(),tempOptions);
		}

		function findActiveColumns(){
			$selector = $('#toggle-categories');
			var visibleCols = [0];
			$selector.children().children().each(function(){
				if($(this).prop('checked')){
					visibleCols.push(parseInt($(this).prop('id').substring(3)));
				};
			});
			return visibleCols;
		}

		function findActiveRows(){
			var visibleRows = [];
			for (var i=minRow; i<=maxRow; i++){
				visibleRows.push(i);
			}
			return visibleRows;
		}

		//listen for changes to active columns button group
		$('#toggle-categories').on('change',function(){
			drawGraph(findActiveColumns(),findActiveRows(),currentOptions);
		});

		$('#go-past').on('click',function(){
			minRow = Math.min(minRow+jumpSize, dataArray.length-1);
			maxRow = Math.min(minRow+(jumpSize-1), dataArray.length-1);
			if(minRow===dataArray.length-1||maxRow===dataArray.length-1){
				maxRow = dataArray.length-1;
				minRow = Math.max(0,maxRow-(jumpSize-1));
			}
			drawGraph(findActiveColumns(),findActiveRows(),currentOptions);
		});

		$('#go-future').on('click',function(){
			minRow = Math.max(minRow-jumpSize, 0);
			maxRow = Math.max(minRow+(jumpSize-1), 0);
			if(minRow===0||maxRow===0){
				maxRow = Math.min(minRow+(jumpSize-1), dataArray.length);
				minRow = 0;
			}
			drawGraph(findActiveColumns(),findActiveRows(),currentOptions);
		});

		$('#jump-size-picker').on('click',function(e){
			switch(e.target.id) {
			    case "jump-7":
			        jumpSize=7;
			        break;
			    case "jump-30":
			        jumpSize=30;
			        break;
		        case "jump-all":
		        	jumpSize=dataArray.length;
		        	break;
			    default:
			    	console.log('The switch goofed.');
			}
			maxRow=Math.min(minRow+(jumpSize-1),dataArray.length-1);
			if (maxRow===dataArray.length-1){
				minRow = Math.max(maxRow-(jumpSize-1), 0);
			}
			drawGraph(findActiveColumns(),findActiveRows(),currentOptions)
		});

		//initial draw
		drawGraph(findActiveColumns(),findActiveRows(),currentOptions);
	};

});
