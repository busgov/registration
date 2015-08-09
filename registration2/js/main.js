
/* data */

var businessStructure = {
    "name": "Business structure",
    "helpFile": "business_structure_help.html",
    "contentFile": "business_structure_question.html"
};

var activity = { "name": "Activity", "helpFile": "", "contentFile": "activity_question.html" };
var finished = { "name": "Registration summary", "helpFile": "finished_help.html", "contentFile": "finished_content.html" };

var registrations = null;

var applicationType = null;
var soleTraderName = "Sole trader";
var partnershipName = "Partnership";
var companyName = "Company";
var helpMeDecide = "Business structure - help me decide";
var help;
var fromHelpMeDecide = false;
/* Slide out panel */
var step = 0;
// var displayStepNumber = 0;
var maxStep = 5;
var calculator = new HelpMeDecideCalculator();
var isTrust = false;
/* End of data */

function initializeRegistrationOptions() {
    registrations = {
        "isGST": false,
        "isPAYG": false,
        "isFBT": false,
        "isLCT": false,
        "isFTC": false,
        "isWET": false,
        "isBusinessName": false,
        "isCompany": false,
        "isTFN": false
    };
}
function initializeApplicationType(typename) {
    isTrust = false;
    initializeRegistrationOptions();
    switch (typename) {
        case soleTraderName:
            applicationType = {
                "name": soleTraderName,
                "helpFile": "business_structure_help.html",
                "contentFile": "business_structure_question.html",
                "nameApplication": { "name": "Business name", "helpFile": "name_help.html", "contentFile": "soleTrader_name_question.html" },
                "employee": { "name": "Employees", "helpFile": "employee_help.html", "contentFile": "employee_question.html" },
                "activity": activity
            };
            break;
        case partnershipName:
            applicationType = {
                "name": partnershipName,
                "helpFile": "business_structure_help.html",
                "contentFile": "business_structure_question.html",
                "nameApplication": { "name": "Business name", "helpFile": "name_help.html", "contentFile": "partnership_name_question.html" },
                "employee": { "name": "Employees", "helpFile": "employee_help.html", "contentFile": "employee_question.html" },
                "activity": activity
            };
            break;
        case companyName:
            applicationType = {
                "name": companyName,
                "helpFile": "business_structure_help.html",
                "contentFile": "business_structure_question.html",
                "nameApplication": { "name": "Business name", "helpFile": "name_help.html", "contentFile": "company_name_question.html" },
                "employee": { "name": "Employees", "helpFile": "employee_help.html", "contentFile": "company_employee_question.html" },
                "activity": activity
            };
            break;
        case helpMeDecide:
            applicationType = {
                "name": helpMeDecide,
                "helpFile": "helpmedecide_help.html",
                "contentFile": "helpmedecide_question.html"
            };
            break;
    }
}

function loadQuestionHelp(applicationStep, callback) {
    var templateHelpDirectory = "templates/help/"
    var templateQuestionsDirectory = "templates/questions/"
    $("#heading").html(applicationStep.name);
    $("#helpTopic").html(applicationStep.name);
    $("#heading").focus();

    if (applicationStep.contentFile.length > 0) {
        $("#questions").load(templateQuestionsDirectory + applicationStep.contentFile + "?t=" + (new Date()).getTime(), function () {
            setTimeout(callback, 0);
            setTimeout(function () {
                $('.cd-btn').on('click', function (event) {
                    var index = $("a.cd-btn").index(this);
                    if (step === 5) {
                        index = $(this)[0].id;
                    }
                    help.open(index);
                    event.preventDefault();
                    $('.cd-panel').addClass('is-visible');
                });
            }, 10);
            //setTimeout(hideValidationMessages, 10)
        }
            );
    }

    if (applicationStep.helpFile.length > 0) {
        $("#helpFile").load(templateHelpDirectory + applicationStep.helpFile + "?t=" + (new Date()).getTime(), function () {
            setTimeout(applyStyle, 10);
        });
    }
}

