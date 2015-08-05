var soletrader = null;
var businessStructure = null;
var gst = null;
var businessName = null;
var payg = null;
var fbt = null;
var lct = null;
var ftc = null;
var wet = null;
var help

var steps = new Array(
    [],
    ["Sole Trader", "sole_trader"],
    ["Business structure", "business_structure"],
    ["Goods and Services Tax", "gst"],
    ["Business name", "business_name"],
    ["Other tax registrations", "other_tax"],
    ["Finished!", "finish"]
    );
var step = 0;
var displayStepNumber = 0;
var maxStep = 5;

function initDiscoveryPage() {
    manageState();

    $("#previous").click(function () { manageState("previous"); });
    $("#next").click(function () { manageState("next"); });
}

function initEligibilityPage() {
    applyStyle();
}

function loadQuestionHelp() {
    var templateDirectory = "templates/"
    $("#heading").html(steps[step][0]);
    $("#heading").focus();
    $("#stepNo").html(displayStepNumber);
    var percentCompleted = Math.round((displayStepNumber - 1) / (maxStep - 1) * 100 / 5) * 5;
    $("#percentCompleted").html(percentCompleted);
    if (percentCompleted == 0) {
        percentCompleted += 2;
    }
    $("#percentMeter").css('width', percentCompleted + '%');
    var d = new Date,
        dformat = [(d.getMonth() + 1),
                    d.getDate(),
                    d.getFullYear()].join('') +
                  [d.getHours(),
                    d.getMinutes(),
                    d.getSeconds()].join('');
    $("#question").load(templateDirectory + steps[step][1] + "_question.html?t=" + dformat);
    $("#helpFile").load(templateDirectory + steps[step][1] + "_help.html?t=" + dformat, function () { setTimeout(applyStyle, 0); });
}

function applyStyle() {
    $('.cd-btn').on('click', function (event) {
        var index = $("a.cd-btn").index(this);
        help.open(index);
        event.preventDefault();
        $('.cd-panel').addClass('is-visible');
    });
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            help.close();
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });

    /* Expand collapse headings config */
    help = new jQueryCollapse($(".showhide"), {
        open: function () {
            this.slideDown(150);
            $("#helpTopic").focus();
        },
        close: function () {
            this.slideUp(150);
        }
    });
}

