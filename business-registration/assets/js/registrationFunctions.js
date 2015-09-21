
function initialiseRegistrationCollapse(speed, openTheFristSection) {
    if (speed === undefined) {
        speed = 150;
    }

    var section = null;
    section = new jQueryCollapse($(".sub-section-container"), {
        open: function () {
            if (!$(this).is(":visible")) {
                $(".sub-section-open").removeClass('sub-section-open');
                this.slideDown(speed);
                var index = $("div.sub-section-content").index(this);
                section.closeOther(index); // close all other sections
                $(this).parent().addClass("sub-section-open");
                $("h2:first").focus();

                // scroll to top if the page is super long

                var targetTop = $(this).parent().offset().top;
                jQuery('html, body').animate({
                    scrollTop: targetTop
                }, 1200);
            }
        },
        close: function () {
            if ($(this).is(":visible")) {
                $(this).parent().removeClass("sub-section-open");
                this.slideUp(speed);
            }
        }
    });
    if (openTheFristSection) {
        section.sections[0].open(true);
    }
    $("a:contains('Next')").click(function () {
        $(this).closest(".sub-section-content").slideUp("", function () {
            $(".sub-section-open").removeClass("sub-section-open");
            var index = $("div.sub-section-content").index(this);
            section.close();
            section.open(index + 1);
        });
    });
    return section;
}

function toggleElementAndClear(elementId) {
    if ($("#" + elementId).is(":visible")) {
        $('#' + elementId).slideUp();
        $('#' + elementId + ' :radio').each(function () {
            $(this).prop('checked', false);
        });
        $('#' + elementId + " :input").each(function () {
            $(this).val("");
        });
    } else {
        $('#' + elementId).slideDown();
    }
    
}