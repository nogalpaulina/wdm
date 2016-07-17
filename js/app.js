// test for Grade A browser support.
if (!bowser.a) { 
  document.location = 'browser_upgrade.html';
}

var SPECIALTY;
var AC_SPECIALTY = 'ac';
var AM_SPECIALTY = 'am';
var BH_SPECIALTY = 'bh';
var DOM_SPECIALTY = 'dom';
var PMD_SPECIALTY = 'pmd';
var POT_SPECIALTY = 'pot';
var PRACTICE;

var AAC_EVAL_TYPE =  'aac';
var ACTIVE = 1;
var CLIENT_STATUS_AUTHORIZED = 1;
var CLIENT_STATUS_NOT_FOUND = 0;
var CLIENT_STATUS_INVALID_PASSWORD = -1;
var CLIENT_STATUS_INACTIVE = -2;
var CLINICIAN_CLIENT_TYPE = "clinician";
var DO_AUTO_LOGOUT = true;
var DO_AUTO_SERVER_LOGOUT = true;
var DO_SCROLL = true;
var DONT_SCROLL = false;
var EHR_MODULE = "ehr";
var ONE_MINUTE = 60000;
var ONE_SECOND =  1000;
var OT_EVAL_TYPE =  'ot';
var PATIENT_CLIENT_TYPE = "patient";
var PM_MODULE = "pm";
var PORTAL_MODULE = "portal";
var MESSAGE_TYPE_GENERAL = 1;
var MESSAGE_TYPE_MEDICAL_ADVICE = 2;
var MESSAGE_TYPE_RX_RENEWAL = 3;
var MESSAGE_TYPE_APPT_REQUEST = 4;
var MESSAGE_TYPE_INITIAL_APPT_REQUEST = 5;
var PASSWORD_PLACEHOLDER = 'not a password';
var PROFILE_PLACEHOLDER_SM="assets/images/headshot_placeholder_sm.jpg";
var RETURN_CODE_DUP_EMAIL = -1;
var RETURN_CODE_INVALID_PASSWORD = -3;
var RETURN_CODE_INVALID_SSN = -3;
var RETURN_CODE_DUP_USERNAME = -1;
var RETURN_CODE_VALID = 1;
var SPEECH_EVAL_TYPE =  'speech';
var SITE_MODULE = "site";
var STORE_MODULE = "store";
var USER_CLIENT_TYPE = "user";


var app_aacEval;
var app_aacIntake;
var app_appointmentsCache;
var app_client = null;
var app_clientFullName;
var app_clientProperties;
var app_practiceClientProperties;
var app_clientType;
var app_clinicianLocations;
var app_clinicianMessages;
var app_clinicianPatients;
var app_clinicianPatientsSelectOptions;
var app_clinicians;
var app_credentials;
var app_currentCalendarView = 'month';
var app_currentDate;
var app_currentInvoiceId;
var app_currentGuardian = null;
var app_currentMessageId;
var app_currentModule;
var app_currentPatient = null;
var app_currentPatientFullName;
var app_currentPatientId;
var app_currentPatientProfileImage;
var app_currentScreen;
var app_dashboardCache;
var app_devHx;
var app_familyRecordsCache;
var app_finalScreenButton;
var app_finalScreenNumber;
var app_forms = {};
var app_gender;
var app_guardianLastNameTypeAheads;
var app_guardians;
var app_headerFooterCache;
var app_hideElementListCache;
var app_idleInterval;
var app_idleTime = 0;
var app_intakeFormIndices = [];
var app_intakeRecordsCache;
var app_leadMgmtCache;
var app_lettersCache;
var app_locations;
var app_maritalStatus;
var app_messagesCache;
var app_missingFields = []; 
var app_notificationText;
var app_otEval;
var app_otIntake;
var app_parkWarningDisplayed;
var app_patientChartCache;
var app_patientChartItemCache;
var app_patientClinicians;
var app_patientIntake;
var app_patients;
var app_patientSearchTypeAheads;
var app_potPatientForms;
var app_previousScreen;
var app_profileImageTempPath = "";
var app_programs;
var app_reportsCache;
var app_roles;
var app_scheduleCache;
var app_selectedClinician;
var app_sendMessageCache;
var app_settingsCache;
var app_signinCache;
var app_speechEval;
var app_speechIntake;
var app_userAdminCache;
var app_treatmentNotes;
var app_userDashboard;
var app_userLocations;
var app_users;
var app_usStates;
var app_yourRecordsCache;



