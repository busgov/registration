jQuery(document).ready(function ($) {
	console.log("in");
	CloseSystemMessage();
});
function CloseSystemMessage() {
    $(".closeSystemMessage").click(function() {
        console.log("in close");
        $(".system-message").slideUp();
    });
}