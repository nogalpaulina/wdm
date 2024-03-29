
var util_phoneRegexObj = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
var util_emailRegexObj = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
var util_ssnRegexObj = /^\d{3}-?\d{2}-?\d{4}$/;



function util_booleanToInteger(value) {
  if (value == null) {
    return '';
  }
  if (value == true) {
    return 1;
  }
  return 0;
}



function util_booleanToYesNo(value) {
  if (value == true) {
    return 'Yes';
  }
  if (value == false) {
    return 'No';
  }
  return '';
}



function util_buildFullName(first, middle, last) {
  first = util_nullCheck(first);
  middle = util_nullCheck(middle);
  last = util_nullCheck(last);
  var middleToken = "";
  if (typeof first !== 'undefined' && first.length > 0) {
    if (typeof middle !== 'undefined' && middle.length > 0) {
      middleToken = middle + " ";
    }
    last = (typeof last === 'undefined') ? '' : last;
    return first + " " + middleToken + last;
  }
  else {
      return "";
  }
}



function util_calculateAgeFromBirthDate(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}



function util_checkPassword(s) {
  if (util_checkRegexp(s,/[a-z]/) && util_checkRegexp(s,/[A-Z]/) && util_checkRegexp(s,/\d/) && util_checkRegexp(s,/\W/)) {
    return true;
  }
  return false;
}



function util_checkRegexp(s, regexp) {
  return regexp.test(s);
}



function util_checkSession() {
  var jsonData = JSON.stringify({sessionId: app_client.sessionId, module:app_currentModule});
  $.post("auth/checkSession",{data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    return util_checkSessionResponse(parsedData);
  }); 
}



function util_checkSessionResponse(obj) {
  if (obj != undefined && obj.authenticated == false) {
    setTimeout(util_logout, 3000);
    return false;
  }
  return true;
}



function util_clearErrors() {
  $('.form-group').removeClass('has-error'); 
  $('.form-group').removeClass('has-feedback'); 
  $('.help-block').html('');
}



function util_clearItemError($item) {
  var $formGroup = $item.closest('.form-group');
  $formGroup.removeClass('has-error'); 
  $formGroup.removeClass('has-feedback'); 
  var $helpBlock = $formGroup.find('.help-block');
  $helpBlock.html('');
}



function util_createGender(code) {
  var gender = new Gender();
  gender.code = code; 
  if (!code) {
    gender.id = 5;
    gender.name = 'Unreported';
    gender.code = 'U'; 
  }
  else if (code == 'M') {
    gender.id = 1;
    gender.name = 'Male';
  }
  else if (code == 'F') {
    gender.id = 2;
    gender.name = 'Female';
  }
  return gender;
}



var util_debug = function (log_txt) {
  if (window.console != undefined) {
    console.log(log_txt);
  }
}



function util_filterDecimalInput(e) {
  var key = e.keyCode || e.which;
  if ((key != 8 && key != 9 && key != 46 && key < 48) || (key > 57 && key != 190)) { // 0-9 .
    if (e.preventDefault) {e.preventDefault();}
    e.returnValue = false; 
  }
}



function util_filterIntegerInput(e) {
  var key = e.keyCode || e.which;
  if ((key != 8 && key != 9 && key < 48) || key > 57) { // 0-9
    if (e.preventDefault) {e.preventDefault();}
    e.returnValue = false; 
  }
}



//var myMoney=3543.75873;
//var formattedMoney = '$' + myMoney.formatMoney(2,',','.'); // "$3,543.76"
//  the args default to 2, comma, & period so can also be called as myMoney.formatMoney();
Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
  var n = this,
  decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
  decSeparator = decSeparator == undefined ? "." : decSeparator,
  thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
  sign = n < 0 ? "-" : "",
  i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
  j = (j = i.length) > 3 ? j % 3 : 0;
  return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
};



function util_isDate(testValue) {
  var returnValue = false;
  var testDate;
   try {
     testDate = new Date(testValue);
     if (!isNaN(testDate)) {
       returnValue = true;            
     }
     else {
       returnValue = false;
     }
   }
   catch (e) {
     returnValue = false;
   }
   return returnValue;
}



function util_isFieldEmpty(selector) {
  var value = $.trim($(selector).val());
  if (value.length > 0) {
    return false;
  }
  return true;
}



function util_logout() {
  app_viewStack('signin-screen', DO_SCROLL);
  app_notificationText = app_clientFullName + ' automatically logged out.';
  if (app_idleInterval) {clearInterval(app_idleInterval)};
  $('body').removeClass('modal-open');
  $('.modal-backdrop').remove();
  $('#modals-placement').html('');
  app_displayNotification(app_notificationText);
  app_client = null;
}



function util_nullCheck(val) {
  if (typeof val !== 'undefined' && val != null) {
    return val;
  }
  return "";
}



function util_processDate(selector, property) {
  //"Mar 17, 2014 10:01:12 PM";
  var date = $.trim($(selector).val());
  if (date.length > 0) {
    property = dateFormat(date, "EEE MMM dd kk:mm:ss z yyyy"); 
  }
  return property;
}



function util_processDob(selector, property) {
  var date = $.trim($(selector).val());
  if (date.length > 0) {
    property = dateFormat(date, "mm/dd/yyyy"); 
  }
  return property;
}



function util_processNumber(selector, property) {
  var value = $.trim($(selector).val());
  if (value.length > 0) {property = value;}
  return property;
}



function util_parseUrl(url) {
  var parser = document.createElement('a'), searchObject = {}, queries, split, i;
  parser.href = url;
  queries = parser.search.replace(/^\?/, '').split('&');
  for( i = 0; i < queries.length; i++ ) {
    split = queries[i].split('=');
    searchObject[split[0]] = split[1];
  }
  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    searchObject: searchObject,
    hash: parser.hash
  };
}



function util_padString(n, width, char) {
  char = char || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(char) + n;
}



String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};



function util_selectCheckboxesFromList(list, name) {
  if (list !== undefined) { 
    var a = list.split(","); 
    for (i=0;i<a.length;i++) {
      var s = a[i];
        $("input[name="+name+"][value="+s+"]").attr("checked", true);
    }
  }
}



function util_showError($item, message) {
  if (message == null) {
    message = 'required field';
  }

  var $formGroup = $item.closest('.form-group');
  $formGroup.addClass('has-error'); 
  $formGroup.addClass('has-feedback'); 
  var $helpBlock = $formGroup.find('.help-block');
  $helpBlock.html(message);
}



function util_showPlainError(item, message) {
  if (message == null) {
    message = 'required field';
  }
  $(item).text(message);
  $(item).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}); 
}



var util_substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};



function util_yesNoToBoolean(value) {
  if (value == 'Yes') {
    return true;
  }
  if (value == 'No') {
    return false;
  }
  return null;
}

