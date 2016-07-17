var ehr_frontSheet;
var ehr_medicalHistory;




function module_initEHR() {
  patientFile_loadScreen();
  $(document).attr('title', app_practiceClientProperties['ehr.app.title']);
  $('#app-signin-username').val(app_practiceClientProperties['pm.demo_username']);
  $('#app-signin-password').val(app_practiceClientProperties['pm.demo_password']);
  
  app_viewStack('signin-screen', DO_SCROLL);
    
  $('#admin').click(function() { 
    app_viewStack('user-admin-screen', DO_SCROLL);
    ehr_getCliniciansList();
  });
  
  
  $('#user-admin-new-user-lg, #user-admin-new-user-sm').click(function() { 
    RenderUtil.render('form/user_form', {formMode:'add'}, function(s) { 
      $('#modals-placement').html(s);
      $('#modal-admin-user-form').modal('show'); 
      $('#modal-admin-user-form .form-control-unsaved').css({display: "block"});
      $('#modal-admin-user-form .form-control-saved').css({display: "none"});
      $('#admin-user-form-title').html("Add User");
      ehr_userForm_clearForm();
      $('#admin-user-form-save').click(function() { ehr_saveNewUser() });
      ehr_applyCSS();
    });
  });
  
  $('#about').click(function() { 
    RenderUtil.render('about', {}, function(s) { 
      $('#modals-placement').html(s);
      $('#modal-about').modal('show'); 
    });
  });
  
  
  $('#new-message').click(function() { 
    RenderUtil.render('form/new_message', {}, function(s) { 
      $('#modals-placement').html(s);
      $('#modal-new-message').modal('show'); 
    });
  });
  
  $('.app-park-link').click(function(){ app_showParkDialog() });
  
  $('#app-close-chart').click(function() { 
    app_currentPatient = null;
    app_currentPatientId = null;
    $('#section-notification').css({display: "none"});
    $('#section-notification-text').html("");
    ehr_viewDashboard();
  });
  
  $('#app-change-patient').click(function() { 
    app_patientSearchDialog();
  });
  
  $('.patient-button-group').click(function() { 
    if (app_currentPatient != null) {
      if (app_currentScreen != 'patient-chart-screen') {
        ehr_viewPatientChartScreen();
      }
      return;
    }
    app_patientSearchDialog();
  });
  
  $('#patient-chart-summary-link').click(function(){ 
    RenderUtil.render('form/chart_summary', {}, function(s) {
      $('#modals-placement').html(s);
      $('#modal-chart-summary').modal('show'); 
      getPatientChartSummary();
      app_loadPatientInfo();
    });
  });
  
  
  $('#images-all-chart-sections-link').click(function() { 
    RenderUtil.render('images_all_chart_sections', {}, function(s) {
    $('#modals-placement').html(s);
    ehr_applyCSS();
    $('#images-all-chart-sections').modal('show'); 
    app_loadPatientInfo();
  });
  });
  
  $('#app-signin-submit').click(function(){ app_login(); });
  $('.app-exit').click(function(){ app_logout(); });
  
  $('.app-dashboard-link').click(function(){ ehr_viewDashboard(); });
  $('.app-messages-link').click(function(){ ehr_viewMessages(); });
  $('.app-letters-link').click(function(){ ehr_viewLetters(); });
  $('.app-schedule-link').click(function(){ ehr_viewSchedule(); });
  $('#message-view-button').click(function(){ app_viewClinicianMessage(); });
  $('#message-close-button').click(function(){ ehr_viewMessages(); });
  $('#medical-history-link').click(function(){ ehr_viewMedicalHistory(); });
  
  $('a.nav').click(function() { 
    $('a.nav-selected').addClass('nav');
    $('a.nav').removeClass('nav-selected');
    if ($(this).hasClass('toggle-selectable') ) {
      $(this).removeClass('nav');
      $(this).addClass('nav-selected');
    }
  });
  
  ehr_applyCSS();
}



function ehr_applyCSS() {
  $('.panel-top,.panel-bottom,.sub-navbar,.modal-header,.modal-sub-title,.sub-title').css({'background-color':'#2a6496'});
  $('a.nav-xm:active').css({'background-color':'#2a6496'});
  $('a.nav-selected:hover').css({'background-color':'#2a6496'});
  $('a.nav-selected-xm:hover').css({'background-color':'#2a6496'});
  $('a.nav-selected-xm:link').css({'background-color':'#2a6496'});
  $('a.nav-selected:link').css({'background-color':'#2a6496'});
  $('a.pc-tile:hover').css({'background-color':'#2a6496'});
}



