
function pm_buildPatientMRN(id) {
  $('#patient-mrn').val(util_padString(id, 6));
}



function app_clearPatientSearch() {
  $('.patient-search-field').val('');
  if (SPECIALTY == POT_SPECIALTY) {
    app_getFilteredPatientForms(); 
  }
  else {
    app_getFilteredPatients(); 
  }
}



function pm_deletePatientConfirm() {
  var args = {
    modalTitle:"Delete " + app_practiceClientProperties['app.patient_label'], 
    modalH3:"Delete " + app_practiceClientProperties['app.patient_label'] + " " + app_currentPatientFullName + "?",
    modalH4:"This will remove the patient from the system ",
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').click(function() {  
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id: app_currentPatientId, module:app_currentModule });
      $.post("patient/deletePatient", {data:jsonData}, function(data) {
        var parsedData = $.parseJSON(data);
        if (!util_checkSessionResponse(parsedData)) return false;
        app_displayNotification('Patient ' + app_currentPatientFullName + ' Deleted');
        pm_closeChart(); 
        $('#modal-confirm').modal('hide'); 
        $('#modal-patient').modal('hide');
        app_patientSearchDialog(); 
      }); 
    });
  });
}



function app_getFilteredPatients() {
  var dob = util_processDob("#patient-search-dob", dob);
  var jsonData = JSON.stringify({ 
    module:app_currentModule,
    id: app_client.id, 
    firstNameFilter: $.trim($("#patient-search-first-name").val()),
    middleNameFilter: $.trim($("#patient-search-middle-name").val()),
    lastNameFilter: $.trim($("#patient-search-last-name").val()),
    mrnFilter: $.trim($("#patient-search-mrn").val()),
    cityFilter: $.trim($("#patient-search-city").val()),
    genderFilter: $.trim($("#patient-search-gender").val()),
    phoneFilter: $.trim($("#patient-search-phone").val()),
    dobFilter: dob,
    sessionId: app_client.sessionId 
  });
    
  $.post("patient/getFilteredPatients", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_patients = parsedData.patients;
    RenderUtil.render('component/simple_data_table', 
     {items:app_patients, 
      title: app_practiceClientProperties['app.patient_label'] + 's', 
      tableName:'patient-search-results', 
      clickable:true, 
      columns:[
        {title:'Full Name', field:'firstName', type:'patient'},
        {title:'Date of Birth', field:'dob', type:'date'},
        {title:'Gender', field:'gender.name', type:'double'},
        {title:'City', field:'city', type:'simple'},
        {title:'Primary Phone', field:'primaryPhone', type:'simple'},
        {title:'Secondary Phone', field:'secondaryPhone', type:'simple'},
        {title:'MRN', field:'mrn', type:'simple'}
      ]}, function(s) {
      $('#patient-search-results').html(s);
      $('#patient-search-results-title').html(app_practiceClientProperties['app.patient_label'] + " Search");
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        app_currentPatientId = $(this).attr('name');
        $('#modal-patient-search').modal('hide'); 
        app_getPatient();
      });
    });
  });
}



function pm_getNextPatientId() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId });
  $.post("patient/getNextPatientId", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    pm_buildPatientMRN(parsedData.id);
  });
}  
      


