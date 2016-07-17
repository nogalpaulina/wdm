


function pot_ehr_closeOTIntake(e) {
  var args = {
    modalTitle:"Develmental Hx Form?", 
    modalH3:"Complete Dev Hx?",
    modalH4:"Once completed, the Dev Hx form will be read-only.",
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
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_devHx.id});
      $.post("patient/closeDevHx", {data:jsonData}, function(data) {
        app_displayNotification('Developmentat Hx Completed.');
        pot_ehr_renderClosedDevHx();
      }); 
      
    }); 
  });
}



function pot_ehr_loadDevHxForm() {
  $('#dev-hx-form').attr('data-instance-id', app_devHx.id);  
  $('#dev-hx-form .selectpicker').selectpicker();
  $("#dev-hx-form input[data-field-type='date']").mask("99/99/9999");
  $('#dev-hx-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#dev-hx-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#dev-hx-form .input-checkbox').click(function() { form_validateAndUpdateField(this) });
  $('#dev-hx-form .input-checkbox-group').click(function() { form_updateField($(this)) });
  
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { 
    $("#dev-hx-gender").html(s); 
    if (app_currentPatient.gender) {$('#dev-hx-gender').val(app_currentPatient.gender.id);}
  });
    
  $('#dev-hx-date').html(dateFormat(app_devHx.createdDate, 'mm/dd/yyyy'));
  $('#dev-hx-concerns').val(app_patientForm.concerns);
  $('#dev-hx-first-name').val(app_currentPatient.firstName);
  $('#dev-hx-middle-name').val(app_currentPatient.middleName);
  $('#dev-hx-last-name').val(app_currentPatient.lastName);
  $('#dev-hx-nick-name').val(app_patientForm.nickName);
  if (app_currentPatient.dob) {$('#dev-hx-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  $('#dev-hx-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  $('#dev-hx-siblings').val(app_patientForm.siblings);
  $('#dev-hx-school-name').val(app_patientForm.schoolName);
  $('#dev-hx-grade').val(app_patientForm.grade);
  $('#dev-hx-teachers').val(app_patientForm.teachers);
  $('#dev-hx-class-type').val(app_patientForm.classType);
  $('#dev-hx-classroom-asst').val(app_patientForm.classroomAsst);
  $('#dev-hx-pcp-name').val(app_patientForm.pcpName);
  $('#dev-hx-ref-source').val(app_patientForm.refSource);
  $('#dev-hx-ref-source-other').val(app_patientForm.refSourceOther);
  $('#dev-hx-ref-source-email').val(app_patientForm.refSourceEmail);
  $('#dev-hx-ref-source-phone').val(app_patientForm.refSourcePhone);
  $('#dev-hx-ref-source-street-address1').val(app_patientForm.refSourceStreetAddress1);
  $('#dev-hx-ref-source-city').val(app_patientForm.refSourceCity);
  if (app_patientForm.refSourceUSState) {$('#dev-hx-ref-source-us-state').val(app_patientForm.refSourceUSState.id);}
  $('#dev-hx-ref-source-postal-code').val(app_patientForm.refSourcePostalCode);
  $('#dev-hx-ins-name').val(app_patientForm.insName);
  $('#dev-hx-policy-number').val(app_patientForm.policyNumber);
  $('#dev-hx-has-dx').val(util_booleanToInteger(app_patientForm.hasDx));
  $('#dev-hx-dx').val(app_patientForm.dx);
  $('#dev-hx-adopted').val(util_booleanToInteger(app_patientForm.adopted));
  $('#dev-hx-adoption-details').val(app_patientForm.adoptionDetails);
  
  $('#dev-hx-purpose').val(app_devHx.purpose);
  $('#dev-hx-second-opinion').val(util_booleanToInteger(app_devHx.secondOpinion));
  $('#dev-hx-guardian-goals').val(app_devHx.guardianGoals);
  util_selectCheckboxesFromList(app_devHx.medHist, 'medHist');
  $('#dev-hx-med-hist-other').val(app_devHx.medHistOther);
  $('#dev-hx-precautions').val(app_devHx.precautions);
  $('#dev-hx-birth-country').val(app_devHx.birthCountry);
  $('#dev-hx-age-adopted').val(app_devHx.ageAdopted);
  $('#dev-hx-foster').val(util_booleanToInteger(app_devHx.foster));
  util_selectCheckboxesFromList(app_devHx.pregDiff, 'pregDiff');
  $('#dev-hx-birth-weight').val(app_devHx.birthWeight);
  $('#dev-hx-apgar').val(app_devHx.apgar);
  util_selectCheckboxesFromList(app_devHx.delivery, 'delivery');
  $('#dev-hx-delivery-other').val(app_devHx.devliveryOther);
  $('#dev-hx-premature-weeks').val(app_devHx.prematureWeeks);
  $('#dev-hx-complications').val(app_devHx.complications);
  $('#dev-hx-complications-after').val(app_devHx.complicationsAfter);
  util_selectCheckboxesFromList(app_devHx.dev, 'dev');
  $('#dev-hx-dev-other').val(app_devHx.devOther);
  $('#dev-hx-colic-months').val(app_devHx.colicMonths);
  $('#dev-hx-stressful-events').val(app_devHx.stressfulEvents);
  $('#dev-hx-smiled').val(app_devHx.smiled);
  $('#dev-hx-walked').val(app_devHx.walked);
  $('#dev-hx-asleep').val(app_devHx.asleep);
  $('#dev-hx-sat').val(app_devHx.sat);
  $('#dev-hx-words').val(app_devHx.words);
  $('#dev-hx-slept').val(app_devHx.slept);
  $('#dev-hx-rolled').val(app_devHx.rolled);
  $('#dev-hx-combined').val(app_devHx.combined);
  $('#dev-hx-urine').val(app_devHx.urine);
  $('#dev-hx-crawled').val(app_devHx.crawled);
  $('#dev-hx-spoke').val(app_devHx.spoke);
  $('#dev-hx-bm').val(app_devHx.bm);
  $('#dev-hx-dev-concerns').val(app_devHx.devConcerns);
  $('#dev-hx-gifts').val(app_devHx.gifts);
  $('input[name=dev-hx-read-doc][value='+app_devHx.readDoc+']').attr("checked", true);
  $('#dev-hx-signed-name').val(app_devHx.signedName);
  $('#dev-hx-signed-rel').val(app_devHx.signedRel);
  if (app_devHx.signedDate) {$('#dev-hx-signed-date').val(dateFormat(app_devHx.signedDate, 'mm/dd/yyyy'));}
  
  pot_pm_renderPatientFormGuardians();
  pot_pm_renderPatientFormEvaluations();
  pot_pm_renderPatientFormTreatments();
  app_renderMedications(app_patientForm.patientMedications);
  
  $('#dev-hx-close-record-btn').on('click', function(e){ pot_ehr_closeDevHx(e); });
} 


  
function pot_ehr_renderClosedDevHx() {
  $('#dev-hx-screen .input-field').attr("readonly", "readonly");
  $('#dev-hx-screen .selectpicker').attr("disabled", "disabled");
  $('#dev-hx-screen .input-select').attr("disabled", "disabled");
  $('#dev-hx-screen .input-checkbox').attr("disabled", "disabled");
  $('#dev-hx-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#dev-hx-close-record-btn').hide();
}
  

  
function pot_ehr_renderDevHxScreen() {
 RenderUtil.render('screen/pot/ehr/dev_hx_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Dev Hx', app_patientChartItemCache);
  app_patientChartItemStack($('#dev-hx-screen'), true);
  
   var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
   $.post("patient/getDevHx", {data:jsonData}, function(data) {
     var parsedData = $.parseJSON(data);
     app_devHx = parsedData.object;
     pot_ehr_loadDevHxForm();
     if (app_devHx.closed == true) {
       pot_ehr_renderClosedDevHx();
     }
   });
 });  
}
  
  
  
