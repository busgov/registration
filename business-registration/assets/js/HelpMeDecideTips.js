// initialise controls
$(document).ready(function () {

    // Help me decide - business structure page:
    $('#help-helpmedecidebusinessstructureabn').next('h3').hide();
    $('#help-helpmedecidebusinessstructurebusinesstfn').next('h3').hide();
    $('#help-helpmedecidebusinessstructurecompanyregistration').next('h3').hide();

    $("input[name=structure]").click(function () {
        // base options:
        $('#item-tfn').hide();
        $('#item-company').hide();
        $('#tip-soletrader').hide();
        $('#tip-partnership').hide();
        $('#tip-company').hide();
        $('#help-helpmedecidebusinessstructureabn').next('h3').hide();
        $('#help-helpmedecidebusinessstructurebusinesstfn').next('h3').hide();
        $('#help-helpmedecidebusinessstructurecompanyregistration').next('h3').hide();

        switch (this.id) {
        case "structure-sole":
            $("#tip-soletrader").show();
            $('#help-helpmedecidebusinessstructureabn').next('h3').show();
            break;
        case "structure-partnership":
            $('#tip-partnership').show();
            $('#item-tfn').show();
            $('#help-helpmedecidebusinessstructureabn').next('h3').show();
            $('#help-helpmedecidebusinessstructurebusinesstfn').next('h3').show();
            break;
        case "structure-company":
            $('#item-company').show();
            $('#item-tfn').show();
            $('#tip-company').show();
            $('#help-helpmedecidebusinessstructureabn').next('h3').show();
            $('#help-helpmedecidebusinessstructurebusinesstfn').next('h3').show();
            $('#help-helpmedecidebusinessstructurecompanyregistration').next('h3').show();
            break;
        default:
            $('#div-bus-tip').hide(200);
            return;
        }

        $('#div-bus-tip').show(200);
    });

    // Business Name page
    $("input[name=BusinessName]").click(function () {
        if (this.id == "name-yes") {
            $("#div-name-tip").show(200);
        } else {
            $("#div-name-tip").hide(200);
        }
    });

    // Help Business Structure page
    $("input[name=radioHowManyOwners], input[name=radioSeparatePersonalAsset]").click(function() {
        // hide sections:
        $("#tip-hold-control-asset").hide();
        $("#tip-just-me").hide();
        $("#tip-two-or-more").hide();

        if ($("input[name=radioSeparatePersonalAsset]").fieldValue() == "yes") {
            $("#tip-hold-control-asset").show();
        } else if ($("input[name=radioHowManyOwners]").fieldValue() == "1") {
            $("#tip-just-me").show();
        } else if ($("input[name=radioHowManyOwners]").fieldValue() == "2") {
            $("#tip-two-or-more").show();
        } else {
            return;
        }

        $("#div-structure-tip").show(200);
    });

    $("input[name=BusName]").click(function() {
        if (this.id == "name-yes") {
            $("#div-name-tip").show(200);
        } else {
            $("#div-name-tip").hide(200);
        }
    });

    // Employees page:
    if ($("#Company").val() != "True")
        $("#help-helpmedecideemployeesfringebenefits").next('h3').hide();
    $("#help-helpmedecideemployeespayg").next('h3').hide();
    $("#help-helpmedecideemployeesfbt").next('h3').hide();

    $("input[name=Employees], input[name=FringeBenefits]").click(function() {
        var tips = false;
        if (this.id == "employee-no" && $("#Company").val() != "True") {
            $("input[name=FringeBenefits]").prop("checked", false);
            $("#fringeBenefit").hide();
            $("#help-helpmedecideemployeesfringebenefits").next('h3').hide();
        } else {
            //$("input[name=FringeBenefits]").prop("checked", false);
            $("#fringeBenefit").show();
            $("#help-helpmedecideemployeesfringebenefits").next('h3').show();
        }
        if ($("input[name=Employees]").fieldValue() == "yes") {
            $("#tip-payg").show();
            $("#help-helpmedecideemployeespayg").next('h3').show();
            tips = true;
        } else {
            $("#tip-payg").hide();
            $("#help-helpmedecideemployeespayg").next('h3').hide();
        }
        if ($("input[name=FringeBenefits]").fieldValue() == "yes") {
            $("#tip-fbt").show();
            $("#help-helpmedecideemployeesfbt").next('h3').show();
            tips = true;
        } else {
            $("#help-helpmedecideemployeesfbt").next('h3').hide();
            $("#tip-fbt").hide();
        }
        if (tips) {
            $("#div-employees-tip").show(200);
        } else {
            $("#div-employees-tip").hide(200);
        }
    });

    if ($("#Company").val() == "True" || $("input[name=Employees]").fieldValue() == "yes") {
        $("#fringeBenefit").show();
    } else {
        $("input[name=FringeBenefits]").prop("checked", false);
        $("#fringeBenefit").hide();
    }
 
    // Activity - GST page:
    $("#help-helpmedecideactivitygst").next("h3").hide();
    $("#help-helpmedecideactivitynogst").next("h3").hide();

    $("#Turnover, #Taxi, #Limousine, #NoneGst").click(function () {
        switch(this.id) {
            case "NoneGst":
                $("#help-helpmedecideactivitygst").next("h3").hide();
                if ($("#NoneGst").is(":checked")) {
                    $("#Turnover, #Taxi, #Limousine").prop("checked", false);
                    $("#div-gst-optional").show();
                    $("#div-gst-register").hide();
                    $("#div-gst-tip").show(200);
                    $("#help-helpmedecideactivitynogst").next("h3").show();
                } else {
                    $("#div-gst-tip").hide();
                    $("#div-gst-register").hide();
                    $("#help-helpmedecideactivitynogst").next("h3").hide();
                }
                break;
            default:
                $("#help-helpmedecideactivitynogst").next("h3").hide();
                if ($("#Turnover:checked, #Taxi:checked, #Limousine:checked").length > 0) {
                    $("#NoneGst").prop("checked", false);
                    $("#div-gst-optional").hide();
                    $("#div-gst-register").show();
                    $("#div-gst-tip").show(200);
                    $("#help-helpmedecideactivitygst").next("h3").show();
                } else {
                    $("#div-gst-tip").hide();
                    $("#div-gst-register").hide();
                    $("#help-helpmedecideactivitygst").next("h3").hide();
                }
        }
    });

    //if ($("#Turnover:checked, #Taxi:checked, #Limousine:checked").length == 0) {
    //    $("#None").prop("checked", true);
    //}

    // Activity - Tax page:
    $("#help-helpmedecideactivitywet").next("h3").hide();
    $("#help-helpmedecideactivityftc").next("h3").hide();
    $("#help-helpmedecideactivitylct").next("h3").hide();

    $("#Wine, #Luxury, #Fuel, #None").click(function () {
        switch (this.id) {
        case "None":
            if ($("#None").is(":checked")) {
                $("#Wine, #Luxury, #Fuel").prop("checked", false);
                $("#div-gst-tip").hide();
                $("#help-helpmedecideactivitywet").next("h3").hide();
                $("#help-helpmedecideactivityftc").next("h3").hide();
                $("#help-helpmedecideactivitylct").next("h3").hide();
            }
            break;
        default:
            $("#None").prop("checked", false);
            if ($("#Wine:checked").length > 0) {
                $("#tip-wet").show();
                $("#help-helpmedecideactivitywet").next("h3").show();
            } else {
                $("#tip-wet").hide();
                $("#help-helpmedecideactivitywet").next("h3").hide();
            }
            if ($("#Luxury:checked").length > 0) {
                $("#tip-lct").show();
                $("#help-helpmedecideactivitylct").next("h3").show();
            } else {
                $("#tip-lct").hide();
                $("#help-helpmedecideactivitylct").next("h3").hide();
            }
            if ($("#Wine:checked, #Luxury:checked").length > 0) {
                $("#tips-part1").show();
            } else {
                $("#tips-part1").hide();
            }
            if ($("#Fuel:checked").length > 0) {
                $("#tips-part2").show();
                $("#help-helpmedecideactivityftc").next("h3").show();
            } else {
                $("#tips-part2").hide();
                $("#help-helpmedecideactivityftc").next("h3").hide();
            }
            if ($("#Wine:checked, #Fuel:checked, #Luxury:checked").length > 0) {
                $("#div-gst-tip").show(200);
            } else {
                $("#div-gst-tip").hide();
            }
        }
    });

    //if ($("#Wine:checked, #Luxury:checked, #Fuel:checked").length == 0) {
    //    $("#None").prop("checked", true);
    //}

    // Summary Page:
    $("#gstRecommend #Gst").click(function () {
        $("#Ftc, #Wet, #Lct").prop("checked", this.checked);
    });

    $("#gstRecommend #Ftc, #gstRecommend #Wet, #gstRecommend #Lct").prop("checked", false).click(function() {
        $("#Gst").prop("checked", $("#Ftc:checked, #Wet:checked, #Lct:checked").length > 0);
    });

});

function hideUnreferencedHelp() {
    $("#helpFile > h3").hide();
    $("a.help:visible").each(function () {
        $("#" + this.href.split("#")[1]).next("h3").show();
    });
}