/************      @JQUERY INIT    *******************/
$(document).ready(function() {
  $(document).mousemove( function(){ app_timerReset(); });
  window.onbeforeunload = app_confirmBeforeUnload; 
  app_getClientProperties();
});
/***********      @JQUERY INIT    *******************/



function app_confirmBeforeUnload() {
  if (app_client && app_client != null) {
    return "Please log out first in order to save your data."; 
  }
}



function app_displayNotification(text, sticky) {
  $('.wdm-notification-text').html(text);
  if (sticky) {
    $('.wdm-notification-text').fadeIn(400);
  }
  else {
    $('.wdm-notification-text').fadeIn(400).delay(3000).fadeOut(400); 
  }
}



function app_getClinicianPatients() {
  var jsonData = JSON.stringify({id: (app_selectedClinician != "" ? app_selectedClinician : 0), sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatients", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_clinicianPatients = parsedData.clinicianPatients;

    app_clinicianPatientsSelectOptions = "<option value=''>choose</option>";   
    for (var i=0;i<app_clinicianPatients.length;i++){
      app_clinicianPatientsSelectOptions += "<option value='"+app_clinicianPatients[i].patient.id+"'>"+
      util_buildFullName(app_clinicianPatients[i].patient.firstName, app_clinicianPatients[i].patient.middleName, app_clinicianPatients[i].patient.lastName) +
      "</option>";
    }
    $("#app-appt-patient").html(app_clinicianPatientsSelectOptions);  
  });
}



function app_getClinicians() {
  var jsonData = JSON.stringify({sessionId: app_client.sessionId,  module:app_currentModule});
  $.post("app/getClinicians", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_clinicians = parsedData.clinicians;
    RenderUtil.render('component/person_select_options', {options:app_clinicians}, function(s) {
      $(".patient-clinician").html(s);
    });
  });
}



function app_getColumnValue(column, item) {
  var value = '';
  var columnFields = column.field.split('.'); 
    
  if (column.type == 'simple' || column.type == 'numeric') {
    if (item[column.field] === undefined) {
      value = ''; 
    }
    else {
      value = item[column.field];
    }
  }
  else if (column.type == 'yes-no') {
    value = item[column.field] == true ? 'Yes' : 'No';
  }
  else if (column.type == 'dollar') {
    value = '$' + item[column.field].formatMoney();
  }
  else if (column.type == 'date') {
    value = dateFormat(item[column.field], 'mm/dd/yyyy')
  }
  else if (column.type == 'date-time') {
    value = dateFormat(item[column.field], 'mm/dd/yyyy hh:mm')
  }
   else if (column.type == 'patient') {
    value = item[column.field];
    value = util_buildFullName(item['firstName'], item['middleName'], item['lastName'])
  }
  else if (column.type == 'double') {
    var field0 = columnFields[0];
    if (field0 && item[field0]) {
      var field1 = columnFields[1];
      value = item[field0][field1];
    }
  }  
  else if (column.type == 'double-date') {
    var field0 = columnFields[0];
    if (field0 && item[field0]) {
      var field1 = columnFields[1];
      value = item[field0][field1];
      value = dateFormat(value, 'mm/dd/yyyy')
    }
  }
  else if (column.type == 'double-patient') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    value = item[field0][field1];
    value = util_buildFullName(item[field0]['firstName'], item[field0]['middleName'], item[field0]['lastName'])
  }
  else if (column.type == 'triple') {
    var columnFields = column.field.split('.'); 
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    var field2 = columnFields[2];
    value = item[field0][field1][field2];
  }
  else if (column.type == 'html') {
    if (item[column.field] === undefined) {
      value = ''; 
    }
    else{
      value = util_stripHtml(item[column.field]);
    }
  }
  else if (column.type == 'soap-note') {
    if (item[column.field] === undefined) {
      value = ''; 
    }
    else{
      value = util_stripHtml(item[column.field]);
      value =  util_truncate(value, 50);
    }
  }
  else if (column.type == 'strip-html') {
    if (item[column.field] === undefined) {
      value = ''; 
    }
    else{
      value = util_stripHtml(item[column.field]);
      value =  util_truncate(value, 100);
    }
  }
  else if (column.type == 'double-person') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    if (item[field0] === undefined) {
      return value; 
    }
    value = util_buildFullName(item[field0]['firstName'], item[field0]['middleName'], item[field0]['lastName'])
  }
  else if (column.type == 'double-date') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    if (item[field0] === undefined) {
      return value; 
    }  
    value = dateFormat(item[field0][field1], 'mm/dd/yyyy')
  }
  else if (column.type == 'triple-person') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    var field2 = columnFields[2];
    if (item[field0] === undefined || item[field0][field1] === undefined) {
      return value; 
    }  
    value = util_buildFullName(item[field0][field1]['firstName'], item[field0][field1]['middleName'], item[field0][field1]['lastName'])
  }
  else if (column.type == 'triple') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    var field2 = columnFields[2];
    if (item[field0] === undefined || item[field0][field1] === undefined) {
      return value; 
    }  
    value = item[field0][field1][field2];
  }
  else if (column.type == 'triple-date') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    var field2 = columnFields[2];
    if (item[field0] === undefined || item[field0][field1] === undefined) {
      return value; 
    }  
    value = dateFormat(item[field0][field1][field2], 'mm/dd/yyyy')
  }
  else if (column.type == 'quad') {
    var field0 = columnFields[0];
    var field1 = columnFields[1];
    var field2 = columnFields[2];
    var field3 = columnFields[3];
    if (item[field0] === undefined || item[field0][field1] === undefined || item[field0][field1][field2] === undefined) {
      return value; 
    }  
    value = item[field0][field1][field2][field3];
  }
  return value;
}