function ehr_getAppLists() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, clientType:app_clientType});
  $.post("app/getAppLists", {data:jsonData}, function(data) {
    parsedData = $.parseJSON(data);
    var appLists = parsedData.appLists;
    app_clinicians = appLists.clinicians;
 });
}



function ehr_getClinicianDashboard() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getClinicianDashboard", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    clinicianDashboard = parsedData.dashboard;
    RenderUtil.render('component/simple_data_table', 
     {items:clinicianDashboard.messages, 
      title:'Messages', 
      clickable:true, 
      columns:[
        {title:'Date', field:'date', type:'date'}, 
        {title:'From', field:'patient.firstName', type:'double-person'}, 
        {title:'Subject', field:'subject', type:'simple'}
      ]}, function(s) {
        $('#clinician-dashboard-messages').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:clinicianDashboard.progressNotes, 
        title:'Progress Notes', 
        clickable:true, 
        columns:[
          {title:'Date', field:'date', type:'date'}, 
          {title:'Patient', field:'patient.firstName', type:'double-person'}, 
          {title:'Subject', field:'subject', type:'simple'}
        ]}, function(s) {
        $('#clinician-dashboard-progress-notes').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
     
      RenderUtil.render('component/simple_data_table', 
       {items:clinicianDashboard.toDoNotes, 
        title:'To Do', 
        clickable:true, 
        columns:[
          {title:'Date', field:'date', type:'date'}, 
          {title:'Patient', field:'patient.firstName', type:'double-person'}, 
          {title:'Subject', field:'subject', type:'simple'}
        ]}, function(s) {
        $('#clinician-dashboard-to-do-notes').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:clinicianDashboard.labReview, 
        title:'Lab Review', 
        clickable:true, 
        columns:[
          {title:'Date', field:'date', type:'date'}, 
          {title:'Patient', field:'patient.firstName', type:'double-person'}, 
          {title:'Lab', field:'name', type:'simple'},
          {title:'Value', field:'value', type:'numeric'}
        ]}, function(s) {
        $('#clinician-dashboard-lab-review').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:clinicianDashboard.clinicianSchedule, 
        title:'Schedule', 
        clickable:true, 
        columns:[
          {title:'Time', field:'date', type:'date'}, 
          {title:'Length', field:'length', type:'numeric'},
          {title:'Age', field:'age', type:'numeric'},
          {title:'Gender', field:'patient.gender.name', type:'triple'},
          {title:'Patient', field:'patient.firstName', type:'double-person'}, 
          {title:'Reason', field:'reason', type:'simple'},
          {title:'Comments', field:'comments', type:'simple'},
          {title:'Status', field:'status', type:'simple'},
          {title:'Patient Location', field:'patientLocation', type:'simple'},
          {title:'Room', field:'room', type:'simple'},
          {title:'Checked In', field:'checkedIn', type:'simple'},
          {title:'Wait Time', field:'waitTime', type:'numeric'},
          {title:'Progress Note Status', field:'progressNoteStatus', type:'simple'}
        ]}, function(s) {
        $('#clinician-dashboard-schedule').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
    });
  }



function ehr_viewDashboard() {
  app_viewStack('dashboard-screen', DO_SCROLL);
  //ehr_getClinicianDashboard();
}



function ehr_viewIntakeDocs(){  
 app_viewStack('intake-docs-screen', DO_SCROLL);
}



function ehr_viewSchedule() {
  app_viewStack('schedule-screen', DO_SCROLL);
  app_loadCalendar();
}



function ehr_viewFrontSheet(){  
  app_viewStack('front-sheet-screen', DO_SCROLL); 
}

function ehr_viewMedicalHistory(){  
 app_viewStack('medical-history-screen', DO_SCROLL);
}

function ehr_viewPhysicalExamination(){ 
 app_viewStack('physical-examination-screen', DO_SCROLL);
}

function ehr_viewProgressNoteScreen(){ 
 app_viewStack('progress-note-screen', DO_SCROLL);
}

function ehr_viewPatientFiles() {
  patientFile_viewPatientFiles()
}
