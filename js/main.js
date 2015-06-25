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
var soletrader = null;
var businessStructure = null;
var gst = null;
var businessName = null;
var payg = null;
var fbt = null;
var lct = null ;
var ftc = null;
var wet = null;
/*
var registrations = new Array(
    ["ABN", true],
    ["Business Structure",""],
    ["GST"],
    ["Business Name"],
    ["PAYG", false],
    ["FBT", false],
    ["LCT", false],
    ["FTC", false],
    ["WET", false]
    );
*/
/* Slide out panel */
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
jQuery(document).ready(function($){
  manageState();

  $("#previous").click(function() { manageState("previous");});//step--;loadQuestionHelp(); });
  $("#next").click(function() {manageState("next");});//step++; loadQuestionHelp(); });
});

function loadQuestionHelp()
{
  var templateDirectory = "templates/"
  $("#heading").html(steps[step][0]);
  $("#stepNo").html(displayStepNumber);
  var percentCompleted = displayStepNumber / maxStep * 100;
  $("#percentCompleted").html(percentCompleted);
  if(percentCompleted == 0)
  {
    percentCompleted+= 2; 
  }
  $("#percentMeter").css('width', percentCompleted + '%');
  $("#question").load(templateDirectory + steps[step][1] + "_question.html");
  $("#helpFile").load(templateDirectory + steps[step][1] + "_help.html", function() {setTimeout(applyStyle, 0);});  
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

function manageState(action)
{
  if(action == "previous")
  {
    step--;
    displayStepNumber --;

    switch(step)
    {
      case 0:
        window.location.href = "home.html";
        break;
      case 1:
        if($('input[name=structure]').length)
        {
          businessStructure = getValueFromRadioButton("structure");
        }
        else
        {
          gst = getValueFromRadioButton("gst");
        }
        loadQuestionHelp();
        selectRadioButton(soletrader, "soletrader");
        break;
      case 2:
        gst = getValueFromRadioButton("gst");
        if(soletrader == 'yes')
        {
          step--;
        }
        loadQuestionHelp();
        if(soletrader == 'yes')
        {
          selectRadioButton(soletrader, "soletrader");
        }
        else
        {
         selectRadioButton(businessStructure, "structure");
        }
        break;
      case 3:
        businessName = getValueFromRadioButton("businessName");
        loadQuestionHelp();
        selectRadioButton(gst, "gst");
        break;
      case 4:
        payg = getValueFromRadioButton("payg");
        fbt = getValueFromRadioButton("fbt");
        lct = getValueFromRadioButton("lct");
        ftc = getValueFromRadioButton("ftc");
        wet = getValueFromRadioButton("wet");
        loadQuestionHelp();
        selectRadioButton(businessName, "businessName");
        break;
      case 5:
        loadQuestionHelp();
        selectRadioButton(payg, "payg");
        selectRadioButton(fbt, "fbt");
        selectRadioButton(lct, "lct");
        selectRadioButton(ftc, "ftc");
        selectRadioButton(wet, "wet");
        break;
    }
  }
  else
  {
    step++;
    displayStepNumber ++;

    switch(step)
    {
      case 1:
        loadQuestionHelp();
        selectRadioButton(soletrader, "soletrader");
        break;
      case 2:
        soletrader = getValueFromRadioButton("soletrader");
        if(soletrader == "yes")
        {
          businessStructure = null;
          step++;
          maxStep = 5;
        }
        loadQuestionHelp();
        if(soletrader == "yes")
        {
          selectRadioButton(gst, "gst");
        }
        else
        {
         selectRadioButton(businessStructure, "structure");
        }
        break;
      case 3:
        businessStructure = getValueFromRadioButton("structure");
        loadQuestionHelp();
        selectRadioButton(gst, "gst");
        break;
      case 4:
        gst = getValueFromRadioButton("gst");
        loadQuestionHelp();
        selectRadioButton(businessName, "businessName");
        break;
      case 5:
        businessName = getValueFromRadioButton("businessName");
        loadQuestionHelp();
        selectRadioButton(payg, "payg");
        selectRadioButton(fbt, "fbt");
        selectRadioButton(lct, "lct");
        selectRadioButton(ftc, "ftc");
        selectRadioButton(wet, "wet");
        break;
      case 6:
        payg = getValueFromRadioButton("payg");
        fbt = getValueFromRadioButton("fbt");
        lct = getValueFromRadioButton("lct");
        ftc = getValueFromRadioButton("ftc");
        wet = getValueFromRadioButton("wet");
        loadQuestionHelp();
        setTimeout(showResults, 50);
        break;
    }
  }
}

function showResults()
{
  if(parseboolean(gst))
  {
    $('#resultTable tr:last').after(getResult("GST", "gst", true,"", "Nil"));
  }
  if(businessStructure == "company")
  {
    $('#resultTable tr:last').after(getResult("Company", "company", true,"", "$500 / year"));
  }
  if(parseboolean(businessName))
  {
    $('#resultTable tr:last').after(getResult("Business Name", "businessName", true,"", "$34 / year"));
  }
  if(parseboolean(payg))
  {
    $('#resultTable tr:last').after(getResult("Pay as you go (PAYG)", "payg", true,"", "Nil"));
  }
  if(parseboolean(fbt))
  {
    $('#resultTable tr:last').after(getResult("Fringe Benefits Tax", "fbt", true,"", "Nil"));
  }
  if(parseboolean(lct))
  {
    $('#resultTable tr:last').after(getResult("Luxury Car Tax", "lct", true,"", "Nil"));
  }
  if(parseboolean(ftc))
  {
    $('#resultTable tr:last').after(getResult("Fuel Tax Credits", "ftc", true,"", "Nil"));
  }
  if(parseboolean(wet))
  {
    $('#resultTable tr:last').after(getResult("Wine Equalisation Tax", "wet", true,"", "Nil"));
  }
  if((parseboolean(ftc) || parseboolean(wet)) && !parseboolean(gst))
  {
    var selectedRegistration = "";
    if(parseboolean(ftc) && parseboolean(wet))
    {
      selectedRegistration = "FTC and WET";
    }
    else if(parseboolean(ftc))
    {
      selectedRegistration = "FTC";
    }
    else if(parseboolean(wet))
    {
      selectedRegistration = "WET";
    }
    $('#resultTable tr:last').after(getResult("GST", "gst", false,"We've also checked GST because you selected <strong>yes</strong> for "+ selectedRegistration + " which requires you to be registered for GST.", "Nil"));
  }
}

function selectRadioButton(value, name)
{
  if(value !=null)
  {
    setTimeout(function(){setValue(value, name)}, 50);
      
  }
}
function setValue(value, name){
  $('input[name=' + name + '][value=' + value + ']').prop('checked', true);
}
function getValueFromRadioButton(name)
{
  console.log($('input[name='+ name + ']:checked').val());
  return $('input[name='+ name + ']:checked').val();
}
function getResult(registrationName, id, isSelected, reason, cost)
{
  var result = '<tr>    <td class="choice ';
    if(isSelected)
    {
      result+= " results-success-message";
    }
    else
    {
      result+= " results-alert-message";
    }
     result += '"><input id="'+ id + '" type="checkbox" checked="checked"></td>    <td class="registration-type';
    if(!isSelected)
    {
      result+= " results-alert-message";
    }
    result += '"><label for="'+ id + '">'+ registrationName + '</label></td>    <td class="cost';
    if(!isSelected)
    {
      result+= " results-alert-message";
    }
    result += '">'+ cost + '</td>  </tr>';
    if(!isSelected)
    {
      result += '<tr><td class="results-alert-message" colspan="3"><span class="smallest">'+ reason +'</span></td></tr>';
    }
  return result;
}

function parseboolean(value)
{
  return (value == "yes") ? true : false;
}
/* show or hide form fields 
$(document).ready(
    function(){
      $("input[name=payg]").click(function(){
          $("#tr-ftb").fadeToggle();
      });
});
*/