function app_getPatient() {
  var jsonData = JSON.stringify({ id: app_currentPatientId, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("patient/getPatient", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_currentPatient = parsedData.patient;
    app_currentPatientFullName = util_buildFullName(app_currentPatient.firstName, app_currentPatient.middleName, app_currentPatient.lastName);
    app_currentPatientProfileImage = 'patient/getPatientProfileImage?sessionId=' + app_client.sessionId + "&patientId=" + app_currentPatient.id  + 
    "&profileImagePath=" + app_currentPatient.profileImagePath + "&module=" + app_currentModule;
    $('#section-notification').css({display: "block"});
    $('.patient-navbar-btn').css("display", "inline-block");
    $('#section-notification-text').html("Patient: " + app_currentPatientFullName);
    if (app_currentModule == EHR_MODULE) {
      ehr_viewPatientChartScreen();
    }
    else if (app_currentModule == PM_MODULE) {
      pm_viewPatientChartScreen();
    }
    app_renderPatientChartHeader();
  });
}
  


  function ehr_getPatientChartSummary() {
    var jsonData = JSON.stringify({ id: app_currentPatientId, clinicianId: clinician.id, sessionId: clinician.sessionId, module:app_currentModule });
    $.post("app/getPatientChartSummary", {data:jsonData}, function(data) {
      var parsedData = $.parseJSON(data);
      patientChartSummary = parsedData.patientChartSummary;
      
      RenderUtil.render('component/simple_data_table', 
       {items:patientChartSummary.patientEncounters, 
        title:'Visits', 
        clickable:true, 
        columns:[
          {title:'Date', field:'date', type:'date'},
          {title:'Type', field:'encounterType.name', type:'double'}
        ]}, function(s) {
        $('#patient-chart-summary-visits').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:patientChartSummary.patientVitalSigns, 
        title:'Vital Signs', 
        clickable:true, 
        columns:[
          {title:'Height', field:'height', type:'numeric'},
          {title:'Weight', field:'weight', type:'numeric'},
          {title:'BMI', field:'bmi', type:'numeric'},
          {title:'OFC', field:'ofc', type:'numeric'},
          {title:'Temp', field:'temperature', type:'numeric'},
          {title:'Pulse', field:'pulse', type:'numeric'},
          {title:'Resp', field:'respiration', type:'numeric'},
          {title:'Syst', field:'systolic', type:'numeric'},
          {title:'Dia', field:'diastolic', type:'numeric'},
          {title:'Ox', field:'oximetry', type:'numeric'}
        ]}, function(s) {
        $('#patient-chart-summary-vital-signs').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:patientChartSummary.patientHealthIssues, 
        title:'Health Maintenance', 
        clickable:true, 
        columns:[
         {title:'Health Issue', field:'healthIssue.name', type:'double'}, 
         {title:'Date', field:'date', type:'date'}
        ]}, function(s) {
        $('#patient-chart-summary-hm').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
     
      RenderUtil.render('component/simple_data_table', 
       {items:patientChartSummary.patientAllergens, 
        title:'Allergens', 
        clickable:true, 
        columns:[
          {title:'Allergen', field:'allergen.name', type:'double'}, 
          {title:'Reaction', field:'comment', type:'simple'}
        ]}, function(s) {
        $('#patient-chart-summary-allergens').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:patientChartSummary.patientMedications, 
        title:'Medication', 
        clickable:true, 
        columns:[
          {title:'Medication', field:'medication.name', type:'double'}, 
          {title:'Date', field:'date', type:'date'},
          {title:'Unit', field:'unit', type:'simple'},
          {title:'Instructions', field:'instructions', type:'simple'}
        ]}, function(s) {
        $('#patient-chart-summary-medication').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
      
      RenderUtil.render('component/simple_data_table', 
       {items:patientChartSummary.patientMedicalProcedures, 
        title:'Procedures', 
        clickable:true, 
        columns:[
          {title:'Procedure', field:'medicalProcedure.name', type:'double'}, 
          {title:'Due Date', field:'date', type:'date'},
          {title:'Status', field:'status.name', type:'double'},
          {title:'Last Done', field:'date', type:'date'}
        ]}, function(s) {
        $('#patient-chart-summary-procedures').html(s);
        $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        });
      });
    });
  }
  
  
  
function pm_getPatientInfo() {  
  var jsonData = JSON.stringify({ id: app_currentPatientId, sessionId: app_client.sessionId, module:app_currentModule });
 
  $.post("patient/getPatientInfo", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var patient = parsedData.patient;
    app_currentPatient = patient;
    RenderUtil.render('form/'+SPECIALTY+'/patient_form', {formMode:'edit'}, function(s) {
      $('#modals-placement').html(s);
      $('#modal-patient .form-control').css({display: "block"}); 
      $('#modal-patient').modal('show');
      $('#patient-program-div').hide();
      $('#patient-form').attr('data-instance-id', app_currentPatientId);      
      form_addForm('entity.patient', app_currentPatientId, patient);
      RenderUtil.render('component/basic_select_options', {options:app_usStates, collection:'app_usStates', choose:true}, function(s) {
        $("#patient-us-state").html(s); $('#patient-us-state').val(patient.usState ? patient.usState.id : ''); 
      });
      $('#patient-form-title').html("View/Edit " + app_practiceClientProperties['app.patient_label']);
      app_profileImageTempPath = "";
      $('#patient-ssn').mask("999-99-9999");
      $('#patient-dob').mask("99/99/9999");
      $('#patient-postal-code').mask("99999");
      $('#patient-mrn').val(patient.mrn);
      $('#patient-first-name').val(patient.firstName);
      $('#patient-middle-name').val(patient.middleName);
      $('#patient-last-name').val(patient.lastName);
      $('#patient-preferred-name').val(patient.preferredName);
      $('#patient-ssn').val(patient.govtId);
      $('#patient-drivers-license').val(patient.driversLicense);
      if(patient.dob != null) { $('#patient-dob').val(dateFormat(patient.dob, 'mm/dd/yyyy')); }
      $('#patient-gender').val(patient.gender ? patient.gender.id : '');
      $('#patient-marital-status').val(patient.maritalStatus ? patient.maritalStatus.id : '');
      
      jsonData = JSON.stringify({sessionId: app_client.sessionId,  module:app_currentModule});
        $.post("app/getClinicians", {data:jsonData}, function(data) {
          parsedData = $.parseJSON(data);
          app_clinicians = parsedData.clinicians;
          RenderUtil.render('component/person_select_options', {options:app_clinicians}, function(s) {
          $("#patient-clinician").html(s);
          $('#patient-clinician').val(patient.assignedClinician ? patient.assignedClinician.id : '');
        });
      });
  
      $('#patient-race').val(patient.race ? patient.race.id : '');
      $('#patient-ethnicity').val(patient.ethnicity ? patient.ethnicity.id : '');
      $('#patient-address1').val(patient.streetAddress1);
      $('#patient-address2').val(patient.streetAddress2);
      $('#patient-prepayment-amount').val(patient.prepaymentAmount);
      $('#patient-city').val(patient.city);
      $('#patient-postal-code').val(patient.postalCode);
      $('#patient-status').val(patient.status);
      $('#patient-occupation').val(patient.occupation);
      $('#patient-employed').val(patient.employmentStatus);
      $('#patient-employer').val(patient.employer);
      $('#patient-school-status').val(patient.schoolStatus);
      $('#patient-school-name').val(patient.schoolName);
      $('#patient-primary-phone').val(patient.primaryPhone);
      $('#patient-secondary-phone').val(patient.secondaryPhone);
      $('#patient-email').val(patient.email);
      $('#patient-insured-name').val(patient.insuredName);
      $('#patient-member-number').val(patient.memberNumber);
      $('#patient-group-number').val(patient.groupNumber);
      $('#patient-ins-carr').val(patient.insuranceCarrier);
      
      util_selectCheckboxesFromList(patient.forms, 'forms');
      if (patient.intakeClosed == true) {
        $("input[name=forms]").attr("disabled", "disabled");
      }
      else {
        $("input[name=forms]").off('click').on('click',  function() { pm_updatePatientInfoForms() }); 
      }
      
      util_selectCheckboxesFromList(patient.programs, 'programs');
      $("input[name=programs]").off('click').on('click',  function() { pm_updatePatientInfoPrograms() }); 
      
      $('#patient-photo').error(function() {
          $(this).attr('src',PROFILE_PLACEHOLDER_SM);
      });
      if (patient.portalInviteDate) {
        $('#patient-invitation-status').html('Invite sent at ' + dateFormat(patient.portalInviteDate, 'mm/dd/yyyy  h:MM TT'));
        $('#patient-send-invitation-btn').text('Resend Portal Invitation');
      }
      else {
        $('#patient-invitation-status').html('');
        $('#patient-send-invitation-btn').text('Send Portal Invitation');
      }
      $('#patient-send-invitation-btn').off('click').on('click',  function() { pm_sendPortalInvitation() }); 
      
      $('#patient-form .input-field').off('blur').on('blur', function() { form_validateAndUpdateField(this) });
      $('#patient-form .input-select').off('change').on('change', function() { form_validateAndUpdateField(this) });
      
      var profilePhoto = $('#patient-photo');
      profilePhoto.attr('src', app_currentPatientProfileImage); 
      pm_setupGuardian();
      pm_setupPictureUpload(profilePhoto);
      $('#patient-photo-upload').off('blur').on('blur', function() { val = app_profileImageTempPath; });
      
      $('#patient-form-delete-btn').off('click').on('click', function(){ pm_deletePatientConfirm(); });
      $('#patient-form-close-btn').off('click').on('click', function(){ app_getPatient(); });
    });
  });
}



function app_getRecentPatients() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("patient/getRecentPatients", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_patients = parsedData.patients;
    RenderUtil.render('component/simple_data_table', 
     {items:app_patients, 
      title:'Recent ' + app_practiceClientProperties['app.patient_label'] + 's', 
      tableName:'patient-search-results', 
      clickable:true, 
      columns:[
        {title:'Full Name', field:'firstName', type:'patient'},
        {title:'Date of Birth', field:'dob', type:'date'},
        {title:'Gender', field:'gender.name', type:'double'},
        {title:'City', field:'city', type:'simple'},
        {title:'Primary Phone', field:'primaryPhone', type:'simple'},
        {title:'Secondary Phone', field:'secondaryPhone', type:'simple'}
      ]}, function(s) {
      $('#patient-search-results').html(s);
      $('#patient-search-results-title').html('Recent ' + app_practiceClientProperties['app.patient_label'] + 's');
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        app_currentPatientId = $(this).attr('name');
        $('#modal-patient-search').modal('hide'); 
        app_getPatient();
      });
    });
  });
}