function applyStyle() {
    $('.cd-panel').on('click', function (event) {
        if ($(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close')) {
            help.close();
            $('.cd-panel').removeClass('is-visible');
            event.preventDefault();
        }
    });
    if (step === 5) {
        showRegistrationsHepContent();
    }
    //$("#aPrint").click(function () {
    //    $.print("#help");
    //});
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
    $("#validation").hide();

    // step can not go negative
    if (step < 0) {
        return;
    }
    var goingToHelpMeDecide = applicationType != null && applicationType.name != null && applicationType.name === helpMeDecide;
    if (action == "previous") {
        step > 0 ? step-- : step = 1;

        // Determin whether it will go to help me decide
        if (fromHelpMeDecide) { // we know that it should be back to step 1 now
            step = 1;
            fromHelpMeDecide = false;
        }
        goingToHelpMeDecide = false;

        // Go back to eligibility test page
        if (step === 0) {
            window.location.href = "eligibility.html";
        }

    }
    else {
        step < 5 ? step++ : step = 5;
        // check whether user used help me decide function
        if (goingToHelpMeDecide && !fromHelpMeDecide) {
            step = 1; // user can only go to help me decide from step 1.
        }
        else if (fromHelpMeDecide) {
            step = 1;
            goingToHelpMeDecide = false;
            processHelpMeDecide();
        }
    }


    switch (step) {
        case 1: // choose business structure
            // help me decide?
            if (goingToHelpMeDecide) {
                loadQuestionHelp(applicationType, prepareHelpMeDecide);
            } else {
                loadQuestionHelp(businessStructure, prepareBusinessStructurePage);
            }
            break;
        case 2:
            // Business name
            loadQuestionHelp(applicationType.nameApplication, prepareNamePage);
            break;
        case 3: // Employee & FBT
            loadQuestionHelp(applicationType.employee, prepareEmployeePage);
            break;
        case 4:
            loadQuestionHelp(applicationType.activity, prepareActivityPage);
            break;
        case 5:
            // based on user selection, generated the registrations form (those user needs to applied will be ticked)
            loadQuestionHelp(finished, showResults);
            break;
    }
    if (step >= 0 && step <= 5) {
        calculateCompletion();
        $("#stepNo").html(step);
        if (step === 5) {
            $("#next").html("Start applying");
        }
        else if ($("#next").html() != "Next &raquo;") {
            $("#next").html("Next &raquo;");
        }
    }
}

// callbacks

// parepare the business structure page ---- > step 1
function prepareBusinessStructurePage() {

    if (applicationType != null) {


        if (!fromHelpMeDecide && applicationType.name === soleTraderName) {
            $("#structure-sole").prop('checked', true);
        }
        else if (!fromHelpMeDecide && applicationType.name === partnershipName) {
            $("#structure-partnership").prop('checked', true);
        }
        else if (!fromHelpMeDecide && applicationType.name === companyName) {
            $("#structure-company").prop('checked', true);
        }
        else if (!fromHelpMeDecide && applicationType.name === helpMeDecide) {
            $("#structure-not-sure").prop('checked', true);
        }

        if (fromHelpMeDecide) {
            $("#decidedStructure").html(applicationType.name);
            $("#helpMeDecideResultMessage").show();
            $("#businessStructureTip").hide();
            fromHelpMeDecide = false;
        }
    }

    $("#structure-sole").on('click', function () {
        initializeApplicationType(soleTraderName);
    });

    $("#structure-partnership").on('click', function () {
        initializeApplicationType(partnershipName);
        registrations.isTFN = true;
    });

    $("#structure-company").on('click', function () {
        initializeApplicationType(companyName);
        registrations.isCompany = true;
        registrations.isTFN = true;
    });

    $("#structure-trust").on('click', function () {
        isTrust = true;
    });

    $("#structure-not-sure").on('click', function () {
        initializeApplicationType(helpMeDecide);
    });


}

function prepareHelpMeDecide() {

    // how many owners?
    $("#radioHowManyOwners1").click(function () {
        calculator.manyOwners = 1;
    });

    $("#radioHowManyOwners2").click(function () {
        calculator.manyOwners = 2;
    });

    // admin sensitive
    $("#radioAdmin1").click(function () {
        calculator.adminSensitive = 1;
    });

    $("#radioAdmin2").click(function () {
        calculator.adminSensitive = 2;
    });

    // Are you participating in an industry that is vulnerable to lawsuits?
    $("#radioVulnerableLawsuits1").click(function () {
        calculator.lawSuit = 1;
    });
    $("#radioVulnerableLawsuits2").click(function () {
        calculator.lawSuit = 2;
    });

    // Do you want full control over your business decisions?
    $("#radioFullControl1").click(function () {
        calculator.fullControl = 1;
    });

    $("#radioFullControl2").click(function () {
        calculator.fullControl = 2;
    });

    //Do you and your partners want full control over your business decisions?
    $("#radioWantPartner1").click(
    function () {
        calculator.hasPartner = 1;
    });
    $("#radioWantPartner2").click(
    function () {
        calculator.hasPartner = 2;
    });

    // Do you want to set up a separate entity for your business?
    $("#radioSeparateEntity1").click(function () {
        calculator.separateEntity = 1;
    });
    $("#radioSeparateEntity2").click(function () {
        calculator.separateEntity = 2;
    });

    fromHelpMeDecide = true
}
// prepare the Name selection page.  ---> step 2
function prepareNamePage() {
    if (applicationType != null) {
        if (applicationType.businessName1 != undefined && applicationType.businessName1) {
            $("#name1").prop('checked', true);
        }
        else if (applicationType.businessName2 != undefined && applicationType.businessName2) {
            $("#name2").prop('checked', true);
        }
    }
    $("#name1").click(function () {
        applicationType.businessName1 = true;
        applicationType.businessName2 = false;
        registrations.isBusinessName = false;
    });
    $("#name2").click(function () {
        applicationType.businessName2 = true;
        applicationType.businessName1 = false;
        registrations.isBusinessName = true;
    });
}

// prepare the Employee page
function prepareEmployeePage() {
    // company stream
    if (applicationType.name === companyName) {
        // check whether user selected benefit to director or not
        if (applicationType.fringeBenefitDirector != undefined) {
            if (applicationType.fringeBenefitDirector) {
                $("#fringeBenefitsDirectorYes").prop('checked', true);
            }
            else {
                $("#fringeBenefitsDirectorNo").prop('checked', true);
                $('#companyHasEmployee').show();
            }
        }

        // check which option user has sleected
        if ($('#companyHasEmployee').is(':visible')) {
            if (applicationType.hasEmployee != undefined) {
                if (applicationType.hasEmployee) {
                    $("#companyEmployeeYes").prop('checked', true);
                    $('#companyFringeBenefitsToEmployee').show();
                }
                else {
                    $("#companyEmployeeNo").prop('checked', true);
                }
            }
        }

        // check whether user selected benefits to employee or not.
        if ($('#companyFringeBenefitsToEmployee').is(':visible')) {
            if (applicationType.fringeBenefit != undefined) {
                $("#fringeBenefitsEmployeeYes").prop('checked', true);
            }
            else {
                $("#fringeBenefitsEmployeeNo").prop('checked', true);
            }
        }

        // company benefit director
        $("#fringeBenefitsDirectorYes").click(function () {
            hideElementAndClear("companyHasEmployee");
            hideElementAndClear("companyFringeBenefitsToEmployee");
            applicationType.fringeBenefitDirector = true;
            registrations.isFBT = true;
            // registrations.isPAYG = true; // needs to be confirmed
        });

        $("#fringeBenefitsDirectorNo").click(function () {
            $("#companyHasEmployee").show(100);
            applicationType.fringeBenefitDirector = false;
            registrations.isFBT = false;
        });

        // company employee
        $("#companyEmployeeYes").click(function () {
            $("#companyFringeBenefitsToEmployee").show(100);
            applicationType.hasEmployee = true;
            registrations.isPAYG = true;
        });

        $("#companyEmployeeNo").click(function () {
            hideElementAndClear("companyFringeBenefitsToEmployee");
            applicationType.hasEmployee = false;
            applicationType.fringeBenefit = false;
            registrations.isPAYG = false;
        });

        // Company fringe benefits
        $("#fringeBenefitsEmployeeYes").click(function () {
            applicationType.fringeBenefit = true;
            registrations.isFBT = true;
        });

        $("#fringeBenefitsEmployeeNo").click(function () {
            applicationType.fringeBenefit = false;
            registrations.isFBT = false;
        });
    }
    else {
        // sole trader or partnership
        if (applicationType.hasEmployee != undefined) {
            if (applicationType.hasEmployee) {
                $("#employeeYes").prop('checked', true);
                $("#fringeBenefit").show();
            }
            else {
                $("#employeeNo").prop('checked', true);
            }
        }
        else {
            $("#fringeBenefit").hide();
        }
        if ($("#fringeBenefit").is(':visible')) {
            if (applicationType.fringeBenefit != undefined) {
                if (applicationType.fringeBenefit) {
                    $("#fringeBenefitYes").prop('checked', true);
                }
                else {
                    $("#fringeBenefitNo").prop('checked', true);
                }
            }
        }
        // employee
        $("#employeeYes").click(function () {
            $("#fringeBenefit").show(100);
            applicationType.hasEmployee = true;
            registrations.isPAYG = true;
        });

        $("#employeeNo").click(function () {
            hideElementAndClear("fringeBenefit");
            applicationType.hasEmployee = false;
            applicationType.fringeBenefit = false;
            registrations.isPAYG = false;
        });
        // fringe benefits
        $("#fringeBenefitYes").click(function () {
            applicationType.fringeBenefit = true;
            registrations.isFBT = true;
        });

        $("#fringeBenefitNo").click(function () {
            applicationType.fringeBenefit = false;
            registrations.isFBT = false;
        });
    }
}

// prepare the activity page
function prepareActivityPage() {
    // turnover 75k and over
    $("#ckTurnover75k").click(function () {
        applicationType.turnOver75k = $("#ckTurnover75k").prop('checked');
    });
    if (applicationType.turnOver75k != undefined) {
        setCheckBox("#ckTurnover75k", applicationType.turnOver75k);
    }

    // taxi
    $("#ckTaxi").click(function () {
        applicationType.taxi = $("#ckTaxi").prop('checked');
    });

    if (applicationType.taxi != undefined) {
        setCheckBox("#ckTaxi", applicationType.taxi);
    }

    // limo
    $("#ckLimousine").click(function () {
        applicationType.limo = $("#ckLimousine").prop('checked');
    });

    if (applicationType.limo != undefined) {
        setCheckBox("#ckLimousine", applicationType.limo);
    }

    // wine
    $("#ckDealInWine").click(function () {
        registrations.isWET = $("#ckDealInWine").prop('checked');
    });

    if (applicationType.wine != undefined) {
        setCheckBox("#ckDealInWine", applicationType.wine);
    }

    // fuel
    $("#ckUseFule").click(function () {
        registrations.isFTC = $("#ckUseFule").prop('checked');
    });

    if (applicationType.fuel != undefined) {
        setCheckBox("#ckUseFule", applicationType.fuel);
    }

    // luxury cars
    $("#ckLuxry").click(function () {
        registrations.isLTC = $("#ckLuxry").prop('checked');
    });

    if (applicationType.luxuryCar != undefined) {
        setCheckBox("#ckLuxry", applicationType.luxuryCar);
    }
}

// prepare the finished page
function showResults() {
    var needGST = (parseboolean(applicationType.taxi) || parseboolean(applicationType.turnOver75k) || parseboolean(applicationType.limo) || parseboolean(applicationType.isFTC) || parseboolean(applicationType.isLCT));
    if (needGST) {
        $('#resultTable tr:last').after(getResult(" Goods &amp; Services Tax (GST)", "gst", true, "", "No cost", 1));
    }
    if (parseboolean(registrations.isTFN)) {
        $('#resultTable tr:last').after(getResult("Tax File Number (TFN)", "tfn", true, "", "No cost", 2));
    }
    if (parseboolean(registrations.isCompany)) {
        $('#resultTable tr:last').after(getResult("Company", "company", true, "", "$500 per year", 3));
    }
    if (parseboolean(registrations.isBusinessName)) {
        $('#resultTable tr:last').after(getResult("Business Name", "businessName", true, "", "$34 per year", 4));
    }
    if (parseboolean(registrations.isPAYG)) {
        $('#resultTable tr:last').after(getResult("Pay as you go (PAYG)", "payg", true, "", "No cost", 5));
    }
    if (parseboolean(registrations.isFBT)) {
        $('#resultTable tr:last').after(getResult("Fringe Benefits Tax", "fbt", true, "", "No cost", 6));
    }
    if (parseboolean(registrations.isLTC)) {
        $('#resultTable tr:last').after(getResult("Luxury Car Tax", "lct", true, "", "No cost", 7));
    }
    if (parseboolean(registrations.isFTC)) {
        $('#resultTable tr:last').after(getResult("Fuel Tax Credits", "ftc", true, "", "No cost", 8));
    }
    if (needGST && parseboolean(registrations.isWET)) {
        $('#resultTable tr:last').after(getResult("Wine Equalisation Tax", "wet", true, "", "No cost", 9));
    }
    if (!needGST) {
        $("#gstRecommend").show();
    }
}

// show the help content for selected tax types
function showRegistrationsHepContent() {
    var needGST = (parseboolean(applicationType.taxi) || parseboolean(applicationType.turnOver75k) || parseboolean(applicationType.limo) || parseboolean(applicationType.isFTC) || parseboolean(applicationType.isLCT));
    if (needGST) {
        $('#gstHelp').show();
        $('#gstHelpHeader').show();

        // following code to switch on some help content for gst help
        if (parseboolean(applicationType.taxi)) {
            $("#liTaxi").show();
        }

        if (parseboolean(applicationType.turnOver75k)) {
            $("#liMoreThan75k").show();
        }

        if (parseboolean(applicationType.limo)) {
            $("#liLimo").show();
        }

        if (parseboolean(applicationType.isFTC)) {
            $("#liUseFule").show();
        }

        if (parseboolean(applicationType.isLCT)) {
            $("#liLuxuryCar").show();
        }
    }
    if (parseboolean(registrations.isTFN)) {
        $("#tfnHelp").show();
        $("#tfnHelpHeader").show();
        $("#helpBusinessStructureSelected").html(applicationType.name);
    }
    if (parseboolean(registrations.isCompany)) {
        $("#companyHelp").show();
        $("#companyHelpHeader").show();
    }
    if (parseboolean(registrations.isBusinessName)) {
        $("#businessNameHelp").show();
        $("#businessNameHelpHeader").show();
        if (applicationType.name === soleTraderName) {
            $("#yourOwnNameInHelp").show();
            $("#yourOwnNameInHelp1").show();
        }
        else if (applicationType.name === companyName) {
            $("#theCompanyNameInHelp1").show();
            $("#theCompanyNameInHelp").show();
        } else if (applicationType.name === partnershipName) {
            $("#yourPartnersNameInHelp").show();
            $("#yourPartnersNameInHelp1").show();
        }
    }

    if (parseboolean(registrations.isPAYG)) {
        $("#paygHelp").show();
        $("#paygHelpHeader").show();
        if (parseboolean(registrations.isCompany)) {
            $("#divCompanyPAYG").show();
            if (parseboolean(applicationType.hasEmployee)) {
                $("#paygCompanyHasEmployee").show();
            }
            else {
                $("#paygCompanyNoEmployee").show();
            }
        }
        else {
            $("#divNoneCompanyPAYG").show();
        }
    }
    if (parseboolean(registrations.isFBT)) {
        $('#fbtHelp').show();
        $('#fbtHelpHeader').show();

    }
    if (parseboolean(registrations.isLTC)) {
        $('#lctHelp').show();
        $('#lctHelpHeader').show();
    }
    if (parseboolean(registrations.isFTC)) {
        $('#ftcHelp').show();
        $('#ftcHelpHeader').show();
    }
    if (needGST && parseboolean(registrations.isWET)) {
        $('#wetHelp').show();
        $('#wetHelpHeader').show();
    }
    if (!needGST) {
        $('#gstHelp1').show();
        $('#gstHelp1Header').show();
    }
}

// end of callbacks

/* Discovery Page*/
function initDiscoveryPage() {
    manageState();
    $("#previous").click(function () {
        $("#previous").blur();
        manageState("previous");
    });
    $("#next").click(function () {
        if (isTrust) {
            window.location.href = "trust.html";
        }
        $("#next").blur();
        if (!ifAnythingSelected("questions") && step != 4) { // ignore step 4
            $("#validation").show();
            $("#heading").focus();
            $(".scroll").click(function (event) {
                event.preventDefault();
                var full_url = this.href;
                var parts = full_url.split("#");
                var trgt = parts[1];
                var target_offset = $("#" + trgt).offset();
                var target_top = target_offset.top;
                jQuery('html, body').animate({
                    scrollTop: target_top
                }, 1200);
            });
            return;
        }
        if (step > 5) return;
        manageState("next");
    });
}
/* End of Discovery Page */


// Utilities
function calculateCompletion() {
    var percentCompleted = Math.round((step - 1) / (maxStep - 1) * 100 / 5) * 5;
    $("#percentCompleted").html(percentCompleted);
    if (percentCompleted == 0) {
        percentCompleted += 2;
    }
    $("#percentMeter").css('width', percentCompleted + '%');
}



function selectRadioButton(value, name) {
    if (value != null) {
        setTimeout(function () {
            setValue(value, name)
        }, 50);
    }
}

function setCheckBox(id, isChecked) {
    $(id).prop('checked', isChecked);
}

function hideElementAndClear(elementId) {
    $('#' + elementId).hide(100);
    $('#' + elementId + ' :radio').each(function () {
        $(this).prop('checked', false);
    });
}

function setValue(value, name) {
    $('input[name=' + name + '][value=' + value + ']').prop('checked', true);
}


function getResult(registrationName, id, isSelected, reason, cost, helpId) {
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
    result += '">' + cost + '</td>  <td class="help"><span class="form-help"><a href="#help-structure" id="' + helpId + '" class="cd-btn"><img src="img/ico-help-form.png" alt="" /><span class="form-help-text">Field help</span></a></span></td></tr>';
    if (!isSelected) {
        result += '<tr><td class="results-alert-message" colspan="3"><span class="smaller">' + reason + '</span></td></tr>';
    }
    return result;
}

function parseboolean(value) {
    return (value != undefined && value);
}

function processHelpMeDecide() {
    var result = calculator.calculateWeight();
    // decide which one to go
    if (result === "company") {
        initializeApplicationType(companyName);
    }
    else if (result === "partnership") {
        initializeApplicationType(partnershipName);
    }
    else if (result === "soletrader") {
        initializeApplicationType(soleTraderName);
    }
    calculator = new HelpMeDecideCalculator();
}


function ifAnythingSelected(containerId) {
    var ifUserInputCount = 0;
    $("#" + containerId + " :radio").each(function () {
        if ($(this).is(":visible")) {
            var ifUserInput = $(this).prop("checked");
            if (ifUserInput) {
                ifUserInputCount++;
            }
        }
    });

    //$("#" + containerId + " :checkbox").each(function () {
    //    if ($(this).is(":visible")) {
    //        var ifUserInput = $(this).prop("checked");
    //        if (ifUserInput) {
    //            ifUserInputCount++;
    //        }
    //    }
    //});
    return ifUserInputCount > 0;
}

function hideValidationMessages() {
    $('input:radio').click(
                          function () {
                              $("#validation").hide(150);
                          }
      );
}

function returnToGivenStep(stepNumber) {
    step = stepNumber;
    manageState('previous');
    return false;
}

function printHelp() {

    $('#help').printThis({
        importCSS: false,
        //printContainer: true,
        //debug: true,
        loadCSS: [window.location.protocol + '//' + location.host + "/registration2/css/help.css", ]
    });

    return false;
}
// End Utilities