jQuery(document).ready(function ($) {
    //console.log("in");
    CloseSystemMessage();
});

function CloseSystemMessage() {
    $(".closeSystemMessage").click(function () {
        console.log("in close");
        $(".dashboard-message").slideUp();
        $(".system-message").slideUp();
    });
}


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

function clearElement(element, classNameToBeHidden) {
    $(element).children().each(function () {
        $(this).find("input, select, textarea").not("input[type=checkbox], input[type=radio], input[type=button], input[type=submit]").val("");
        $(this).find("input[type=checkbox], input[type=radio]").prop("checked", false);
        if (classNameToBeHidden !== undefined && classNameToBeHidden.length > 0) {
            $(classNameToBeHidden).hide();
        }
    });
}

function loadHelpContent(url) {
    $("#helpFile").load(url + "?t=" + (new Date()).getTime(), function () {
        setTimeout(initHelp, 10);
    });    
}

function initHelp() {
    /* Expand collapse headings config */
    var help = new jQueryCollapse($("#help").find(".showhide"), {
        open: function () {
            this.slideDown(150);
            $("#helpTopic").focus();
        },
        close: function () {
            this.slideUp(150);
        }
    });
    $("#help").find('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            help.close();
            $("#help").find('.cd-panel').removeClass('is-visible');
            event.preventDefault();
            $('#settings').toggle();
        }
    });
    $('.cd-btn').on('click', function (event) {
        var index = $("a.cd-btn").index(this);
        help.open(index);
        event.preventDefault();
        $("#help").find('.cd-panel').addClass('is-visible');
        $('#settings').toggle();
    });
}

function initSaveForLater() {
    $("#saveForLater").load("save-for-later-content.html?t=" + (new Date()).getTime(), function () {
        setTimeout(function() {
            var saveForLater = new jQueryCollapse($("#saveForLater").find(".saveforlater"), {
                open: function () {
                    this.slideDown(150);
                },
                close: function () {
                    this.slideUp(150);
                }
            });
            $("#saveForLater").find('.cd-panel').on('click', function (event) {
                if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ||
                    $(event.target).is('#save-cancel') || $(event.target).is('#save-save')) {
                    saveForLater.close();
                    $("#saveForLater").find('.cd-panel').removeClass('is-visible');
                    event.preventDefault();
                    $('#settings').toggle();
                }
            });
            $('.btn-save').on('click', function (event) {
                saveForLater.open();
                event.preventDefault();
                $('#settings').toggle();
                $("#saveForLater").find('.cd-panel').addClass('is-visible');$("#saveForLater").find('.cd-panel').addClass('is-visible');
            });
        }, "10");
    });    
}

function initApplicationOptions() {
    $("#applicationOptions").load("application-options-content.html?t=" + (new Date()).getTime(), function () {
        setTimeout(function() {
            var applicationOptions = new jQueryCollapse($("#applicationOptions").find(".applicationoptions"), {
                open: function () {
                    this.slideDown(150);
                },
                close: function () {
                    this.slideUp(150);
                }
            });
            $("#applicationOptions").find('.cd-panel').on('click', function (event) {
                if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
                    applicationOptions.close();
                    $("#applicationOptions").find('.cd-panel').removeClass('is-visible');
                    event.preventDefault();
                    $('#settings').toggle();
                }
            });
            $('.btn-options').on('click', function (event) {
                applicationOptions.open();
                event.preventDefault();
                $('#settings').toggle();
                $("#applicationOptions").find('.cd-panel').addClass('is-visible');
            });
        }, "10");
    });    
}