function pm_initPatientFormSearchTypeAheads() {
  var jsonData = JSON.stringify({sessionId: app_client.sessionId, module:app_currentModule });
  $.post("patient/getPatientFormSearchTypeAheads", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_patientSearchTypeAheads = parsedData.patientSearchTypeAheads;
    $('#patient-search-first-name').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'firstNames', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.firstNames) }); 
    $('#patient-search-middle-name').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'middleNames', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.middleNames) }); 
    $('#patient-search-last-name').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'lastNames', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.lastNames) }); 
    $('#patient-search-city').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'cities', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.cities) }); 
  });
}



function app_initPatientSearchTypeAheads() {
  var jsonData = JSON.stringify({sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientSearchTypeAheads", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_patientSearchTypeAheads = parsedData.patientSearchTypeAheads;
    $('#patient-search-first-name').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'firstNames', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.firstNames) }); 
    $('#patient-search-middle-name').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'middleNames', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.middleNames) }); 
    $('#patient-search-last-name').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'lastNames', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.lastNames) }); 
    $('#patient-search-mrn').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'mrns', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.mrns) }); 
    $('#patient-search-city').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'cities', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.cities) }); 
    $('#patient-search-phone').typeahead (
      { hint: true, highlight: true, minLength: 3 },
      { name: 'phoneNumbers', displayKey: 'value', source: util_substringMatcher(app_patientSearchTypeAheads.phoneNumbers) }); 
  });
}
  


