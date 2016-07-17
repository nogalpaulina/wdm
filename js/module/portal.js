
function module_initPORTAL() {
  patientFile_loadScreen({portal:true});

  $(document).attr('title', app_practiceClientProperties['portal.app.title']);
  app_viewStack('signin-screen', DO_SCROLL);
    
  $('#portal-welcome-screen-image').attr('src', 'assets/images/practice/'+PRACTICE+'/'+app_practiceClientProperties['portal.app.main_image']); 
  $('#portal-link-image').attr('src', 'assets/images/practice/'+PRACTICE+'/'+app_practiceClientProperties['portal.app.practice_logo']); 
  $('#portal-link-image-sm').attr('src', 'assets/images/practice/'+PRACTICE+'/'+app_practiceClientProperties['portal.app.practice_logo']); 
  $('.practice-logo').attr('src', 'assets/images/practice/'+PRACTICE+'/'+app_practiceClientProperties['portal.app.practice_logo']); 
  
  $('#app-signin-submit').click(function(){ app_login(); });
  $('#dashboard-screen-btn').click(function(){portal_dashboardScreen()});
  $('#app-your-records-panel-btn').click(function(){portal_yourRecordsScreen()});
  $('#app-family-records-panel-btn').click(function(){portal_familyRecordsScreen()});
  $('#app-messages-panel-btn').click(function(){portal_messagesScreen()});
  $('#app-files-panel-btn').click(function(){portal_filesScreen()});
  $('#app-appointments-panel-btn').click(function(){portal_appointmentsScreen()});
  $('#app-send-message-panel-btn').click(function(){portal_sendMessageScreen()});
  $('#app-settings-panel-btn').click(function(){portal_settingsScreen()});
  $('#app-logout-submit').click(function(e){e.preventDefault();app_logout();});
  $('#app-inbox-btn').click(function(e){portal_getPatientMessages();});
  $('#app-sent-messages-btn').click(function(e){portal_getPatientSentMessages();});
  $('#send-message-submit').click(function(e){portal_sendMessageToProvider();});
  $('#app-rx-request-btn').click(function(e){portal_rxRequest_clearForm();});
  $('#rx-request-submit').click(function(e){portal_rxRequest();});
  
  $('#appt-request-from').datepicker();
  $('#appt-request-to').datepicker();
    
  var fromOffice = $.QueryString["fromOffice"];
  if (fromOffice == "true") {
    var tempSessionId = $.QueryString["tempSessionId"];
    app_currentModule = $.QueryString["module"];
    portal_validateFromOffice(tempSessionId);
  }
    
  var activateUser = $.QueryString["activateUser"];
  if (activateUser == "true") {
    var activationCode = $.QueryString["activationCode"];
    portal_validateViaActivation(activationCode);
  }
  
  setupAppointmentScreen();
}



function portal_applyCSS() {
  $('.panel-top,.panel-bottom,.sub-navbar,.modal-header,.modal-sub-title,.sub-title').css({'background-color':'#ffffff'});
  $('a.nav-xm:active').css({'background-color':'#2a6496'});
  $('a.nav-selected:hover').css({'background-color':'#2a6496'});
  $('a.nav-selected-xm:hover').css({'background-color':'#2a6496'});
  $('a.nav-selected-xm:link').css({'background-color':'#2a6496'});
  $('a.nav-selected:link').css({'background-color':'#2a6496'});
  $('a.pc-tile:hover').css({'background-color':'#2a6496'});
}


function portal_buildFormControls() {
   portal_getPatientClinicians();
}


function portal_getPatientClinicians() {
  var jsonData = JSON.stringify({ id: app_client.id, sessionId: app_client.sessionId });
  $.post("patient/getPatientClinicians", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_patientClinicians = parsedData.patientClinicians;
    RenderUtil.render('component/patient_clinician_select_options', {options:app_patientClinicians}, function(s) {
      $(".app-patient-clinicians-select").html(s);
    });
  });
}

function portal_appointmentsScreen() {
  app_viewStack('appointments-screen', DO_SCROLL);
  app_loadCalendar();
}



function portal_dashboardScreen() {
  app_viewStack('dashboard-screen', DO_SCROLL);
}



function portal_familyRecordsScreen() {
  app_viewStack('family-records-screen', DO_SCROLL);
}



function portal_getAppLists() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, clientType:app_clientType});
  $.post("app/getAppLists", {data:jsonData}, function(data) {
    parsedData = $.parseJSON(data);
    var appLists = parsedData.appLists;
    app_patientClinicians = appLists.patientClinicians;
 });
}



function portal_messagesScreen() {
  app_viewStack('messages-screen', DO_SCROLL);
}

function portal_filesScreen() {
  patientFile_viewPatientFiles();
}



function portal_sendMessageScreen() {
  app_viewStack('send-message-screen', DO_SCROLL);
  portal_sendMessage_clearForm();
}



function portal_settingsScreen() {
  app_viewStack('settings-screen', DO_SCROLL);
}


function portal_validateViaActivation(activationCode) {
  var notificationText = '';
  app_viewStack('signin-screen', DO_SCROLL);
  var jsonData = JSON.stringify({activationCode: activationCode, module:app_currentModule });
    $.post("patient/validateViaActivation", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    // password has been created already
    if(parsedData.client && parsedData.client.intakeClosed == false && parsedData.client.passwordCreated == true) {
      return;
    }
    app_client = parsedData.client;
    app_currentPatient = app_client;
    if (app_client.authStatus == CLIENT_STATUS_AUTHORIZED) {
      app_clientFullName = util_buildFullName(app_client.firstName, app_client.middleName, app_client.lastName);
      app_notificationText = app_clientFullName + ' logged in.';
      $('.app-patient-appt-name').text(app_clientFullName + " [" + app_client.mrn + "]");
      $('.home-today').html(dateFormat("fullDate"));
      app_runIdleTimer(); 
      app_viewStack('dashboard-screen', DO_SCROLL); 
      if (app_client.intakeClosed == false) {
        app_notificationText = app_clientFullName + ' ready for activation.';
        app_renderPatientIntakeScreen();
      }
      else {
        portal_buildFormControls();
      }
    }  
    else  {
      app_client = null;
      app_currentPatient = null;
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



function portal_validateFromOffice(sessionId) {
  app_viewStack('signin-screen', DO_SCROLL);
  var jsonData = JSON.stringify({sessionId: sessionId, module:app_currentModule });
  $.post("patient/validateFromOffice", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_client = parsedData.client;
    app_currentPatient = app_client;
    
    if (app_client.authStatus == CLIENT_STATUS_AUTHORIZED) {
      app_clientFullName = util_buildFullName(app_client.firstName, app_client.middleName, app_client.lastName);
      app_notificationText = app_clientFullName + ' logged in.';
      $('.app-patient-appt-name').text(app_clientFullName + " [" + app_client.mrn + "]");
      $('.home-today').html(dateFormat("fullDate"));
      app_runIdleTimer(); 
      app_viewStack('dashboard-screen', DO_SCROLL); 
      if (app_client.intakeClosed == false) {
        app_notificationText = app_clientFullName + ' ready for activation.';
        app_renderPatientIntakeScreen();
      }
      else {
        portal_buildFormControls();
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



function portal_yourRecordsScreen() {
  app_viewStack('your-records-screen', DO_SCROLL);
  $('#app-intake-docs-btn').off('click').on('click', function(){ app_renderIntakeDocsSubscreen(); $('#app-intake-docs-btn').off('click'); });
}


