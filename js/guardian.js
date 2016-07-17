
function pm_clearGuardianForm() {
  $('#patient-g-first-name').val('');
  $('#patient-g-middle-name').val('');
  $('#patient-g-last-name').val('');
  $('#patient-g-rel').val('');
  $('#patient-g-address1').val('');
  $('#patient-g-city').val('');
  $('#patient-g-postal-code').val('');
  $('#patient-g-email').val('');
  $('#patient-g-phone').val('');
  $('#patient-g-state').val('');
}

function pm_clearNewGuardianForm() {
  $('#guardian-first-name').val('');
  $('#guardian-middle-name').val('');
  $('#guardian-last-name').val('');
  $('#guardian-rel').val('');
  $('#guardian-address1').val('');
  $('#guardian-city').val('');
  $('#guardian-postal-code').val('');
  $('#guardian-email').val('');
  $('#guardian-phone').val('');
  $('#guardian-state').val('');
}



function pm_confirmGuardianRemoval() {
    var args = {
    modalTitle:"Remove Guardian", 
    modalH3:"Remove Guardian?",
    modalH4:"This will remove the guardian from the client ",
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').off('click').on('click', function() {  
      var jsonData = JSON.stringify({ 
        sessionId: app_client.sessionId,
        id: app_currentPatientId,
        updateProperty:'entity-Patient.guardian',
        updatePropertyValue: null,
        updatePropertyFieldType:'object'
      });
      $.post("app/updateField", {data:jsonData}, function(data) {
        app_displayNotification('Guardian Removed');
        app_currentPatient.guardian = null;
        $('#modal-confirm').modal('hide'); 
        $('#patient-form-guardian-section').hide();
        $('#patient-guardian').val('');
        $('#patient-guardian-form-group').hide();
        $("input[name=hasGuardian][value=true]").attr("checked", false);
        $('#patient-email-form-group').show();
      });
    });
    
    $('#app-modal-cancel-btn').off('click').on('click', function() {  
      $('#patient-guardian-status').prop('checked', true);
      $('#patient-guardian').val(app_currentPatient && app_currentPatient.guardian ? app_currentPatient.guardian.id : '');
    });
 });
}



function pm_editGuardianForm() {
  
}


function pm_findGuardianById(id) {
  for (var i=0;i<app_guardians.length;i++) {
    if (app_guardians[i].id == id) {
      return app_guardians[i];
    }
  }
  return null;
}



function pm_getGuardians(guardianId) {
  jsonData = JSON.stringify({sessionId: app_client.sessionId,  module:app_currentModule});
    $.post("patient/getGuardians", {data:jsonData}, function(data) {
      var parsedData = $.parseJSON(data);
      app_guardians = parsedData.guardians;
      RenderUtil.render('component/person_select_options', {options:app_guardians}, function(s) {
        $("#patient-guardian").html(s);
        //$('#patient-guardian').val(app_currentPatient && app_currentPatient.guardian ? app_currentPatient.guardian.id : '');
        
        if (guardianId) {
          $('#patient-guardian').val(guardianId);
          app_currentGuardian = pm_findGuardianById(guardianId);
          pm_loadGuardianSection();
        }
        else {
          $('#patient-guardian').val('');
        }
                
                
        $('#patient-guardian').off('change').on('change', function() { 
          if ($(this).val() == '') {
            pm_confirmGuardianRemoval();
            return;
          }
          app_currentGuardian = pm_findGuardianById($(this).val());
          if (app_currentGuardian != null) {
            pm_loadGuardianSection();
            
            var jsonData = JSON.stringify({ 
              sessionId: app_client.sessionId,
              patientId: app_currentPatientId,
              id: app_currentGuardian.id,
            });
            if (app_currentPatient) {
              $.post("patient/updatePatientGuardian", {data:jsonData}, function(data) {
                app_currentPatient.guardian = app_currentGuardian;
                app_displayNotification('Guardian Added');
              });
            }
          }
          else {
            $('#patient-form-guardian-section').hide();
          }
        });
    });
  });
}



function pm_handleHasGuardianClick() {
  if ( $('#patient-guardian-status').prop('checked') == false) {
    if ($('#patient-guardian').val() == '') {
      $('#patient-form-guardian-section').hide();
      $('#patient-guardian-form-group').hide();
      $('#patient-email-form-group').show();
    }
    else {
      pm_confirmGuardianRemoval();
    }
  }
  else {
    $('#patient-new-guardian-btn').show();
    $('#patient-guardian-form-group').show();
    $('#patient-email-form-group').css({display: "none"});
    $('#patient-email').val('');
  }
}