function pm_onPatientButtonClick() {
  $('.clickable-table-row').removeClass('table-row-highlight');
}



function app_patientSearchDialog() {
  $(".modal-backdrop").remove(); 
  RenderUtil.render('form/patient_search', {}, function(s) {
    $('#modals-placement').html(s);
    $('#modal-patient-search').modal('show'); 
    $('.patient-search-field').val('');
    $('#patient-search-dob').mask("99/99/9999");
    $('.clickable-table-row').removeClass('table-row-highlight');
    $('#btn-patient-search').click(function(){ app_getFilteredPatients(); });
    $('#btn-patient-search-clear').click(function(){ app_clearPatientSearch(); });
    if (SPECIALTY == POT_SPECIALTY) {
      pm_initPatientFormSearchTypeAheads();
      pot_app_getRecentPatientForms();
    }
    else {
      app_initPatientSearchTypeAheads();
      app_getRecentPatients();
    }
    $('#btn-patient-search-new-patient').click(function() { pm_renderNewPatientForm() });
 });
}



function pm_renderNewPatientForm() {
  app_currentPatient = null;
  app_currentGuardian = null;
  pm_closeChart();
  RenderUtil.render('form/'+SPECIALTY+'/patient_form', {formMode:'add'}, function(s) {
    $('#modals-placement').append(s);
    $('#modal-patient').modal('show');
    
    if (SPECIALTY == BH_SPECIALTY || SPECIALTY == AC_SPECIALTY || SPECIALTY == DOM_SPECIALTY) {
      $('#modal-patient').modal('show');
      if (SPECIALTY == BH_SPECIALTY) {
        $('#patient-program-div').show();
        pm_setupGuardian();
      }
      RenderUtil.render('component/basic_select_options', {options:app_programs, collection:'app_programs', choose:false}, function(s) { $("#patient-program").html(s); });
      RenderUtil.render('component/basic_select_options', {options:app_usStates, collection:'app_usStates', choose:true}, function(s) { $("#patient-us-state").html(s); });
      app_profileImageTempPath = "";
      $('#patient-ssn').mask("999-99-9999");
      $('#patient-dob').mask("99/99/9999");
      $('#patient-postal-code').mask("99999");
      $('#patient-cancel').off('click').on('click', function(){ $('#modal-patient').modal('hide'); });
      $('#patient-save').off('click').on('click', function(){ pm_saveNewPatient() });
      $('#patient-photo-upload').click(function() { $('#patient-photo-upload-progress .progress-bar').css('width', '0'); });
      pm_setupPictureUpload();
      app_getClinicians();
      pm_getNextPatientId();
    }
    else if (SPECIALTY == POT_SPECIALTY) {
      $('#modal-patient-form').modal('show');
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId });
      $.post("patient/createPatientForm", {data:jsonData}, function(data) {
      var parsedData = $.parseJSON(data);
      app_patientForm = parsedData.patientForm;
      pot_pm_loadPatientForm();
    });
    }
  });
}