function manageState(action) {
    if (action == "previous") {
        step--;
        displayStepNumber--;

        switch (step) {
            case 0:
                window.location.href = "eligibility.html";
                break;
            case 1:
                if ($('input[name=businessstructure]').length) {
                    businessStructure = getValueFromRadioButton("businessstructure");
                }
                else {
                    gst = getValueFromRadioButton("gst");
                }
                loadQuestionHelp();
                selectRadioOrCheckbox(soletrader, "soletrader");
                //disablePreviousButton();
                break;
            case 2:
                gst = getValueFromRadioButton("gst");
                if (soletrader == 'yes') {
                    step--;
                    //disablePreviousButton();
                }
                loadQuestionHelp();
                if (soletrader == 'yes') {
                    selectRadioOrCheckbox(soletrader, "soletrader");
                }
                else {
                    selectRadioOrCheckbox(businessStructure, "businessstructure");
                }
                break;
            case 3:
                businessName = getValueFromRadioButton("businessname");
                loadQuestionHelp();
                selectRadioOrCheckbox(gst, "gst");
                break;
            case 4:
                othertaxes = getCheckboxValues('othertax');
                payg = $.inArray("payg", othertaxes) < 0 ? "no" : "yes";
                fbt = $.inArray("fbt", othertaxes) < 0 ? "no" : "yes";
                lct = $.inArray("lct", othertaxes) < 0 ? "no" : "yes";
                ftc = $.inArray("ftc", othertaxes) < 0 ? "no" : "yes";
                wet = $.inArray("wet", othertaxes) < 0 ? "no" : "yes";
                loadQuestionHelp();
                selectRadioOrCheckbox(businessName, "businessname");
                break;
            case 5:
                loadQuestionHelp();
                if (payg == "yes") selectRadioOrCheckbox("payg", "othertax");
                if (fbt == "yes") selectRadioOrCheckbox("fbt", "othertax");
                if (lct == "yes") selectRadioOrCheckbox("lct", "othertax");
                if (ftc == "yes") selectRadioOrCheckbox("ftc", "othertax");
                if (wet == "yes") selectRadioOrCheckbox("wet", "othertax");
                $("#next").html("Next &raquo;");
                break;
        }
    }
    else {
        step++;
        displayStepNumber++;

        switch (step) {
            case 1:
                loadQuestionHelp();
                selectRadioOrCheckbox(soletrader, "soletrader");
                //disablePreviousButton();
                break;
            case 2:
                soletrader = getValueFromRadioButton("soletrader");
                maxStep = 6;
                if (soletrader == "yes") {
                    businessStructure = null;
                    step++;
                    maxStep = 5;
                }
                loadQuestionHelp();
                if (soletrader == "yes") {
                    selectRadioOrCheckbox(gst, "gst");
                }
                else {
                    selectRadioOrCheckbox(businessStructure, "businessstructure");
                }
                //enablePreviousButton();
                break;
            case 3:
                businessStructure = getValueFromRadioButton("businessstructure");
                loadQuestionHelp();
                selectRadioOrCheckbox(gst, "gst");
                break;
            case 4:
                gst = getValueFromRadioButton("gst");
                loadQuestionHelp();
                selectRadioOrCheckbox(businessName, "businessname");
                break;
            case 5:
                businessName = getValueFromRadioButton("businessname");
                loadQuestionHelp();
                if (payg == "yes") selectRadioOrCheckbox("payg", "othertax");
                if (fbt == "yes") selectRadioOrCheckbox("fbt", "othertax");
                if (lct == "yes") selectRadioOrCheckbox("lct", "othertax");
                if (ftc == "yes") selectRadioOrCheckbox("ftc", "othertax");
                if (wet == "yes") selectRadioOrCheckbox("wet", "othertax");
                break;
            case 6:
                othertaxes = getCheckboxValues('othertax');
                payg = $.inArray("payg", othertaxes) < 0 ? "no" : "yes";
                fbt = $.inArray("fbt", othertaxes) < 0 ? "no" : "yes";
                lct = $.inArray("lct", othertaxes) < 0 ? "no" : "yes";
                ftc = $.inArray("ftc", othertaxes) < 0 ? "no" : "yes";
                wet = $.inArray("wet", othertaxes) < 0 ? "no" : "yes";
                loadQuestionHelp();
                setTimeout(showResults, 350);
                $("#next").html("Start applying");
                break;
        }
    }
}

function disablePreviousButton() {
    $("#previous").attr('disablied', 'disabled');
    $("#previous").addClass('disabled');
}

function enablePreviousButton() {
    $("#previous").removeAttr("disabled");
    $("#previous").removeClass("disabled");
}

function showResults() {
    if (parseboolean(gst)) {
        $('#resultTable tr:last').after(getResult("GST", "gst", true, "", "Nil"));
    }
    if (businessStructure == "company") {
        $('#resultTable tr:last').after(getResult("Company", "company", true, "", "$500 / year"));
    }
    if (parseboolean(businessName)) {
        $('#resultTable tr:last').after(getResult("Business Name", "businessname", true, "", "$34 / year"));
    }
    if (parseboolean(payg)) {
        $('#resultTable tr:last').after(getResult("Pay as you go (PAYG)", "payg", true, "", "Nil"));
    }
    if (parseboolean(fbt)) {
        $('#resultTable tr:last').after(getResult("Fringe Benefits Tax", "fbt", true, "", "Nil"));
    }
    if (parseboolean(lct)) {
        $('#resultTable tr:last').after(getResult("Luxury Car Tax", "lct", true, "", "Nil"));
    }
    if (parseboolean(ftc)) {
        $('#resultTable tr:last').after(getResult("Fuel Tax Credits", "ftc", true, "", "Nil"));
    }
    if (parseboolean(wet)) {
        $('#resultTable tr:last').after(getResult("Wine Equalisation Tax", "wet", true, "", "Nil"));
    }
    if ((parseboolean(ftc) || parseboolean(wet)) && !parseboolean(gst)) {
        var selectedRegistration = "";
        if (parseboolean(ftc) && parseboolean(wet)) {
            selectedRegistration = "FTC and WET";
        }
        else if (parseboolean(ftc)) {
            selectedRegistration = "FTC";
        }
        else if (parseboolean(wet)) {
            selectedRegistration = "WET";
        }
        $('#resultTable tr:last').after(getResult("GST", "gst", false, "We've also checked GST because you selected <strong>yes</strong> for " + selectedRegistration + " which requires you to be registered for GST.", "Nil"));
    }
}

