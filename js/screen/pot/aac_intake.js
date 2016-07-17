
function pot_pm_addAACCorrespondence($this) {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId:app_currentPatient.id});
  $.post("patient/addAACCorrespondence", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var corrId = parsedData.id;
    RenderUtil.render('component/'+SPECIALTY+'/aac_correspondence', {id: corrId, instanceName:'pot-entity-form-AACCorrespondence', desc:''}, function(s) { 
      $('#aac-intake-correspondences').append(s); 
      form_initRadioButtonGroups();
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
      $('.aac-corr-delete-control').off().on('click', function() { pot_pm_deleteAACCorrespondence($(this)); });
    });
  }); 
}


function pot_ehr_closeAACIntake(e) {
  var args = {
    modalTitle:"Complete AAC Intake Form?", 
    modalH3:"Complete AAC Intake Form?",
    modalH4:"Once completed, the AAC Intake form will be read-only.",
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').on('click', function() {  
      $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
        $('#modal-confirm').remove();
      });
      $('#modal-new-patient').modal('hide');
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_aacIntake.id});
      $.post("patient/closeAACIntake", {data:jsonData}, function(data) {
        app_displayNotification('Client AAC Intake Completed.');
        pot_ehr_renderClosedAACIntake();
      }); 
      
    }); 
  });
}



function pot_pm_deleteAACCorrespondence($this) {
  var id = $this.attr('data-id');
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id});
  $.post("patient/deleteAACCorrespondence", {data:jsonData}, function(data) { 
    $('#aac-corr-'+id).remove();
  });  
}



