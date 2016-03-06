
/* data */

var businessStructure = {
    "name": "Business structure",
    "helpFile": "business_structure_help.html",
    "contentFile": "business_structure_question.html"
};

var activity = { "name": "Activity", "helpFile": "activity_help.html", "contentFile": "activity_question.html" };
var finished = { "name": "Registration summary", "helpFile": "finished_help.html", "contentFile": "finished_content.html" };
var actions = { "eligibilityStep": "eligibility", "businessStructureStep": "businessStructure", "businessNameStep": "name", "employeeStep": "employee", "activityStep": "activity", "finishedStep": "finished", "helpMeDecideStep": "helpMeDecide", "helpMeDecideResultStep": "helpMeDecideResultStep" }

var helpMeDecide = {
    "name": "Business structure - help me decide",
    "helpFile": "helpmedecide_question_help.html",
    "contentFile": "helpmedecide_question.html",
    "helpMeDecideResult": {
        "name": "Business structure",
        "helpFile": "helpmedecide_result_help.html",
        "contentFile": "helpmedecide_result_content.html"
    }
};


var registrations = null;

var applicationType = null;
var soleTraderName = "Sole trader";
var partnershipName = "Partnership";
var companyName = "Company";

var previousAction = "";
var nextAction = "";

var help;
var step = 0;
var maxStep = 5;
var calculator = new HelpMeDecideCalculator();
var isTrust = false;
var isHelpMeDecidUsed = false;
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
    }
}

function loadQuestionHelp(applicationStep, callback) {
    var templateHelpDirectory = "../templates/help/";
    var templateQuestionsDirectory = "../templates/questions/";
    $("#heading").html(applicationStep.name);
    $("#helpTopic").html("Help topics");
    //$("#heading").focus();

    if (applicationStep.contentFile.length > 0) {
        $("#questions").load(templateQuestionsDirectory + applicationStep.contentFile + "?t=" + (new Date()).getTime(), function () {
            setTimeout(callback, 0);
            setTimeout(function () {
                $('.cd-btn').on('click', function (event) {
                    var index = $("a.cd-btn").index(this);
                    // this is for registrations help content
                    if (applicationStep.name === "Registration summary") {
                        index = $(this)[0].id;
                    }
                    help.open(index);
                    event.preventDefault();
                    $('.cd-panel').addClass('is-visible');
                    $('#settings').toggle();
                });
            }, 10);
        });
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
            $('#settings').toggle();
            event.preventDefault();
        }
    });
    if (step === 5) {
        showRegistrationsHepContent();
    }

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
    if ($("#next").html() !== "Next") {
        $("#next").html("Next");
    }
    switch (action) {
        case actions.eligibilityStep:
            window.location = "eligibility.html";
            break;
        case actions.businessStructureStep: // choose business structure
            loadQuestionHelp(businessStructure, prepareBusinessStructurePage);
            break;
        case actions.helpMeDecideStep:
            loadQuestionHelp(helpMeDecide, prepareHelpMeDecide);
            break;
        case actions.helpMeDecideResultStep:
            loadQuestionHelp(helpMeDecide.helpMeDecideResult, prepareHelpMeDecideResult);
            break;
        case actions.businessNameStep:
            loadQuestionHelp(applicationType.nameApplication, prepareNamePage);
            break;
        case actions.employeeStep:
            loadQuestionHelp(applicationType.employee, prepareEmployeePage);
            break;
        case actions.activityStep:
            loadQuestionHelp(applicationType.activity, prepareActivityPage);
            $("#next").html("Next");
            break;
        case actions.finishedStep:
            // based on user selection, generated the registrations form (those user needs to applied will be ticked)
            loadQuestionHelp(finished, showResults);
            $("#next").html("Start applying");
            break;
    }
}

// callbacks

