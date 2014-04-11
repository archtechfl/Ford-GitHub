$( document ).ready(function() {
    console.log("ready for some survey action");
	nextQuestion();
	getOverall();
});

function getOverall() {
	var Survey_getOverall = $.ajax({
					url: "fordify-getOverall.php",
					type: "GET",
					dataType: "json"
				});
				
	Survey_getOverall.done(function( Survey_response ) {
				generateOverallGraph( Survey_response );
			});
			
}

function generateOverallGraph( Survey_response ) {
	console.log("survey Survey_response received, initial");
			console.log(Survey_response);
			
			var Survey_sD = Number(Survey_response["overall"]["sD"]);
			var Survey_disagree = Number(Survey_response["overall"]["d"]);
			var Survey_n = Number(Survey_response["overall"]["n"]);
			var Survey_a = Number(Survey_response["overall"]["a"]);
			var Survey_sA = Number(Survey_response["overall"]["sA"]);
			
			var Survey_oR = [Survey_sD, Survey_disagree, Survey_n, Survey_a, Survey_sA]; //overall results
			
			var Survey_tP = 0;
			for (i=0; i<Survey_oR.length; i++){
				Survey_tP += Survey_oR[i];
				console.log(Survey_tP);
			}
			
			var percentages = [];
			
			var perHolder = 0;
			
			for (i=0; i<Survey_oR.length; i++){
				perHolder = Survey_oR[i] / Survey_tP;
				perHolder = perHolder * 100;
				perHolder = perHolder.toFixed(1);
				percentages.push(perHolder);
			}
			
			var Survey_dataOverall = [
							{
								value: Survey_sA,
								color:"#0000FF"
							},
							{
								value : Survey_a,
								color : "#33C2FF"
							},
							{
								value : Survey_n,
								color : "#575757"
							},
							{
								value : Survey_disagree,
								color : "#FF7A7A"
							},
							{
								value : Survey_sD,
								color : "#FF0000"
							}

						]
						
			console.log(Survey_dataOverall);
			
			var Survey_cto = $("canvas#overallCanvas").get(0).getContext("2d");
			
			var label_sD = $(".sD_label");
			var label_d = $(".d_label");
			var label_n = $(".n_label");
			var label_a = $(".a_label");
			var label_sA = $(".sA_label");
			
			label_sD.text(Survey_oR[0] + " voters " + percentages[0] + " %");
			label_d.text(Survey_oR[1] + " voters " + percentages[1] + " %");
			label_n.text(Survey_oR[2] + " voters " + percentages[2] + " %");
			label_a.text(Survey_oR[3] + " voters " + percentages[3] + " %");
			label_sA.text(Survey_oR[4] + " voters " + percentages[4] + " %");
			
			var Survey_oSg = new Chart(Survey_cto).Doughnut(Survey_dataOverall);
			
}

function submitSurvey() {

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
				
		sendSurvey.done(function( Survey_response ) {
				
			generateOverallGraph( Survey_response );
				
			var Survey_yS = Number(Survey_response["you"]["youScore"]);
			var Survey_yPosition = Number(Survey_response["you"]["overall"]);
			var Survey_fS = Number(Survey_response["you"]["fordScore"]);
				
			var Survey_maxScore = 50;
			
			var Survey_fSr = Survey_maxScore - Survey_fS;
			var Survey_ySr = Survey_maxScore - Survey_yS;
						
			var Survey_dataYou = [
							{
								value: Survey_yS,
								color:"#0000FF"
							},
							{
								value : Survey_ySr,
								color : "#D9D9D9"
							}

						]
						
			var Survey_dataFord = [
							{
								value: Survey_fS,
								color:"#0000FF"
							},
							{
								value : Survey_fSr,
								color : "#D9D9D9"
							}

						]
						
			var canvases = 0;

			var cty = $("canvas#yourScoreCanvas").get(0).getContext("2d");
			var ctf = $("canvas#fordScoreCanvas").get(0).getContext("2d");
			
			var ySg = new Chart(cty).Doughnut(Survey_dataYou);
			var fSg = new Chart(ctf).Doughnut(Survey_dataFord);
			
		});//end of Survey_response

}//end of submit survey

function nextQuestion() {
	console.log("next question");
	$('input[type="radio"]').click( function() {
	
		//console.log($(this).parent().parent());
	
		if ($(this).parent().parent().is(':last-child')){
			$(this).parent().parent().removeClass("show");
			console.log("at last question");
			
			submitSurvey();
			
		} else {
			console.log("radio clicked")
			$( "ul.survey li.show" ).next("li").addClass("show");
			$(this).parent().parent().removeClass("show");
		}
	});
}