function pot_ehr_loadAACIntakeForm() {
  $('#aac-intake-form').attr('data-instance-id', app_aacIntake.id);  
  $('#aac-intake-form .selectpicker').selectpicker();
  $("#aac-intake-form input[data-field-type='date']").mask("99/99/9999");
  $('#aac-intake-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#aac-intake-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#aac-intake-form .input-checkbox').click(function() { form_validateAndupdateField(this) });
  $('#aac-intake-form .input-checkbox-group').click(function() { form_updateField($(this)) });
  
  $('#aac-intake-date').html(dateFormat(app_aacIntake.createdDate, 'mm/dd/yyyy'));
  
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { $("#aac-intake-gender").html(s); });
  $('#aac-intake-concerns').val(app_patientForm.concerns);
  $('#aac-intake-first-name').val(app_currentPatient.firstName);
  $('#aac-intake-middle-name').val(app_currentPatient.middleName);
  $('#aac-intake-last-name').val(app_currentPatient.lastName);
  $('#aac-intake-nick-name').val(app_patientForm.nickName);
  if (app_currentPatient.gender) {$('#aac-intake-gender').val(app_currentPatient.gender.id);}
  if (app_currentPatient.dob) {$('#aac-intake-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  $('#aac-intake-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  $('#aac-intake-siblings').val(app_patientForm.siblings);
  $('#aac-intake-school-name').val(app_patientForm.schoolName);
  $('#aac-intake-grade').val(app_patientForm.grade);
  $('#aac-intake-teachers').val(app_patientForm.teachers);
  $('#aac-intake-class-type').val(app_patientForm.classType);
  $('#aac-intake-classroom-asst').val(app_patientForm.classroomAsst);
  $('#aac-intake-pcp-name').val(app_patientForm.pcpName);
  $('#aac-intake-ref-source').val(app_patientForm.refSource);
  $('#aac-intake-ref-source-other').val(app_patientForm.refSourceOther);
  $('#aac-intake-ref-source-email').val(app_patientForm.refSourceEmail);
  $('#aac-intake-ref-source-phone').val(app_patientForm.refSourcePhone);
  $('#aac-intake-ref-source-street-address1').val(app_patientForm.refSourceStreetAddress1);
  $('#aac-intake-ref-source-city').val(app_patientForm.refSourceCity);
  if (app_patientForm.refSourceUSState) {$('#aac-intake-ref-source-us-state').val(app_patientForm.refSourceUSState.id);}
  $('#aac-intake-ref-source-postal-code').val(app_patientForm.refSourcePostalCode);
  $('#aac-intake-ins-name').val(app_patientForm.insName);
  $('#aac-intake-policy-number').val(app_patientForm.policyNumber);
  $('#aac-intake-has-dx').val(util_booleanToInteger(app_patientForm.hasDx));
  $('#aac-intake-dx').val(app_patientForm.dx);
  $('#aac-intake-adopted').val(util_booleanToInteger(app_patientForm.adopted));
  $('#aac-intake-adoption-details').val(app_patientForm.adoptionDetails);
  
  util_selectCheckboxesFromList(app_aacIntake.cpt, 'cpt');
  $('#aac-intake-ei-service-location').val(app_aacIntake.eiServiceLocation);
  $('#aac-intake-ei-service-type').val(app_aacIntake.eiServiceType);
  $('#aac-intake-ei-service-desc').val(app_aacIntake.eiServiceDesc);
  $('#aac-intake-school-service-location').val(app_aacIntake.schoolServiceLocation);
  $('#aac-intake-school-service-type').val(app_aacIntake.schoolServiceType);
  $('#aac-intake-school-service-desc').val(app_aacIntake.schoolServiceDesc);
  $('#aac-intake-outside-service-location').val(app_aacIntake.outsideServiceLocation);
  $('#aac-intake-outside-service-type').val(app_aacIntake.outsideServiceType);
  $('#aac-intake-outside-service-desc').val(app_aacIntake.outsideServiceDesc);
  $('#aac-intake-parent-school-concerns').val(app_aacIntake.parentSchoolConcerns);
  $('#aac-intake-device-in-use').val(util_booleanToInteger(app_aacIntake.deviceInUse));
  $('#aac-intake-device-desc').val(app_aacIntake.deviceDesc);
  $('#aac-intake-device-trial').val(util_booleanToInteger(app_aacIntake.deviceTrial));
  $('#aac-intake-device-trial-desc').val(app_aacIntake.deviceTrialDesc);
  $('#aac-intake-sign-language').val(util_booleanToInteger(app_aacIntake.signLanguage));
  $('#aac-intake-low-tech-device').val(util_booleanToInteger(app_aacIntake.lowTechDevice));
  $('#aac-intake-people-comm').val(app_aacIntake.peopleComm);
  util_selectCheckboxesFromList(app_aacIntake.receptiveLanguage, 'receptiveLanguage');
  $('#aac-intake-receptive-other').val(app_aacIntake.receptiveOther);
  $('#aac-intake-vocab-other').val(app_aacIntake.vocabOther);
  util_selectCheckboxesFromList(app_aacIntake.expressiveLanguage, 'expressiveLanguage');
  $('#aac-intake-utter-desc').val(app_aacIntake.utterDesc);
  $('#aac-intake-gramm-structures').val(util_booleanToInteger(app_aacIntake.grammStructures));
  $('#aac-intake-gramm-structures-desc').val(app_aacIntake.grammStructuresDesc);
  $('#aac-intake-convey-needs-desc').val(app_aacIntake.conveyNeedsDesc);
  util_selectCheckboxesFromList(app_aacIntake.speechProd, 'speechProd');
  $('#aac-intake-speech-prod-other').val(app_aacIntake.speechProdOther);
  util_selectCheckboxesFromList(app_aacIntake.hearing, 'hearing');
  $('#aac-intake-speech-hearing-other').val(app_aacIntake.hearingOther);
  util_selectCheckboxesFromList(app_aacIntake.vision, 'vision');
  $('#aac-intake-speech-vision-other').val(app_aacIntake.visionOther);
  util_selectCheckboxesFromList(app_aacIntake.grossMotor, 'grossMotor');
  $('#aac-intake-speech-gross-motor-other').val(app_aacIntake.grossMotorOther);
  util_selectCheckboxesFromList(app_aacIntake.transp, 'transp');
  $('#aac-intake-speech-transp-other').val(app_aacIntake.transpOther);
  util_selectCheckboxesFromList(app_aacIntake.fineMotor, 'fineMotor');
  util_selectCheckboxesFromList(app_aacIntake.altPhys, 'altPhys');
  $('#aac-intake-speech-alt-phys-desc').val(app_aacIntake.altPhysDesc);
  $('#aac-intake-has-assistant').val(util_booleanToInteger(app_aacIntake.hasAssistant));
  $('#aac-intake-assistant-desc').val(app_aacIntake.assistantDesc);
  $('#aac-intake-accom').val(app_aacIntake.accom);
  $('#aac-intake-has-priv-ins').val(util_booleanToInteger(app_aacIntake.hasPrivIns));
  $('#aac-intake-has-medicare').val(util_booleanToInteger(app_aacIntake.hasMedicare));
  $('#aac-intake-med-hist').val(app_aacIntake.medHist);
  
  $('#aac-intake-close-record-btn').on('click', function(e){ pot_ehr_closeAACIntake(e); });
  pot_pm_renderAACCorrespondences();
}



function pot_ehr_renderAACIntakeScreen() {
 RenderUtil.render('screen/pot/ehr/aac_intake_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('AAC Therapy Intake', app_patientChartItemCache);
  app_patientChartItemStack($('#aac-intake-screen'), true);
  
  var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
  $.post("patient/getAACIntake", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_aacIntake = parsedData.object;
    pot_ehr_loadAACIntakeForm();
    if (app_aacIntake.closed == true) {
      pot_ehr_renderClosedAACIntake();
    }
  });
 });  
}



function pot_pm_renderAACCorrespondences() {
  RenderUtil.render('component/'+SPECIALTY+'/aac_correspondences', {list: app_aacIntake.cors, instanceName:'pot-entity-form-AACCorrespondence'}, function(s) { 
    $('#aac-intake-correspondences').html(s); 
    $("#aac-intake-correspondences input[data-field-type='date']").mask("99/99/9999");
    
    if (app_aacIntake.closed == false) {
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
      $('.aac-corr-delete-control').click(function() { pot_pm_deleteAACCorrespondence($(this)); });
      $('#new-aac-intake-correspondence-btn').click(function() { pot_pm_addAACCorrespondence($(this)); });
    }
    else {
      $('.aac-corr-delete-control').hide();
      $('#aac-intake-correspondences .list-item-field').attr("readonly", "readonly");
    }
  });
}



function pot_ehr_renderClosedAACIntake() {
  $('#aac-intake-screen .input-field').attr("readonly", "readonly");
  $('#aac-intake-screen .selectpicker').attr("disabled", "disabled");
  $('#aac-intake-screen .input-select').attr("disabled", "disabled");
  $('#aac-intake-screen .input-checkbox').attr("disabled", "disabled");
  $('#aac-intake-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#aac-intake-close-record-btn').hide();
}