function pm_loadGuardianSection() {
  pm_clearNewGuardianForm();
  $('#patient-form-guardian-section').show();
  $('#patient-g-first-name').val(app_currentGuardian.firstName);
  $('#patient-g-middle-name').val(app_currentGuardian.middleName);
  $('#patient-g-last-name').val(app_currentGuardian.lastName);
  $('#patient-g-rel').val(app_currentGuardian.relation);
  $('#patient-g-address1').val(app_currentGuardian.streetAddress1);
  $('#patient-g-city').val(app_currentGuardian.city);
  $('#patient-g-postal-code').val(app_currentGuardian.postalCode);
  $('#patient-g-email').val(app_currentGuardian.email);
  $('#patient-g-phone').val(app_currentGuardian.primaryPhone);
  $('#patient-g-state').val(app_currentGuardian.usState ? app_currentGuardian.usState.id : ''); 
  if (app_currentPatient != null) {
    //$('#patient-form-guardian-section').attr('data-instance-id', app_currentPatient.guardian.id);
    $('#patient-form-guardian-section').attr('data-instance-id', app_currentGuardian.id);
  }
}



function pm_newGuardianForm() {
  RenderUtil.render('form/'+SPECIALTY+'/guardian_form', {}, function(s) {
    $('#modals-placement').append(s);
    $('#modal-new-guardian').modal('show');
    pm_clearNewGuardianForm();
    RenderUtil.render('component/basic_select_options', {options:app_usStates, collection:'app_usStates', choose:true}, function(s) {
      $("#guardian-state").html(s); 
    });
    $('#guardian-postal-code').mask("99999");
    $("#modal-new-guardian").on('hidden.bs.modal', function () { $(this).data('bs.modal', null); pm_clearNewGuardianForm();});
    $('#app-create-guardian-submit').off('click').on('click', function(){ pm_saveNewGuardian() });
  });
}



function pm_saveNewGuardian() {
  var isValid = true;
  util_clearErrors();  

  if($("#guardian-first-name").val().length < 1) { 
    util_showError($('#guardian-first-name'));
    isValid = false;
  }
  if($("#guardian-last-name").val().length < 1) { 
    util_showError($('#guardian-last-name'));
    isValid = false;
  }
  var emailValid = util_checkRegexp($.trim($("#guardian-email").val()), /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
  if(emailValid == false) {
    util_showError($('#guardian-email'), 'invalid email address');
    isValid = false;
  }
  
  if (isValid == false) {
    return;
  }
  
  var jsonData = JSON.stringify({ 
    module:app_currentModule,
    lastName: $('#guardian-last-name').val(), 
    firstName: $('#guardian-first-name').val(), 
    middleName: $('#guardian-middle-name').val(), 
    address1: $('#guardian-address1').val(), 
    city: $('#guardian-city').val(), 
    usState: $('#guardian-us-state').val() ? $('#guardian-us-state').val() : 0,
    postalCode: $('#guardian-postal-code').val(), 
    relation: $('#guardian-rel').val(), 
    primaryPhone: $('#guardian-phone').val(), 
    email: $('#guardian-email').val(),
    patientId: app_currentPatient ? app_currentPatient.id : null,
    sessionId: app_client.sessionId
  });
  $.post("patient/saveNewGuardian", {data:jsonData}, function(data) {
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
    $('#modal-new-guardian').modal('hide');
    pm_clearNewGuardianForm();
    pm_getGuardians(parsedData.id);
    app_displayNotification('New guardian '+ parsedData.firstName + ' ' + parsedData.lastName + ' created.');
  });
}


function pm_setupGuardian() {
  if (app_currentPatient != null && app_currentPatient.guardian != null) {
    $("input[name=hasGuardian][value=true]").attr("checked", true);
    $('#patient-new-guardian-btn').show();
    $('#patient-form-guardian-section').show();
    $('#patient-g-postal-code').mask("99999");
    $('#patient-email-form-group').css({display: "none"});
    $('#patient-email').val('');
    $('#patient-g-first-name').val(app_currentPatient.guardian.firstName);
    $('#patient-g-middle-name').val(app_currentPatient.guardian.middleName);
    $('#patient-g-last-name').val(app_currentPatient.guardian.lastName);
    $('#patient-g-rel').val(app_currentPatient.guardian.relation);
    $('#patient-g-address1').val(app_currentPatient.guardian.streetAddress1);
    $('#patient-g-city').val(app_currentPatient.guardian.city);
    $('#patient-g-postal-code').val(app_currentPatient.guardian.postalCode);
    $('#patient-g-email').val(app_currentPatient.guardian.email);
    $('#patient-g-phone').val(app_currentPatient.guardian.primaryPhone);
    $('#patient-form-guardian-section').attr('data-instance-id', app_currentPatient.guardian.id);      
  }
  RenderUtil.render('component/basic_select_options', {options:app_usStates, collection:'app_usStates', choose:true}, function(s) {
    $("#patient-g-state").html(s); 
    if (app_currentPatient != null && app_currentPatient.guardian != null) {
      $('#patient-g-state').val(app_currentPatient.usState ? app_currentPatient.usState.id : ''); 
      $('#patient-form-guardian-section').show();
      $('#patient-guardian-form-group').show();
    }
  });
  pm_getGuardians();
  $("input[name=hasGuardian][value=true]").off('click').on('click', function(){ pm_handleHasGuardianClick(); });
  $("#patient-new-guardian-btn").off('click').on('click', function(){ pm_newGuardianForm(); });
}