function app_renderPatientChartHeader() {
  RenderUtil.render('component/patient_chart_header', {}, function(s) {
    $('#patient-chart-header').html(s);
    $('.patient-chart-full-name').html(app_currentPatientFullName);
    $('.patient-chart-dob').html(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));
    $('.patient-chart-gender').html(app_currentPatient.gender ? app_currentPatient.gender.code: '');
    $('.patient-chart-mrn').html(app_currentPatient.mrn);
    $('.patient-chart-primary-phone').html(app_currentPatient.primaryPhone);
    $('.patient-chart-secondary-phone').html(app_currentPatient.secondaryPhone);
    $('.patient-chart-headshot').attr('src', app_currentPatientProfileImage);
    $('.patient-chart-address').html(app_currentPatient.streetAddress1);
    $('.patient-chart-city').html(app_currentPatient.city);
    $('.patient-chart-us-state').html(app_currentPatient.usState ? app_currentPatient.usState.code : '');
    $('.patient-chart-postal-code').html(app_currentPatient.postalCode);
    $('.patient-chart-email').html(app_currentPatient.email);
    //$('.patient-chart-last-appt').html(app_currentPatientLastApptDate);
    $('#section-notification-text').html("Patient: " + app_currentPatientFullName);
  });
} 


function pm_saveNewPatient() {
  var isValid = true;
  util_clearErrors();  

  if($("#patient-first-name").val().length < 1) { 
    util_showError($('#patient-first-name'));
    isValid = false;
  }
  if($("#patient-last-name").val().length < 1) { 
    util_showError($('#patient-last-name'));
    isValid = false;
  }
  if($("#patient-clinician").val().length < 1) { 
    util_showError($('#patient-clinician'));
    isValid = false;
  }
  if($("#patient-primary-phone").val().length < 1) { 
    util_showError($('#patient-primary-phone'));
    isValid = false;
  }
  /*
  if (util_isFieldEmpty('#patient-ssn') && util_isFieldEmpty('#patient-drivers-license')) {
    util_showError($('#patient-ssn'), 'SSN or Drivers License required'); 
    isValid = false; 
  }
  */
  if (SPECIALTY != AC_SPECIALTY && SPECIALTY != DOM_SPECIALTY) {
    if($("#patient-dob").val().length < 1) { 
      util_showError($('#patient-dob'));
      isValid = false;
    }
    if($("#patient-address1").val().length < 1) { 
      util_showError($('#patient-address1'));
      isValid = false;
    }
    if($("#patient-city").val().length < 1) { 
      util_showError($('#patient-city'));
      isValid = false;
    }
    if($("#patient-us-state").val().length < 1) { 
      util_showError($('#patient-us-state'));
      isValid = false;
    }
    if($("#patient-postal-code").val().length < 1) { 
      util_showError($('#patient-postal-code'));
      isValid = false;
    }
    if($("#patient-gender").val().length < 1) { 
      util_showError($('#patient-gender'));
      isValid = false;
    }
  }
  
  if (SPECIALTY == BH_SPECIALTY) {
    if($("#patient-ins-carr").val().length < 1) { 
      util_showError($('#patient-ins-carr'));
      isValid = false;
    } 
    if($("#patient-member-number").val().length < 1) { 
      util_showError($('#patient-member-number'));
      isValid = false;
    } 
    if($("#patient-group-number").val().length < 1) { 
      util_showError($('#patient-group-number'));
      isValid = false;
    } 
    if($("#patient-insured-name").val().length < 1) { 
      util_showError($('#patient-insured-name'));
      isValid = false;
    } 
    if (app_currentGuardian != null) {
      if ($("#patient-g-first-name").val().length < 1) { 
        util_showError($('#patient-g-first-name'));
        isValid = false;
      }
      if ($("#patient-g-last-name").val().length < 1) { 
        util_showError($('#patient-g-last-name'));
        isValid = false;
      }
      var guardianEmailValid = util_checkRegexp($.trim($("#patient-g-email").val()), /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
      if(guardianEmailValid == false) {
        util_showError($('#patient-g-email'), 'invalid email address');
        isValid = false;
      }
    }
    else {
      var emailValid = util_checkRegexp($.trim($("#patient-email").val()), /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
      if(emailValid == false) {
        util_showError($('#patient-email'), 'invalid email address');
        isValid = false;
      }
    }
  } 
  else {  
    var emailValid = util_checkRegexp($.trim($("#patient-email").val()), /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    if(emailValid == false) {
      util_showError($('#patient-email'), 'invalid email address');
      isValid = false;
    }
  }

  if (isValid == false) {
    return;
  }
  
  var jsonData = JSON.stringify({ 
    module:app_currentModule,
    mrn:  (SPECIALTY == BH_SPECIALTY ? $('#patient-program').val() + $('#patient-mrn').val() : $('#patient-mrn').val()), 
    lastName: $('#patient-last-name').val(), 
    firstName: $('#patient-first-name').val(), 
    middleName: $('#patient-middle-name').val(), 
    preferredName: $('#patient-preferred-name').val(), 
    assignedClinician: $('#patient-clinician').val(), 
    ssn: $('#patient-ssn').val(), 
    driversLicense: $('#patient-drivers-license').val(), 
    dob: $('#patient-dob').val(), 
    genderId: $('#patient-gender').val() ? $('#patient-gender').val() : 0,
    maritalStatus: $('#patient-marital-status').val(), 
    race: $('#patient-race').val(), 
    ethnicity: $('#patient-ethnicity').val(), 
    address1: $('#patient-address1').val(), 
    address2: $('#patient-address2').val(), 
    city: $('#patient-city').val(), 
    usState: $('#patient-us-state').val() ? $('#patient-us-state').val() : 0,
    postalCode: $('#patient-postal-code').val(), 
    status: $('#patient-status').val(), 
    occupation: $('#patient-occupation').val(), 
    employed: $('#patient-employed').val(), 
    employer: $('#patient-employer').val(), 
    school: $('#patient-school').val(), 
    schoolName: $('#patient-schoolName').val(), 
    primaryPhone: $('#patient-primary-phone').val(), 
    secondaryPhone: $('#patient-secondary-phone').val(), 
    email: $('#patient-email').val(),
    profileImageTempPath: app_profileImageTempPath,
    forms: $('input[name=forms]:checked').map(function() {return this.value;}).get().join(','),
    programs: $('input[name=programs]:checked').map(function() {return this.value;}).get().join(','),
    sendPortalInvite: $('#patient-send-portal-invite').prop('checked') == true,
    prepaymentAmount: $('#patient-prepayment-amount').val(), 
    insuranceCarrier: $('#patient-ins-carr').val(), 
    memberNumber: $('#patient-member-number').val(), 
    groupNumber: $('#patient-group-number').val(), 
    insuredName: $('#patient-insured-name').val(), 
    guardianId: app_currentGuardian != null ? app_currentGuardian.id : null,
    sessionId: app_client.sessionId
  });
  $.post("patient/saveNewPatient", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    if (parsedData.returnCode == RETURN_CODE_DUP_EMAIL) {
      var args = {
        modalTitle:"Email Address Already In Use", 
        modalH3:"Email Address Already In Use", 
        modalH4:"Please try again with a different email address.",
        cancelButton: null,
        okButton: 'OK'
      };
      RenderUtil.render('dialog/confirm', args, function(s) { 
        $('#modals-placement').append(s);
        $('#modal-confirm').modal('show'); 
        $('#app-modal-confirmation-btn').click(function(){  $('#modal-confirm').modal('hide');});
      });
      return;
    }
    $('#modal-patient').modal('hide');
    $('#modal-patient-search').modal('hide'); 
    pm_saveNewPatient_clearForm();
    app_displayNotification('New patient '+ parsedData.firstName + ' ' + parsedData.lastName + ' created.');
    app_patientSearchDialog(); 
  });
}



function pm_saveNewPatient_clearForm() {
  $('#patient-first-name').val('');
  $('#patient-middle-name').val('');
  $('#patient-last-name').val('');
  $('#patient-preferred-name').val('');
  $('#patient-ssn').val('');
  $('#patient-drivers-license').val('');
  $('#patient-dob').val('');
  $('#patient-gender').val('');
  $('#patient-marital-status').val('');
  $('#patient-race').val('');
  $('#patient-ethnicity').val('');
  $('#patient-address1').val('');
  $('#patient-address2').val('');
  $('#patient-city').val('');
  $('#patient-us-state').val('');
  $('#patient-postal-code').val('');
  $('#patient-status').val('');
  $('#patient-occupation').val('');
  $('#patient-employed').val('');
  $('#patient-employer').val('');
  $('#patient-school').val('');
  $('#patient-school-name').val('');
  $('#patient-primary-phone').val('');
  $('#patient-secondary-phone').val('');
  $('#patient-email').val('');
  $('#patient-ins-carr').val('');
  $('#patient-member-number').val('');
  $('#patient-group-number').val('');
  $('#patient-insured-name').val('');
  $('#patient-clinician').val('');
  util_clearErrors();  
}



function pm_sendPortalInvitation() {
  var args = {
    modalTitle:"Send Portal Invitation", 
    modalH3:"Send Portal Invitation?",
    modalH4:"The client will receive an clickable link to the " + app_practiceClientProperties['app.patient_label'] + " Portal",
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').click(function(){  
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id: app_currentPatientId, module:app_currentModule });
      $.post("patient/sendPortalInvitation", {data:jsonData}, function(data) {
        var parsedData = $.parseJSON(data);
        if (!util_checkSessionResponse(parsedData)) return false;
        $('#modal-confirm').modal('hide'); 
        app_displayNotification('Patient Portal invitation sent');
        $('#patient-invitation-status').html('Invite sent at ' + dateFormat(new Date(), 'mm/dd/yyyy  h:MM TT'));
      }); 
    });
  });
}



