$( document ).ready(function() {
    console.log("ready for some survey action");
    submitSurvey();
});

function submitSurvey() {

	
	$('.submit_button').click(function () {
		console.log("Submit button clicked");
		var q1 = $("input:radio[name ='question1']:checked").val();
		var q2 = $("input:radio[name ='question2']:checked").val();
		var q3 = $("input:radio[name ='question3']:checked").val();
		var q4 = $("input:radio[name ='question4']:checked").val();
		var q5 = $("input:radio[name ='question5']:checked").val();
		var q6 = $("input:radio[name ='question6']:checked").val();
		var q7 = $("input:radio[name ='question7']:checked").val();
		var q8 = $("input:radio[name ='question8']:checked").val();
		var q9 = $("input:radio[name ='question9']:checked").val();
		var q10 = $("input:radio[name ='question10']:checked").val();
		console.log(q1);
		console.log(q2);
		console.log(q3);
		console.log(q4);
		console.log(q5);
		console.log(q6);
		console.log(q7);
		console.log(q8);
		console.log(q9);
		console.log(q10);
		
		var sendSurvey = $.ajax({
					url: "fordify.php",
					type: "POST",
					data: { q1:q1,q2:q2,q3:q3,q4:q4,q5:q5,q6:q6,q7:q7,q8:q8,q9:q9,q10:q10 },
					dataType: "json"
				});
				
		sendSurvey.done(function( response ) {
			console.log("survey response received");
			console.log(response);
			
			var sD = response["overall"]["sD"];
			var disagree = response["overall"]["d"];
			var n = response["overall"]["n"];
			var a = response["overall"]["a"];
			var sA = response["overall"]["sA"];
			
			var data = [sA,a,n,disagree,sD];

			var x = d3.scale.linear()
				.domain([0,d3.max(data)])
				.range([0,250]);
			
			var counter = 0;

			d3.select(".chart")
				.selectAll("div")
				.data(data)
				.enter().append("div")
				.style("width", function(d){return x(d) +"px";})
				.attr("id", function(d, i) { return "bar" + i;})
				.text(function(d){return d;});
			
		});//end of response
		
	});//end of onclick

}//end of submit survey