/* Progress meter animation */

/*
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

jQuery(document).ready(function($){
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


/* show or hide form fields */

$(document).ready(
    function(){
      $("input[name=payg]").click(function(){
          $("#tr-ftb").fadeToggle();
      });
});