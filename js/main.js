/* Progress meter animation 


$(function() {
    $(".meter > span").each(function() {
        $(this)
            .data("origWidth", $(this).width())
            .width(0)
            .animate({
                width: $(this).data("origWidth")
            }, 1200);
    });
});
*/


/* Slide out panel */
var steps = new Array(
    ["Sole Trader", "sole_trader"], 
    ["Business structure", "business_structure"],
    ["Goods and Services Tax (GST)", "gst"],
    ["Business name", "business_name"],
    ["Other tax registrations", "other_tax"]
    );
var step = 0;
var maxStep = 5;
jQuery(document).ready(function($){
  loadQuestionHelp();

  $("#previous").click(function() { step--;loadQuestionHelp(); });
  $("#next").click(function() {step++; loadQuestionHelp(); });
});

function loadQuestionHelp()
{
  if(step < 0)
  {
    window.location.href = "home.html";
  }
  var templateDirectory = "templates/"
  $("#heading").html(steps[step][0]);
  $("#stepNo").html(step + 1);
  var percentCompleted = step / maxStep * 100;
  $("#percentCompleted").html(percentCompleted);
  if(percentCompleted == 0)
  {
    percentCompleted+= 2; 
  }
  $("#percentMeter").css('width', percentCompleted + '%');
  $("#question").load(templateDirectory + steps[step][1] + "_question.html");
  $("#helpfile").load(templateDirectory + steps[step][1] + "_help.html", function() {setTimeout(applyStyle, 0);});  
}

function applyStyle()
{
  $('.cd-btn').on('click', function(event){
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
      });
  $('.cd-panel').on('click', function(event){
    if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) { 
      $('.cd-panel').removeClass('is-visible');
      event.preventDefault();
    }
  });
  
  /* Expand collapse headings config */
  new jQueryCollapse($(".showhide"), {
    open: function() {
      this.slideDown(150);
    },
    close: function() {
      this.slideUp(150);
    }
  });
}

/* show or hide form fields */
$(document).ready(
    function(){
      $("input[name=payg]").click(function(){
          $("#tr-ftb").fadeToggle();
      });
});