function pm_setupPictureUpload($photo) {
  $('#patient-photo-upload').click(function(){ 
    $('#patient-photo-upload-progress .progress-bar').css('width', '0');
  });
  uploader = new qq.FileUploader({
   element: document.getElementById('patient-photo-upload'),
   action: 'patient/uploadProfileImage?sessionId=' + app_client.sessionId + (app_currentPatientId != null ? '&patientId='+app_currentPatientId : ''),
   debug: true,
   allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
   sizeLimit: 1048576,   
   onProgress: function(id, fileName, loaded, total) {
      var progress = parseInt(loaded / total * 100, 10);
      $('#patient-photo-upload-progress .progress-bar').css('width', progress + '%');
   },
   onComplete: function(id, fileName, responseJSON) {
     $('#patient-photo-upload-progress .progress-bar').css('width', '100%');
     var response = parsedData = $.parseJSON(responseJSON);
     app_profileImageTempPath = response.filename;
     var photoEl = $photo || $("#patient-photo");
     if (app_currentPatient != null) {
       app_currentPatientProfileImage = 
       'patient/getPatientProfileImage?sessionId=' + app_client.sessionId + '&patientId=' + app_currentPatient.id  + '&module=' + app_currentModule;
       photoEl.attr('src', app_currentPatientProfileImage);
     }
     else {
       photoEl.attr('src', 'patient/getTempPatientProfileImage?sessionId=' + app_client.sessionId + "&profileImagePath=" + app_profileImageTempPath);
     }
   }
  }); 
}



function pm_updatePatientInfoForms() {
 
  var forms = $('input[name=forms]:checked').map(function() {return this.value;}).get().join(',');
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    patientId: app_currentPatientId,
    forms: forms
  });
  $.post("patient/updatePatientInfoForms", {data:jsonData}, function(data) {
  });
 
}



function pm_updatePatientInfoPrograms() {
  var programs = $('input[name=programs]:checked').map(function() {return this.value;}).get().join(',');
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    id: app_currentPatientId,
    updateProperty:'entity-Patient.programs',
    updatePropertyValue: programs,
    updatePropertyFieldType:'text'
  });
  $.post("app/updateField", {data:jsonData}, function(data) {
  });
}



function pm_updateSavedPatient(property, value, id) {
  var jsonData = JSON.stringify({
    sessionId: app_client.sessionId, 
    module:app_currentModule,
    updateProperty:property,
    updatePropertyValue:value,
    id: id
  });
  $.post("patient/updatePatient", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
  }); 
}