function app_getClientProperties() {
  var jsonData = JSON.stringify({id:0});
  $.post("app/getClientProperties", {data:jsonData}, function(data) {
    parsedData = $.parseJSON(data);
    app_clientProperties = parsedData.clientProperties;
    app_practiceClientProperties = parsedData.practiceClientProperties;
    PRACTICE = app_practiceClientProperties['practice'];
    SPECIALTY = app_practiceClientProperties['specialty'];
    module_selectModuleFromUrl();
 });
}



function app_getStaticLists() {
  var jsonData = JSON.stringify({module:app_currentModule});
  $.post("app/getStaticLists", {data:jsonData}, function(data) {
    parsedData = $.parseJSON(data);
    var staticLists = parsedData.staticLists;
    app_usStates = staticLists.usStates;
    app_programs = staticLists.programs;
    app_gender = staticLists.gender;
    app_maritalStatus = staticLists.maritalStatus;
    pm_salesLeadStatuses = staticLists.salesLeadStatuses;
    pm_salesLeadEmailStatuses = staticLists.salesLeadEmailStatuses;
    pm_salesLeadCallStatuses = staticLists.salesLeadCallStatuses;
    pm_salesLeadStages = staticLists.salesLeadStages;
    pm_salesLeadAgeRanges = staticLists.salesLeadAgeRanges;
    pm_salesLeadSources = staticLists.salesLeadSources;
    pm_networkMarketingSources = staticLists.networkMarketingSources;
    app_roles = staticLists.roles;
    app_credentials = staticLists.credentials;
    pm_referralSourceTypes = staticLists.referralSourceTypes;
    pm_addressTypes = staticLists.addressTypes;
    pm_salesLeadGoals = staticLists.salesLeadGoals;
 });
}



function app_handleClickableRow(e) {
  var id = undefined;
  var tableId = undefined;
  var tableName = undefined;
  var attributes = e.currentTarget.attributes;
  for (i=0;i<attributes.length;i++) {
    if (attributes[i].name == 'name') {
      id = attributes[i].value; 
    }
    else if (attributes[i].name == 'id') {
      tableId = attributes[i].value; 
    }
    else if (attributes[i].name == 'data-table-name') {
      tableName = attributes[i].value; 
    }
  }

  if (id !== undefined) {
    if (tableName == 'lead-mgmt-action-list') {
      pm_currentSalesLeadActionId = id; 
      pm_loadSalesLeadActionForm();
    }
    else if (tableName == 'lead-mgmt-task-list') {
      pm_currentSalesLeadTaskId = id; 
      pm_loadSalesLeadTaskForm();
    }
    else if (tableName == 'patient-invoices-list') {
      app_currentInvoiceId = id; 
      pm_viewInvoice(id);
    }
    else if (tableName == 'reports-list') {
      app_currentReportId = id; 
      pm_viewReport();
    }
  }
}



