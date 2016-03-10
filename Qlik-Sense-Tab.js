define( [
		"qlik" 
		,"./properties"
		,"text!./css/tab.css"
],
function ( qlik, props, cssContent ) {

	$( '<style>' ).html( cssContent ).appendTo( 'head' );

	var app = qlik.currApp(this); //App object
	var repeated = 1;	//Rendering repeat count
	var opened_object_id = []; //Array to store opened object ID

	//Function to create the new tab content
	function createTabContent(tab_id,object_id) {
		var tab_content = "";
		tab_content += 		'<section id="panel-' + tab_id + '-' + object_id + '" >';
		tab_content += 			'<main class="panel-content" >';
		tab_content += 				'<div id="viz' + tab_id + '-' + object_id + '" class="qvobject"></div>';
		tab_content += 			'</main>';
		tab_content += 		'</section>';	
		
		return tab_content;	
	}

	return {
		initialProperties : {
			version : 1.0
		},
	  	definition: ( props )
	  	,
		paint: function ($element, layout) {

			var html = "";
			var num_of_tabs = layout.props.num_of_tabs;
			var width = "";
			var object_id = layout.qInfo.qId; //Get this extension's ID

			// Set the width of each tab based on the number of tabs
			if (window.matchMedia('screen and (min-width:640px)').matches) {
				width = Math.round(80/num_of_tabs);
			}else {
				width = 100;
			}

			// Create panel radio buttons
			for (i=1; i<=num_of_tabs; i++) {
				html += '<input id="panel-' + i + '-ctrl-' + object_id + '" class="panel-radios" type="radio" name="tab-radios-' + object_id + '" style="display:none;"';
				(i==1)?html+='checked>':html+='>';
			}
			html += '<input id="nav-ctrl"　class="panel-radios" type="checkbox" name="nav-checkbox" style="display:none;">';

			// Create tabs
			html += '<ul id="tabs-list">';
		    html += 	'<label id="open-nav-label" for="nav-ctrl"></label>';
			for (i=1; i<=num_of_tabs; i++) {				
				html += '<li id="li-for-panel-' + i + '-' +  object_id + '" style="width:' + width + '%">';
			    html += 	'<label class="panel-label" for="panel-' + i + '-ctrl-' + object_id + '">' + eval("layout.props.label_for_tab" + i) + '</label>';
			    html += '</li>';
			}
		    html +=		'<label id="close-nav-label" for="nav-ctrl">Close</label>';		    
			html += '</ul>';

			// Create tab contents 
			html += '<article id="panels">';
			html += 	'<div class="container">';
			for (i=1; i<=num_of_tabs; i++) {
				html += createTabContent(i,object_id);
			}
			html += 	'</div>';
			html += '</article>';

			//Render html
			$element.html( html );

			// Show panel-1
			$("section#panel-1-" + object_id).css("height","100%");

			if(repeated==1){
				qlik.resize();
			}
						
			// Get tab1 object
			if(layout.props.chart_for_tab1 && repeated > 1) {
				//app.visualization.get(layout.props.chart_for_tab1).then(function(vis){
				//	vis.show("viz1-" + object_id);
				//});
			  
			    app.getObject( "viz1-" + object_id, layout.props.chart_for_tab1);
			  
				opened_object_id.push(layout.props.chart_for_tab1);
			}

			repeated += 1;

			//Triggered when tab is selected
			$('li[id*="' + object_id + '"]').on('click', function (e) {

				// Hide the old panel
				$("section[id*="+ object_id + "]").css("height","0%");

				var tab_name = e.currentTarget.id; //Get the id element of the new tab
				var tab_id = tab_name.replace("li-for-panel-","").replace("-" + object_id,""); //Get the id of the new tab

				//Display the new panel
				$("#panel-" + tab_id + '-' + object_id).css("height","100%");

				if(eval("layout.props.chart_for_tab" + tab_id)) {	
					// Get the new object
					//app.visualization.get(eval("layout.props.chart_for_tab" + tab_id)).then(function(vis){
					//	vis.show('viz' + tab_id + '-' + object_id);						
					//});
				  
				  	app.getObject( 'viz' + tab_id + '-' + object_id, eval("layout.props.chart_for_tab" + tab_id));

					// Close the old object
					//app.visualization.get(opened_object_id.pop()).then(function(vis){
					//	vis.close();		
					//});

					// Store the new object ID
					opened_object_id.push(eval("layout.props.chart_for_tab" + tab_id))
				} else {}
			});
		}
	};

} );
