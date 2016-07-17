
var pm_addressTypes;
var pm_currentSalesLead;
var pm_currentSalesActionId;
var pm_currentSalesLeadAction;
var pm_currentSalesLeadId;
var pm_currentSalesLeadTask;
var pm_currentSalesLeadTaskId;
var pm_hideElementListCache;
var pm_networkMarketingSources;
var pm_referralSourceTypes;
var pm_salesLeads;
var pm_salesLeadActions;
var pm_salesLeadAgeRanges;
var pm_salesLeadCallStatuses;
var pm_salesLeadEmailStatuses;
var pm_salesLeadFullName;
var pm_salesLeadGoals;
var pm_salesLeadSources;
var pm_salesLeadStages;
var pm_salesLeadStatuses;
var pm_salesLeadTasks;
var pm_selectedLocationId;



function module_initPM() {
  patientFile_loadScreen();
  $(document).attr('title', app_practiceClientProperties['pm.app.title']);
  $('#app-signin-username').val(app_practiceClientProperties['pm.demo_username']);
  $('#app-signin-password').val(app_practiceClientProperties['pm.demo_password']);
  
  
  $(function () { $("[data-toggle='popover']").popover({ trigger: "hover" }); });
  app_viewStack('signin-screen', DO_SCROLL);
  $('.dropdown-menu').find('form').click(function (e) { e.stopPropagation(); });

  $('#app-signin-submit').click(function(){ app_login(); });
  $('.app-exit').click(function(){ app_logout(); });
  
  $(".selectpicker").selectpicker();
  
  $('.app-dashboard-link').click(function(){ pm_viewDashboard(); });
  $('#invoicing-link').click(function(){ pm_viewInvoicing(); });
  $('.app-messages-link').click(function(){ pm_viewMessages(); });
  $('.app-letters-link').click(function(){ pm_viewLetters(); });
  $('.app-schedule-link').click(function(){ pm_viewSchedule(); });
  $('.app-lead-mgmt-link').click(function(){ pm_salesLeadSearchDialog(); });
  
  $('#btn-patient-search').click(function(){ 
    if (SPECIALTY == POT_SPECIALTY) {
      app_getFilteredPatientForms(); 
    }
    else {
      app_getFilteredPatients(); 
    }
  });
    
  $('.patient-button-group').click(function(){ pm_onPatientButtonClick(); });
  $('#message-view-button').click(function(){ app_viewClinicianMessage(); });
  $('#message-close-button').click(function(){ pm_viewMessages(); });
  
  $('.patient-button-group').click(function() { 
    if (app_currentPatient != null) {
      if (app_currentScreen != 'patient-chart-screen') {
        pm_viewPatientChartScreen();
      }
      return;
    }
    app_patientSearchDialog();
  });
  
  
  $('#about').click(function(){ 
    RenderUtil.render('dialog/about', {}, function(s) {
      $('#modals-placement').html(s);
      $('#modal-about').modal('show'); 
    });
  });

  $('#mpark, #mspark').click(function(){ app_showParkDialog() });

  $('#app-close-chart').click(function() { pm_closeChart() });

  $('#app-change-patient').click(function() { app_patientSearchDialog(); });

  $('#new-message').click(function() { 
    RenderUtil.render('form/new_message', {}, function(s) {
      $('#modals-placement').html(s);
      $('#modal-new-message').modal('show'); 
    });
  });

  
  $('#admin').click(function() { 
    app_viewStack('user-admin-screen', DO_SCROLL);
    pm_getUsersList();
  });
  
  
  $('#user-admin-new-user-lg, #user-admin-new-user-sm').click(function() { 
    RenderUtil.render('form/user_form', {formMode:'add'}, function(s) { 
      $('#modals-placement').html(s);
      pm_applyCSS();
      $('#modal-admin-user-form').modal('show'); 
      $('#modal-admin-user-form .form-control-unsaved').css({display: "block"});
      $('#modal-admin-user-form .form-control-saved').css({display: "none"});
      $('#admin-user-form-title').html("Add User");
      RenderUtil.render('component/basic_select_options', {options:app_roles, collection:'app_roles', choose:true}, function(s) { $("#user-form-role").html(s); });
      RenderUtil.render('component/basic_select_options', {options:app_credentials, collection:'app_credentials', choose:true}, function(s) { $("#user-form-credential").html(s); });
      pm_userForm_clearForm();
      $('#admin-user-form-save').click(function() { pm_saveNewUser() });
    });
  });
  
  $('.app-reports-link').click(function() { 
    pm_viewReports(); 
  });
  
  
  $('#export-csv-activity-log-lg, #export-csv-activity-log-sm').click(function() { 
    pm_exportTableToCSV.apply(this, [$('#activity-log-reports-content>table'), 'ActivityLog.csv']);
  });
  
  $('#export-csv-sales-lead-lg, #export-csv-sales-lead-sm').click(function() { 
    pm_exportTableToCSV.apply(this, [$('#sales-lead-reports-content>table'), 'SalesLead.csv']);
  });
  
  $('#report-view-button').click(function(){ pm_viewReport(); });
  $('#report-close-button').click(function(){ pm_viewReports(); });
  
  $('#btn-reports-activity-log-filter').click(function() { 
    if(app_currentReportId == 25) {
      pm_filterActivityLogs(); 
    }
    else if(app_currentReportId == 26) {
      pm_filterGroupByPatientsActivityLogs();
    }
  });
  
  $('#btn-sales-lead-log-filter').click(function() { pm_filterSalesLeads(); });
  $('#btn-sales-lead-log-clear').click(function(){ pm_clearSalesLeadFilter(); });
  $('#btn-reports-activity-log-clear').click(function(){ pm_clearActivityLogFilter(); });
  
  $('#print-report-button').click(function() {
    if(app_currentReportId == 26){
      window.print();
    }
  });
  
  
  $('a.nav').click(function() { 
    $('a.nav-selected').addClass('nav');
    $('a.nav').removeClass('nav-selected');
    if ($(this).hasClass('toggle-selectable') ) {
      $(this).removeClass('nav');
      $(this).addClass('nav-selected');
    }
  });

  pm_applyCSS();
}