function GetCheckedItems(elementId) {
    var checkedCount = 0;
    elementId = (elementId.indexOf("#") >= 0) ? elementId : "#" + elementId;
    $(elementId).find(":checkbox").each(function (index, item) {
        if ($(item).prop("checked")) {
            checkedCount++;
        }
    });

    $(elementId).find(":radio").each(function (index, item) {
        if ($(item).prop("checked")) {
            checkedCount++;
        }
    });
    return checkedCount;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function navigationWithinPage() {
    $(".next").click(function (event) {
        // get the index of current button in whole list of buttons with class '.next'
        var index = $(".next").index(this);
        $.each($(".sub-section-container"), function (i, item) {
            if (index === i) {
                $(item).find("div").first().slideUp("slow", function () {
                    $(item).removeClass("sub-section-open").addClass("sub-section-done"); // add class for your need.
                    
                    setTimeout(function(){
                        $(item).next(".sub-section-container").find("div").first().slideDown("slow", 
                            function () {
                            $(item).addClass("sub-section-open").addClass("");
                            });
                            },
                            100); // add class for your need.;
                });

            }
        });

    });

    $(".previous").click(function () {
        // get the index of current button in whole list of buttons with class '.next'
        var index = $(".previous").index(this);
        $.each($(".sub-section-container"), function (i, item) {
            if (index === i) {
                $(item).find("div").first().slideDown("", function () {
                    $(item).addClass("sub-section-open").addClass(""); // add class for your need.
                    $(item).next(".sub-section-container").find("div").first().slideUp("", 
                        function () {
                                     $(item).removeClass("sub-section-open").addClass(""); // add class for your need.
                                 });
                });
            }
            
        });

    })
}


/*
* jQuery Dropdown: A simple dropdown plugin
*
* Contribute: https://github.com/claviska/jquery-dropdown
*
* @license: MIT license: http://opensource.org/licenses/MIT
*
*/
jQuery && function ($) { function t(t, e) { var n = t ? $(this) : e, d = $(n.attr("data-jq-dropdown")), a = n.hasClass("jq-dropdown-open"); if (t) { if ($(t.target).hasClass("jq-dropdown-ignore")) return; t.preventDefault(), t.stopPropagation() } else if (n !== e.target && $(e.target).hasClass("jq-dropdown-ignore")) return; o(), a || n.hasClass("jq-dropdown-disabled") || (n.addClass("jq-dropdown-open"), d.data("jq-dropdown-trigger", n).show(), r(), d.trigger("show", { jqDropdown: d, trigger: n })) } function o(t) { var o = t ? $(t.target).parents().addBack() : null; if (o && o.is(".jq-dropdown")) { if (!o.is(".jq-dropdown-menu")) return; if (!o.is("A")) return } $(document).find(".jq-dropdown:visible").each(function () { var t = $(this); t.hide().removeData("jq-dropdown-trigger").trigger("hide", { jqDropdown: t }) }), $(document).find(".jq-dropdown-open").removeClass("jq-dropdown-open") } function r() { var t = $(".jq-dropdown:visible").eq(0), o = t.data("jq-dropdown-trigger"), r = o ? parseInt(o.attr("data-horizontal-offset") || 0, 10) : null, e = o ? parseInt(o.attr("data-vertical-offset") || 0, 10) : null; 0 !== t.length && o && t.css(t.hasClass("jq-dropdown-relative") ? { left: t.hasClass("jq-dropdown-anchor-right") ? o.position().left - (t.outerWidth(!0) - o.outerWidth(!0)) - parseInt(o.css("margin-right"), 10) + r : o.position().left + parseInt(o.css("margin-left"), 10) + r, top: o.position().top + o.outerHeight(!0) - parseInt(o.css("margin-top"), 10) + e } : { left: t.hasClass("jq-dropdown-anchor-right") ? o.offset().left - (t.outerWidth() - o.outerWidth()) + r : o.offset().left + r, top: o.offset().top + o.outerHeight() + e }) } $.extend($.fn, { jqDropdown: function (r, e) { switch (r) { case "show": return t(null, $(this)), $(this); case "hide": return o(), $(this); case "attach": return $(this).attr("data-jq-dropdown", e); case "detach": return o(), $(this).removeAttr("data-jq-dropdown"); case "disable": return $(this).addClass("jq-dropdown-disabled"); case "enable": return o(), $(this).removeClass("jq-dropdown-disabled") } } }), $(document).on("click.jq-dropdown", "[data-jq-dropdown]", t), $(document).on("click.jq-dropdown", o), $(window).on("resize", r) }(jQuery);
