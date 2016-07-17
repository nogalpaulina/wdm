
function app_closePatientIntake() {
  var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("patient/closePatientIntake", {data:jsonData}, function(data) {
    app_patientIntake = $.parseJSON(data);
    app_currentPatient.intakeClosed = true;
    
    var modalTitle = app_practiceClientProperties['app.patient_label'] + ' Intake Forms Submitted';
    var modalH3 = app_practiceClientProperties['app.patient_label'] = ' Intake Forms Successfully Submitted';
    var modalH4 = 'You may now either continue on to view your ' + app_practiceClientProperties['app.patient_label'] + ' Portal or log out.';
    var cancelButton = 'Logout';
    var okButton = 'Continue';
    
    if (app_currentModule == EHR_MODULE) {
      modalTitle = app_practiceClientProperties['app.patient_label'] + ' Intake Closed';
      modalH3 = app_practiceClientProperties['app.patient_label'] + ' Intake Successfully Closed'; 
      modalH4 = '';
      cancelButton = null;
      okButton: 'Ok'
    }
    
    var args = {
      modalTitle: modalTitle,
      modalH3: modalH3,
      modalH4: modalH4,
      cancelButton: cancelButton,
      okButton: okButton
    };
    RenderUtil.render('dialog/confirm', args, function(s) { 
      $('#modals-placement').html(s);
      $('#modal-confirm').modal('show'); 
      $('#app-modal-confirmation-btn').click(function(){  
        $('#modal-confirm').modal('hide');
        app_viewStack('dashboard-screen', DO_SCROLL);
      });
      $('#app-modal-cancel-btn').click(function(){  
        app_logout();
      });
    });
    
  });
}



function app_handlePatientIntakeWizardNavigation(screenNumber) {
  app_intakeRecordsViewStack($('#forms-subscreen-'+screenNumber), true);
  $('.stepwizard').hide();
  $('.stepwizard-buttons').hide();
  $('.stepwizard-'+screenNumber).show();
  $('#stepwizard-buttons-'+screenNumber).show();
  if (screenNumber == app_finalScreenNumber) {
    app_evaluatePatientIntakeInput();
  }
}



function app_initSelectpickers() {
  $('.selectpicker').selectpicker();
  $('.selectpicker').on('change', function() {
    var selectedValues = "";
    $('.select-picker option:selected').each(function() {
      selectedValues += $(this).val() + ',';
    });
    updateField($(this));
  });
}

  
  
function app_loadIntakeForm(intakeForm, formIndex) {
  var name = intakeForm.name;
  var loader = intakeForm.loader;
  util_debug('in loadIntakeform(' + name + ')');
  
  // Top Nav Circles
  RenderUtil.render('component/stepwizard', {i:formIndex, intakeFormIndices:app_intakeFormIndices}, function(s) { 
    $('#intake-records').append(s); 
    $('.stepwizard').hide();
    if (app_currentPatient.intakeClosed == true) { $('.stepwizard-1').show();}
    
    // The Form Body
    RenderUtil.render(intakeForm.template, {i:formIndex}, function(s) {
      $('#intake-records').append(s);
      window[loader](intakeForm);
      if (app_currentPatient.intakeClosed == true) { 
        $('#forms-subscreen-'+formIndex+' .input-field').attr("disabled", "disabled");
        $('#forms-subscreen-'+formIndex+' .input-select').attr("disabled", "disabled");
        $('#forms-subscreen-'+formIndex+' .selectpicker').attr("disabled", "disabled");
        $('#forms-subscreen-'+formIndex+' .input-checkbox').attr("disabled", "disabled");
        $('#forms-subscreen-'+formIndex+' .input-radio').attr("disabled", "disabled");
        $('#forms-subscreen-'+formIndex+' .desc-text').attr("readonly", "readonly");
        $('#forms-subscreen-'+formIndex+' .radio-btn-group a').attr("disabled", "disabled");
      }
      else {
        $('#forms-subscreen-'+formIndex+' .input-field').blur( function() { form_validateAndUpdateField(this) });
        $('#forms-subscreen-'+formIndex+' .input-checkbox').click( function() { form_validateAndUpdateField(this) });
        $('#forms-subscreen-'+formIndex+' .input-checkbox-group').click(function() { form_updateField($(this)) });
        $('#forms-subscreen-'+formIndex+' .input-radio').click(function() { form_updateField($(this)) });
        $('#forms-subscreen-'+formIndex+' .input-select').change(function() { form_updateField($(this)) });
        $('.input-date').mask("99/99/9999");
      }
      if (app_currentPatient.intakeClosed == true) { $("#forms-subscreen-1").show(); }
      
      // Bottom Nav Circles
      RenderUtil.render('component/stepwizard', {i:formIndex, intakeFormIndices:app_intakeFormIndices}, function(s) { 
        $('#intake-records').append(s); 
        $('.stepwizard').hide();
        if (app_currentPatient.intakeClosed == true) { $('.stepwizard-1').show(); }
        
        // Bottom Nav Buttons
        RenderUtil.render('component/stepwizard_buttons', {i:formIndex}, function(s) { 
          $('#intake-records').append(s); 
          if (app_currentPatient.intakeClosed == true) { 
            $('#stepwizard-buttons-1').show(); 
            $('.intake-records-step-'+app_finalScreenNumber+'-btn').hide();
            $('.intake-records-step-0-btn').hide();
          } 
          $('.intake-records-step-btn, .stepwizard-btn-circle').off('click').on('click', function() { 
            app_handlePatientIntakeWizardNavigation($(this).attr('name')) 
          });
        });
      });
    });
  });
}