// prepare the business structure page ---- > step 1
function prepareBusinessStructurePage() {
    // make sure the calculation is correct.
    step = 1;
    calculateCompletion();
    previousAction = actions.eligibilityStep;
    nextAction = actions.businessNameStep;

    if (applicationType != null) {
        if (applicationType.name === soleTraderName) {
            $("#structure-sole").prop('checked', true);
        }
        else if (applicationType.name === partnershipName) {
            $("#structure-partnership").prop('checked', true);
        }
        else if (applicationType.name === companyName) {
            $("#structure-company").prop('checked', true);
        }
    }

    if (isHelpMeDecidUsed) {
        $("#structure-not-sure").prop('checked', true);
        nextAction = actions.helpMeDecideStep;
    }

    $("#structure-sole").on('click', function () {
        initializeApplicationType(soleTraderName);
        isHelpMeDecidUsed = false;
        nextAction = actions.businessNameStep;
        calculator = new HelpMeDecideCalculator();
    });

    $("#structure-partnership").on('click', function () {
        initializeApplicationType(partnershipName);
        registrations.isTFN = true;
        isHelpMeDecidUsed = false;
        calculator = new HelpMeDecideCalculator();
        nextAction = actions.businessNameStep;
    });

    $("#structure-company").on('click', function () {
        initializeApplicationType(companyName);
        registrations.isCompany = true;
        registrations.isTFN = true;
        isHelpMeDecidUsed = false;
        calculator = new HelpMeDecideCalculator();
        nextAction = actions.businessNameStep;
    });

    $("#structure-trust").on('click', function () {
        isHelpMeDecidUsed = false;
        calculator = new HelpMeDecideCalculator();
        isTrust = true;
    });

    $("#structure-not-sure").on('click', function () {
        nextAction = actions.helpMeDecideStep;
        isHelpMeDecidUsed = true;
        isTrust = false;
    });
}