function app_login() {
  if($.trim($("#app-signin-username").val()).length < 1 || $.trim($("#app-signin-password").val()).length < 1) { 
    return;
  }
  var username = $.trim($("#app-signin-username").val());
  var password = $.trim($("#app-signin-password").val());
    
  var jsonData = JSON.stringify({ username: username, password: password, clientType:app_clientType, module:app_currentModule});
  $.post("app/login", {data:jsonData}, function(data) {
    $('#app-login-error').css({display:'none'});
    var parsedData = $.parseJSON(data);
    app_client = parsedData.client;
    
    if (app_client.authStatus == CLIENT_STATUS_AUTHORIZED) {
      app_clientFullName = util_buildFullName(app_client.firstName, app_client.middleName, app_client.lastName);
      app_notificationText = app_clientFullName + ' logged in.';
      app_runIdleTimer(); 
      app_viewStack('dashboard-screen', DO_SCROLL); 
      
      if (app_currentModule == EHR_MODULE) {
        ehr_getAppLists();
      }
      else if (app_currentModule == PM_MODULE) {
        pm_getAppLists();
      }
      else if (app_currentModule == PORTAL_MODULE) {
        app_currentPatient = app_client;
        if (app_currentPatient.intakeClosed == false) {
          app_renderPatientIntakeScreen();
        }
        else {
          portal_buildFormControls();
        }
      }
    }  
    else  {
      if (app_client.authStatus == CLIENT_STATUS_NOT_FOUND) {
        app_notificationText = 'User not found in system';
      }
      else if (app_client.authStatus == CLIENT_STATUS_INVALID_PASSWORD) {
        app_notificationText = 'Invalid password';
      }
      else if (app_client.authStatus == CLIENT_STATUS_INACTIVE) {
        app_notificationText = 'User is inactive';
      }
    }
    app_displayNotification(app_notificationText);
  });  
}



function app_logout() {
  if (app_client == null) {
    return;
  }
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/logout", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_viewStack('signin-screen', DO_SCROLL);
    app_notificationText = app_clientFullName + ' logged out.';
    if (app_idleInterval) {clearInterval(app_idleInterval)};
    app_displayNotification(app_notificationText);
    app_client = null;
    app_currentPatient = null;
    app_currentPatientId = null;
  });
}



function app_park() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/park", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    if (app_idleInterval) {clearInterval(app_idleInterval)};
  });
}



function app_runIdleTimer() {
  app_idleTime = 0;
  if (app_idleInterval) {clearInterval(app_idleInterval)};
  app_idleInterval = setInterval(app_timerIncrement, ONE_MINUTE);
}



function app_timerIncrement() {
  app_idleTime++;
  if (app_idleTime == 660) {
    app_displayNotification('Your session will soon be automatically parked if still idle', true);
    app_parkWarningDisplayed = true;
  }
  else if (app_idleTime == 690) {
    app_showParkDialog();
  }
}



function app_timerReset() {
  if (app_parkWarningDisplayed) { 
    $('#wdm-notification-text').html('');
    app_parkWarningDisplayed = false;
  }
  app_idleTime = 0;
}



function app_showError(item, message) {
  if (message == null) {
    message = 'required field';
  }
  $(item).text(message);
  $(item).css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}); 
}



function app_showParkDialog() {
  RenderUtil.render('dialog/park', {}, function(s) { 
    $('#modals-placement').html(s);
    module_applyCSS();
    $('#app-parked-full-name').html(app_clientFullName);
    $('#modal-park').modal('show'); 
    app_park();
    $('#app-unpark-submit').click(function(){ app_unpark(); });
    $('#app-park-logout').click(function(){ app_logout(); });
  });
}



function app_unpark() {
  var notificationText;
  var username = $.trim($("#app-unpark-username").val());
  var password = $.trim($("#app-unpark-password").val());
  
  if (username.length < 1 || password.length < 1) { 
    notificationText = 'Username and Password Required';
    $("#app-unpark-notification").html(notificationText);
    return;
  }
  
  var jsonData = JSON.stringify({ username: username, password: password, sessionId: app_client.sessionId, clientType:app_clientType});
  $.post("app/unpark", {data:jsonData},
    function(data) {
      var parsedData = $.parseJSON(data);
      if (!util_checkSessionResponse(parsedData)) return false;
      var authStatus = parsedData.client.authStatus;
        
      if (authStatus == CLIENT_STATUS_AUTHORIZED) {
        notificationText = app_clientFullName + ' unparked.';
        $('#modal-park').modal('hide'); 
        app_displayNotification(notificationText);
        app_runIdleTimer(); 
      }  
      else  {
        if (authStatus == CLIENT_STATUS_NOT_FOUND) {
          notificationText = 'User not found in system';
        }
        else if (authStatus == CLIENT_STATUS_INVALID_PASSWORD) {
          notificationText = 'Invalid password';
        }
        else if (authStatus == CLIENT_STATUS_INACTIVE) {
          notificationText = 'User is inactive';
        }
        $("#app-unpark-notification").html(notificationText);
      }
    }
  ); 
}