function app_loadIntakeForms() {
  app_finalScreenNumber = app_patientIntake.practiceForms.length+1;
  app_finalScreenButton = app_finalScreenNumber+1;
  
  $("#intake-records").html('');
  
  app_intakeFormIndices = [];
  for (var i=0;i<app_patientIntake.practiceForms.length;i++) {
    app_intakeFormIndices.push({'i': i+1});
  }
  
  for (var i=0;i<app_patientIntake.practiceForms.length;i++) {
    util_debug('inspecting: ' + app_patientIntake.practiceForms[i].name)
    app_loadIntakeForm(app_patientIntake.practiceForms[i], i+1);
  }
}



function app_renderCreatePasswordForm() {
  var args = {securityQuestions:false};
  RenderUtil.render('dialog/create_password', args, function(s) { 
    $('#modals-placement').html(s);
    $('#modal-create-password').modal('show'); 
    $('#app-create-password-submit').click(function(){ app_submitCreatePasswordForm(); });
  });
}



function app_renderPatientIntakeScreen() {
  var jsonData = JSON.stringify({ id: app_currentPatient.id, module:app_currentModule, sessionId: app_client.sessionId });
  $.post("patient/getPatientIntake", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_patientIntake = parsedData.object;
    app_finalScreenNumber = app_patientIntake.forms.split(',').length + 1;
    app_finalScreenButton = app_finalScreenNumber + 1;
    
    RenderUtil.render('screen/intake_records_screen', {lastScreenNum:app_finalScreenNumber}, function(s) {
      
      if (app_currentModule == EHR_MODULE) {
        $("#patient-chart-item-screen").html(s);
        app_showScreen('Patient Intake', app_patientChartItemCache);
        $("#patient-chart-item-screen").show();
        app_patientChartItemStack($('#intake-records-screen'), true);
        if (app_currentPatient.intakeClosed == true) {
          app_intakeRecordsViewStack($('#forms-subscreen-1'), true);
          $("#forms-subscreen-1").show();
        }
        else {
          app_intakeRecordsViewStack($('#forms-subscreen-0'), true);
          $("#forms-subscreen-0").show();
        }
      }
      else if (app_currentModule == PORTAL_MODULE) {
        $("#intake-records-screen").html(s);
        app_viewStack('intake-records-screen', DO_SCROLL);
        app_intakeRecordsViewStack($('#forms-subscreen-0'), true);
      }
      
      if (app_currentPatient.passwordCreated != true) {
        app_renderCreatePasswordForm();
      }
      
      $('#pi-doctor-profile-image').attr('src', 'assets/images/practice/'+PRACTICE+'/'+app_practiceClientProperties['app.image.practitioner']);
      $('.practice-logo').attr('src', 'assets/images/practice/'+PRACTICE+'/'+app_practiceClientProperties['app.image.practice_logo']); 
      $('.business-address').html(app_practiceClientProperties['app.business_address']); 
      app_loadIntakeForms();
    });
  });
}



function app_submitCreatePasswordForm() {
  var isValid = true;
  util_clearErrors();
  var ssn = "";
  var driversLicense = "";
  
  var password = $.trim($("#app-new-password").val());
  var passwordConfirm = $.trim($("#app-new-password-confirm").val());
  
  if(password.length < 1) { util_showError($('#app-new-password')); isValid = false; }
  if (password.length > 0) {
    if(password.length < 6 || passwordConfirm.length < 6) { 
      util_showError($('#app-new-password'), 'must be at least 6 chararcters long'); 
      isValid = false; 
    }
    if(util_checkPassword(password) == false) { 
      util_showError($('#app-new-password'), 'must contain a lowercase, uppercase, digit, and special character'); 
      isValid = false; 
    }
    if(password != passwordConfirm) { 
      util_showError($('#app-new-password'), 'passwords must match'); 
      isValid = false; 
    }
  }
  
    if (app_practiceClientProperties['app.security_questions'] == true) {
    ssn = $.trim($("#app-new-password-ssn").val());
    driversLicense = $.trim($("#app-new-password-drivers-license").val());
    if (ssn.length < 4 && driversLicense.length < 4) { 
      util_showError($('#app-new-password-ssn'), 'SSN or Drivers License must be 4 digits'); 
      isValid = false; 
    }
  }
  
  if (isValid) {  
    var jsonData = JSON.stringify({ id: app_currentPatient.id, 
                                    module:app_currentModule,
                                    password: password, 
                                    govtId: ssn, 
                                    driversLicense: driversLicense, 
                                    sessionId: app_client.sessionId });
    $.post("patient/createPassword", {data:jsonData}, function(data) {
      var parsedData = $.parseJSON(data);
      if (parsedData.returnCode == RETURN_CODE_VALID) {
        $('#modal-create-password').modal('hide');
        app_displayNotification('Password Successfully Created');
      }
      else {
        if (parsedData.returnCode == RETURN_CODE_INVALID_PASSWORD) {
          util_showError($('#app-new-password'), parsedData.errorMsg); 
        }
        else if (parsedData.returnCode == RETURN_CODE_INVALID_SSN) {
          util_showError($('#app-new-password-ssn'), parsedData.errorMsg); 
        }
      }
    });
  }
}