function pm_applyCSS() {
  $('.panel-top,.panel-bottom,.sub-navbar,.modal-header,.modal-sub-title,.sub-title').css({'background-color':'#009999'});
  $('a.nav-xm:active').css({'background-color':'#009999'});
  $('a.nav-selected:hover').css({'background-color':'#009999'});
  $('a.nav-selected-xm:hover').css({'background-color':'#009999'});
  $('a.nav-selected:link').css({'background-color':'#009999'});
  $('a.nav-selected-xm:link').css({'background-color':'#009999'});
  $('a.pc-tile:hover').css({'background-color':'#009999'});
}



function pm_closeChart() {
  app_currentPatient = null;
  app_currentPatientId = null;
  $('#section-notification').css({display: "none"});
  $('#section-notification-text').html("");
  pm_viewDashboard();
}



function pm_getAppLists() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, clientType:app_clientType});
  $.post("app/getAppLists", {data:jsonData}, function(data) {
    parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var appLists = parsedData.appLists;
    app_clinicians = appLists.clinicians;
    app_users = appLists.users;
    app_locations = appLists.locations;
    app_clinicianLocations = appLists.clinicianLocations;
    app_userLocations = appLists.userLocations;
    pm_networkMarketingSources = appLists.networkMarketingSources;
    RenderUtil.render('component/basic_select_options', {options:app_locations, collection:'app_locations', choose:true}, function(s) { $("#lead-mgmt-location").html(s); });
 });
}



function pm_getPatientToClinicianMessages() {
  var jsonData = JSON.stringify({ id: app_client.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientToClinicianMessages", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_clinicianMessages = parsedData.patientMessages;
    var args =  {items:app_clinicianMessages, 
    title:'Messages', 
    tableName:'messages-inbox', 
    clickable:true, 
    columns:[
     {title:'Date', field:'date', type:'date'},
     {title:'From', field:'from', type:'simple'},
     {title:'Subject', field:'subject', type:'simple'}
    ]};
    RenderUtil.render('component/simple_data_table', args, function(s) {
      $('#messages-inbox').html(s);
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        app_handleClickableRow(e); 
      });
    });
  });
}



function pm_getUserDashboard() {
  var jsonData = JSON.stringify({ id: app_client.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getUserDashboard", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_userDashboard = parsedData.dashboard;
    RenderUtil.render('component/simple_data_table', 
     {items: app_userDashboard.messages, 
      title:'Messages', 
      clickable:true, 
      columns:[
        {title:'Date', field:'date', type:'date'}, 
        {title:'From', field:'from', type:'simple'}, 
        {title:'Subject', field:'subject', type:'simple'}
      ]}, function(s) {
        $('#user-dashboard-contact-messages').html(s);
        pm_applyCSS();
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
      });
    });
  });
}



function pm_viewDashboard() {
  app_viewStack('dashboard-screen', DO_SCROLL);
}



function pm_viewSchedule() {
  app_viewStack('schedule-screen', DO_SCROLL);
  app_loadCalendar();
}

function pm_viewPatientFiles() {
  patientFile_viewPatientFiles()
}