function selectRadioOrCheckbox(value, name) {
    console.log(value + " " +name);
    if (value != null) {
        setTimeout(function () { setValue(value, name) }, 350);
    }
}
function setValue(value, name) {
    $('input[name=' + name + '][value=' + value + ']').prop('checked', true);
}
function getValueFromRadioButton(name) {
    return $('input[name=' + name + ']:checked').val();
}
function getCheckboxValues(name) {
    var checkboxValues = [];
    $('input[name=' + name + ']:checked').map(function () {
        checkboxValues.push($(this).val());
    });

    return checkboxValues;
}
function getResult(registrationName, id, isSelected, reason, cost) {
    var result = '<tr>    <td class="choice ';
    if (isSelected) {
        result += " results-success-message";
    }
    else {
        result += " results-alert-message";
    }
    result += '"><input id="' + id + '" type="checkbox" checked="checked"></td>    <td class="registration-type';
    if (!isSelected) {
        result += " results-alert-message";
    }
    result += '"><label for="' + id + '">' + registrationName + '</label></td>    <td class="cost';
    if (!isSelected) {
        result += " results-alert-message";
    }
    result += '">' + cost + '</td>  </tr>';
    if (!isSelected) {
        result += '<tr><td class="results-alert-message" colspan="3"><span class="smaller">' + reason + '</span></td></tr>';
    }
    return result;
}

function parseboolean(value) {
    return (value == "yes") ? true : false;
}


/* Temporary function: show or hide form field for registration proto */

$(document).ready(
    function () {
        $("input[id=ind]").click(function () {
            $("#ind-questions").fadeToggle();
        });
    });

function IsValid(id) {
    if (getValueFromRadioButton(id) == undefined) {
        $("#validation-list").append("<li><a class='scroll' href='#" + id + "'>" + $("#" + id).html() + "</a>.</li>");
        $("#validation").show();

        $(".scroll").click(function (event) {
            event.preventDefault();
            var full_url = this.href;
            var parts = full_url.split("#");
            var trgt = parts[1];
            var target_offset = $("#" + trgt).offset();
            var target_top = target_offset.top;
            jQuery('html, body').animate({ scrollTop: target_top }, 1200);
        });
        return false;
    }
    return true;
}
//Eligibility
function checkEligibility() {
    $("#validation").hide();
    $("#validation-list").html("");

    var IsEmployeeValid = IsValid("employee");
    var IsOverseasValid = IsValid("overseas");
    var IsOtherValid = IsValid("other");

    if (IsEmployeeValid && IsOverseasValid && IsOtherValid) {
        var isEligibilityEmployee = parseboolean(getValueFromRadioButton("employee"));
        var isEligibilityOverseas = parseboolean(getValueFromRadioButton("overseas"));
        var isEligibilityOther = parseboolean(getValueFromRadioButton("other"));

        if (!isEligibilityEmployee && !isEligibilityOverseas && !isEligibilityOther) {
            window.location.href = "registration-discovery.html";
        }
        else {
            $('#eligibilityTest').toggle();
            $('#eligibilityResult').toggle();
            if (isEligibilityEmployee) {
                $('#eligibilityResultEmployee').show();
            }
            else {
                $('#eligibilityResultEmployee').hide();
            }
            if (isEligibilityOverseas) {
                $('#eligibilityResultOverseas').show();
            }
            else {
                $('#eligibilityResultOverseas').hide();
            }
            if (isEligibilityOther) {
                $('#eligibilityResultOther').show();
            }
            else {
                $('#eligibilityResultOther').hide();
            }
        }
    }
}

function showEligibilityTest() {
    $('#eligibilityTest').toggle();
    $('#eligibilityResult').toggle();
}