function prepareHelpMeDecide() {
    // make sure the calculation is correct.
    step = 1;
    calculateCompletion();
    previousAction = actions.businessStructureStep;
    nextAction = actions.helpMeDecideResultStep;
    isTrust = false;

    // How many owners will your business have?
    $("#radioHowManyOwners1").click(function () {
        calculator.manyOwners = 1;
        hideElementAndClear("divExtraQuestionsForHowManyOwners");
        hideElementAndClear("divExtraQuestionsForHoldAssets");
    });

    $("#radioHowManyOwners2").click(function () {
        calculator.manyOwners = 2;
        $("#divExtraQuestionsForHowManyOwners").show();
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioHowManyOwners1"), $("#radioHowManyOwners2"), calculator.manyOwners)

    // Will you hold and control an asset for the benefit of others?
    $("#radioSeparatePersonalAsset1").click(function () {
        calculator.separatePersonalAsset = 1;
        $("#helpMeDecideQ3Help").show();
        $("#helpMeDecideQ3HelpHeader").show();
        hideElementAndClear("divExtraQuestionsForHowManyOwners");
        hideElementAndClear("divExtraQuestionsForHoldAssets");
        /*$("#divExtraQuestions").show(150);*/
        isTrust = true;
    });

    $("#radioSeparatePersonalAsset2").click(function () {
        calculator.separatePersonalAsset = 2;
        $("#helpMeDecideQ3Help").hide();
        $("#helpMeDecideQ3HelpHeader").hide();
        $("#divExtraQuestionsForHoldAssets").show();
        calculator.businessLossReduceTax = 0;
        calculator.mostImportant = 0;
        calculator.planToSell = 0;
        isTrust = false;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioSeparatePersonalAsset1"), $("#radioSeparatePersonalAsset2"), calculator.separatePersonalAsset)
    if (isEqual(calculator.separatePersonalAsset, 1)) {
        /*$("#divExtraQuestions").show();*/
        $("#helpMeDecideQ3Help").show();
        $("#helpMeDecideQ3HelpHeader").show();
    }
    // Do you want to use any business losses to reduce tax on future profits?
    $("#radioBusinessLossReduceTax1").click(function () {
        calculator.businessLossReduceTax = 1;
    });
    $("#radioBusinessLossReduceTax2").click(function () {
        calculator.businessLossReduceTax = 2;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioBusinessLossReduceTax1"), $("#radioBusinessLossReduceTax2"), calculator.businessLossReduceTax)

    // What is most important for your business?
    $("#radioMostImportant1").click(function () {
        calculator.mostImportant = 1;
    });

    $("#radioMostImportant2").click(function () {
        calculator.mostImportant = 2;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioMostImportant1"), $("#radioMostImportant2"), calculator.mostImportant)

    // Do you plan to you sell your business or pass it on to someone?
    $("#radioPlanToSellYourBusiness1").click(
    function () {
        calculator.planToSell = 1;
    });
    $("#radioPlanToSellYourBusiness2").click(
    function () {
        calculator.planToSell = 2;
    });
    resumeRadioButtonStateOnHelpMeDecidePage($("#radioPlanToSellYourBusiness1"), $("#radioPlanToSellYourBusiness2"), calculator.planToSell)

}

// prepare help me decide result page
function prepareHelpMeDecideResult() {
    // make sure the calculation is correct.
    step = 1;
    calculateCompletion();
    previousAction = actions.helpMeDecideStep;
    nextAction = actions.businessNameStep;
    isHelpMeDecidUsed = true;
    // based on calculator
    var result = calculator.calculateWeight();
    // decide which one to go
    if (result === "company") {
        initializeApplicationType(companyName);
        registrations.isCompany = true;
        registrations.isTFN = true;
        $("#fieldsestCompany").show();
    }
    else if (result === "partnership") {
        initializeApplicationType(partnershipName);
        registrations.isTFN = true;
        $("#fieldsestPartner").show();
    }
    else if (result === "soletrader") {
        initializeApplicationType(soleTraderName);
        $("#fieldsestSoleTrader").show();
    }
    else if (result === "trust") {
        // the next button will go do trust page.
        isTrust = true;
        $("#fieldsestTrust").show();
    }
}

// prepare the Name selection page.  ---> step 2
function prepareNamePage() {
    // make sure the calculation is correct.
    step = 2;
    calculateCompletion();
    if (isHelpMeDecidUsed)
        previousAction = actions.helpMeDecideResultStep;
    else
        previousAction = actions.businessStructureStep;

    nextAction = actions.employeeStep;
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
    // make sure the calculation is correct.
    step = 3;
    calculateCompletion();
    previousAction = actions.businessNameStep;
    nextAction = actions.activityStep;

    // company stream
    if (applicationType.name === companyName) {
        // check which option user has selected
        if (applicationType.hasEmployee != undefined) {
            if (applicationType.hasEmployee) {
                $("#companyEmployeeYes").prop('checked', true);
            }
            else {
                $("#companyEmployeeNo").prop('checked', true);
            }
        }
        // check whether user selected benefits to employee or not.
        if (applicationType.fringeBenefit != undefined) {
            if (applicationType.fringeBenefit) {
                $("#fringeBenefitsEmployeeYes").prop('checked', true);
            }
            else {
                $("#fringeBenefitsEmployeeNo").prop('checked', true);
            }
        }

        // company employee
        $("#companyEmployeeYes").click(function () {
            applicationType.hasEmployee = true;
            registrations.isPAYG = true;
        });

        $("#companyEmployeeNo").click(function () {
            applicationType.hasEmployee = false;
            applicationType.fringeBenefit = false;
            registrations.isFBT = false;
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
    // make sure the calculation is correct.
    step = 4;
    calculateCompletion();
    previousAction = actions.employeeStep;
    nextAction = actions.finishedStep;

    $(":checkbox").click(function () {
        if (this.id !== 'ckNone') {
            if ($("#ckNone").prop("checked") && $(this).prop("checked")) {
                $("#ckNone").trigger("click");
            }
        } else {
            {
                if ($("#ckNone").prop("checked")) {
                    applicationType.noneOfAbove = true;
                    $(":checkbox").each(function (i, element) {
                        if (element.id !== "ckNone" && $(element).prop('checked')) {
                            $(element).trigger('click');
                        }
                    });
                }
            }
        }
    });
    // none of the above
    $("#ckNone").click(function () {
        applicationType.noneOfAbove = $("#ckNone").prop('checked');
    });

    if (applicationType.noneOfAbove !== undefined) {
        setCheckBox("#ckNone", applicationType.noneOfAbove);
    }

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

    if (registrations.isWET != undefined) {
        setCheckBox("#ckDealInWine", registrations.isWET);
    }

    // fuel
    $("#ckUseFuel").click(function () {
        registrations.isFTC = $("#ckUseFuel").prop('checked');
    });

    if (registrations.isFTC != undefined) {
        setCheckBox("#ckUseFuel", registrations.isFTC);
    }

    // luxury cars
    $("#ckLuxury").click(function () {
        registrations.isLCT = $("#ckLuxury").prop('checked');
    });

    if (registrations.isLCT != undefined) {
        setCheckBox("#ckLuxury", registrations.isLCT);
    }
}

// prepare the finished page
function showResults() {
    // make sure the calculation is correct.
    step = 5;
    calculateCompletion();
    previousAction = actions.activityStep;
    nextAction = "";

    var needGST = (parseboolean(applicationType.taxi) || parseboolean(applicationType.turnOver75k) || parseboolean(applicationType.limo));
    if (needGST) {
        $('#resultTable tr:last').after(getResult("Goods &amp; Services Tax (GST)", "gst", true, "", "Free", 1));
    }
    if (parseboolean(registrations.isTFN)) {
        $('#resultTable tr:last').after(getResult("Tax File Number (TFN)", "tfn", true, "", "Free", 2));
    }
    if (parseboolean(registrations.isCompany)) {
        $('#resultTable tr:last').after(getResult("Company", "company", true, "", "$463 for 1 year", 3));
    }
    if (parseboolean(registrations.isBusinessName)) {
        $('#resultTable tr:last').after(getResult("Business name", "businessName", true, "", "$34 for 1 year or $79 for 3 years", 4));
    }
    if (parseboolean(registrations.isPAYG)) {
        $('#resultTable tr:last').after(getResult("Pay As You Go (PAYG) Withholding", "payg", true, "", "Free", 5));
    }
    if (parseboolean(registrations.isFBT)) {
        $('#resultTable tr:last').after(getResult("Fringe Benefits Tax (FBT)", "fbt", true, "", "Free", 6));
    }
    if (parseboolean(registrations.isLCT) && needGST) {
        $('#resultTable tr:last').after(getResult("Luxury Car Tax (LCT)", "lct", true, "", "Free", 7));
    }
    if (parseboolean(registrations.isFTC) && needGST) {
        $('#resultTable tr:last').after(getResult("Fuel Tax Credits (FTC)", "ftc", true, "", "Free", 8));
    }
    if (parseboolean(registrations.isWET) && needGST) {
        $('#resultTable tr:last').after(getResult("Wine Equalisation Tax (WET)", "wet", true, "", "Free", 9));
    }
    if (!needGST) {
        $("#gstRecommend").show();
        $("#ckGstRecommend").click(function () {
            if ($(this).prop('checked')) {
                $("#lctOptional").prop('checked', true);
                $("#wetOptional").prop('checked', true);
                $("#ftcOptional").prop('checked', true);

            }
            else {
                $("#lctOptional").prop('checked', false);
                $("#wetOptional").prop('checked', false);
                $("#ftcOptional").prop('checked', false);
            }
        });

        if (parseboolean(registrations.isLCT)) {
            $("#lctOptionalRow").show();
            $("#lctOptional").click(function () {
                if ($(this).prop('checked')) {
                    $("#ckGstRecommend").prop('checked', true);
                }
            });
        }
        if (parseboolean(registrations.isWET)) {
            $("#wetOptionalRow").show();
            $("#wetOptional").click(function () {
                if ($(this).prop('checked')) {
                    $("#ckGstRecommend").prop('checked', true);
                }
            });
        }
        if (parseboolean(registrations.isFTC)) {
            $("#ftcOptionalRow").show();
            $("#ftcOptional").click(function () {
                if ($(this).prop('checked')) {
                    $("#ckGstRecommend").prop('checked', true);
                }
            });
        }
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
    if (needGST && parseboolean(registrations.isLCT)) {
        $('#lctHelp').show();
        $('#lctHelpHeader').show();
    }
    if (needGST && parseboolean(registrations.isFTC)) {
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
        if (parseboolean(registrations.isFTC)) {
            $("#ftcHelpHeader1").show();
            $("#ftcHelp1").show();
        }
        if (parseboolean(registrations.isLCT)) {
            $("#lctHelpHeader1").show();
            $("#lctHelp1").show();
        }
        if (parseboolean(registrations.isWET)) {
            $("#wetHelpHeader1").show();
            $("#wetHelp1").show();
        }
    }
}

// end of callbacks

/* Discovery Page*/
function initDiscoveryPage() {
    manageState(actions.businessStructureStep);
    $("#previous").click(function () {
        $(window).scrollTop($('#heading').offset().top);
        $("#previous").blur();
        manageState(previousAction);
    });
    $("#next").click(function () {
        if (isTrust) {
            window.location.href = "trust.html";
        }
        $(window).scrollTop($('#heading').offset().top);
        $("#next").blur();
        if (!ifAnythingSelected("questions") && previousAction != actions.helpMeDecideStep && previousAction != actions.employeeStep) { // ignore step 4
            $("#validation").show();
            $(window).scrollTop($('#validation').offset().top);
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
        manageState(nextAction);
    });
}
/* End of Discovery Page */


// Utilities
function calculateCompletion() {
    $("#stepNo").html(step);
    var percentCompleted = Math.round((step - 1) / (maxStep - 1) * 100 / 5) * 5;
    if (percentCompleted == 0) {
        percentCompleted += 5;
    }
    $("#percentCompleted").html(percentCompleted);
    $("#percentMeter").css('width', percentCompleted + '%');
}



function selectRadioButton(value, name) {
    if (value != null) {
        setTimeout(function () {
            setValue(value, name);
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


/*function getResult(registrationName, id, isSelected, reason, cost, helpId) {
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
    result += '">' + cost + '</td>  <td class="help"><span class="form-help"><a href="#help-structure" id="' + helpId + '" class="cd-btn"><img src="../assets/img/ico-help-form.png" alt="" /></a></span></td></tr>';
    if (!isSelected) {
        result += '<tr><td class="results-alert-message" colspan="3"><span class="smaller">' + reason + '</span></td></tr>';
    }
    return result;
}
*/

function getResult(registrationName, id, isSelected, reason, cost, helpId) {
    var result = '<tr><td><p><input id="' + id + '" type="checkbox" checked="checked"><label for="' + id + '">' + registrationName + '</label></p></td>';
    result += '<td class="cost';
    if (!isSelected) {
        result += " results-alert-message";
    }
    result += '">' + cost + '</td>  <td class="help"><span class="form-help"><a href="#help-structure" id="' + helpId + '" class="cd-btn"><img src="../assets/img/ico-help-form.png" alt="" /></a></span></td></tr>';
    if (!isSelected) {
        result += '<tr><td class="results-alert-message" colspan="2"><span class="smaller">' + reason + '</span></td></tr>';
    }
    return result;
}

function parseboolean(value) {
    return (value != undefined && value);
}


function ifAnythingSelected(containerId) {
    var ifUserInputCount = 0;
    var elementCount = 0;
    $("#" + containerId + " :radio").each(function () {
        if ($(this).is(":visible") && $(this).parent().parent().is(":visible")) {
            elementCount++;
            var ifUserInput = $(this).prop("checked");
            if (ifUserInput) {
                ifUserInputCount++;
            }
        }
    });
    if (previousAction === actions.helpMeDecideStep) {
        return true;
    }
    // user needs to select all the options in 'help me decide' step
    return nextAction === actions.helpMeDecideResultStep ? ifUserInputCount === elementCount / 2 : ifUserInputCount > 0;
}

function hideValidationMessages() {
    $('input:radio').click(
                          function () {
                              $("#validation").hide(150);
                          }
      );
}

function returnToGivenStep(action) {
    $(".cd-panel").click();
    manageState(action);
    return false;
}

function printHelp() {
    var helpCSS = "";
    if (window.location.host === "busgov.github.io") {
        helpCSS = window.location.protocol + '//' + location.host + "/registration/assets/css/help.css";
    }
    else {
        helpCSS = window.location.protocol + '//' + location.host + "/assets/css/help.css";
    }
    $('#help').printThis({
        importCSS: false,
        //printContainer: true,
        //debug: true,
        loadCSS: [helpCSS]
    });

    return false;
}

function isEqual(compareFrom, compareTo) {
    if (compareFrom != undefined && compareFrom === compareTo) {
        return true;
    }
    return false;
}

// this function is only used for help me decide section
function resumeRadioButtonStateOnHelpMeDecidePage(radio1, radio2, stateValue) {

    if (isEqual(stateValue, 1)) {
        $(radio1).prop('checked', true);
    }
    else if (isEqual(stateValue, 2)) {
        $(radio2).prop('checked', true);
    }
}
// End Utilities