function pot_ehr_closeOTIntake(e) {
  var args = {
    modalTitle:"Complete OT Intake Form?", 
    modalH3:"Complete OT Intake Form?",
    modalH4:"Once completed, the OT Intake form will be read-only.",
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
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_otIntake.id});
      $.post("patient/closeOTIntake", {data:jsonData}, function(data) {
        app_displayNotification('Client OT Intake Completed.');
        pot_ehr_renderClosedOTIntake();
      }); 
      
    }); 
  });
}



function pot_ehr_loadOTIntakeForm() {
  $('#ot-intake-form').attr('data-instance-id', app_otIntake.id);  
  $('#ot-intake-form .selectpicker').selectpicker();
  $("#ot-intake-form input[data-field-type='date']").mask("99/99/9999");
  $('#ot-intake-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#ot-intake-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#ot-intake-form .input-checkbox').click(function() { form_validateAndUpdateField(this) });
  $('#ot-intake-form .input-checkbox-group').click(function() { form_updateField($(this)) });
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { 
    $("#ot-intake-gender").html(s); 
    if (app_currentPatient.gender) {$('#ot-intake-gender').val(app_currentPatient.gender.id);}
  });
    
  $('#ot-intake-date').html(dateFormat(app_otIntake.createdDate, 'mm/dd/yyyy'));
  $('#ot-intake-concerns').val(app_patientForm.concerns);
  $('#ot-intake-first-name').val(app_currentPatient.firstName);
  $('#ot-intake-middle-name').val(app_currentPatient.middleName);
  $('#ot-intake-last-name').val(app_currentPatient.lastName);
  $('#ot-intake-nick-name').val(app_patientForm.nickName);
  if (app_currentPatient.dob) {$('#ot-intake-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  $('#ot-intake-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  $('#ot-intake-siblings').val(app_patientForm.siblings);
  $('#ot-intake-school-name').val(app_patientForm.schoolName);
  $('#ot-intake-grade').val(app_patientForm.grade);
  $('#ot-intake-teachers').val(app_patientForm.teachers);
  $('#ot-intake-class-type').val(app_patientForm.classType);
  $('#ot-intake-classroom-asst').val(app_patientForm.classroomAsst);
  $('#ot-intake-pcp-name').val(app_patientForm.pcpName);
  $('#ot-intake-ref-source').val(app_patientForm.refSource);
  $('#ot-intake-ref-source-other').val(app_patientForm.refSourceOther);
  $('#ot-intake-ref-source-email').val(app_patientForm.refSourceEmail);
  $('#ot-intake-ref-source-phone').val(app_patientForm.refSourcePhone);
  $('#ot-intake-ref-source-street-address1').val(app_patientForm.refSourceStreetAddress1);
  $('#ot-intake-ref-source-city').val(app_patientForm.refSourceCity);
  if (app_patientForm.refSourceUSState) {$('#ot-intake-ref-source-us-state').val(app_patientForm.refSourceUSState.id);}
  $('#ot-intake-ref-source-postal-code').val(app_patientForm.refSourcePostalCode);
  $('#ot-intake-ins-name').val(app_patientForm.insName);
  $('#ot-intake-policy-number').val(app_patientForm.policyNumber);
  $('#ot-intake-has-dx').val(util_booleanToInteger(app_patientForm.hasDx));
  $('#ot-intake-dx').val(app_patientForm.dx);
  $('#ot-intake-adopted').val(util_booleanToInteger(app_patientForm.adopted));
  $('#ot-intake-adoption-details').val(app_patientForm.adoptionDetails);
  $('#ot-intake-purpose').val(app_otIntake.purpose);
  $('#ot-intake-second-opinion').val(util_booleanToInteger(app_otIntake.secondOpinion));
  $('#ot-intake-medical-history').val(app_otIntake.medicalHistory);
  $('#ot-intake-issues').val(app_otIntake.issues);
  $('#ot-intake-emotional').val(app_otIntake.emotional);
  $('#ot-intake-social').val(app_otIntake.social);
  if (app_otIntake.langDev) {$("#ot-intake-lang-dev").selectpicker('val', app_otIntake.langDev.split(",")); $("ot-intake-lang-dev").selectpicker('refresh');}
  $('#ot-intake-lang-dev-other').val(app_otIntake.langDevOther);
  $('#ot-intake-sensory-visual').val(app_otIntake.sensoryVisual);
  $('#ot-intake-sensory-auditory').val(app_otIntake.sensoryAuditory);
  $('#ot-intake-sensory-vestibular').val(app_otIntake.sensoryVestibular);
  $('#ot-intake-sensory-tactile').val(app_otIntake.sensoryTactile);
  $('#ot-intake-sensory-proprioception').val(app_otIntake.sensoryProprioception);
  $('#ot-intake-sensory-taste-smell').val(app_otIntake.sensoryTasteSmell);
  $('#ot-intake-sensory-multi').val(app_otIntake.sensoryMulti);
  $('#ot-intake-sensory-sleep').val(app_otIntake.sensorySleep);
  $('#ot-intake-sensory-praxis-motor').val(app_otIntake.sensoryPraxisMotor);
  $('#ot-intake-gross-motor').val(app_otIntake.grossMotor);
  $('#ot-intake-fine-motor-handedness').val(app_otIntake.fineMotorHandedness);
  $('#ot-intake-fine-motor').val(app_otIntake.fineMotor);
  $('#ot-intake-visual-percep-motor').val(app_otIntake.visualPercepMotor);
  if (app_otIntake.ocular) {$("#ot-intake-ocular").selectpicker('val', app_otIntake.ocular.split(",")); $("ot-intake-ocular").selectpicker('refresh');}
  $('#ot-intake-ocular-desc').val(app_otIntake.ocularDesc);
  $('#ot-intake-daily-living').val(app_otIntake.dailyLiving);
  $('#ot-intake-nutrition').val(app_otIntake.nutrition);
  if (app_otIntake.feeding) {$("#ot-intake-feeding").selectpicker('val', app_otIntake.feeding.split(",")); $("ot-intake-feeding").selectpicker('refresh');}
  $('#ot-intake-oral-motor-control').val(app_otIntake.oralMotorControl);
  $('#ot-intake-cough-gag-choke').val(app_otIntake.coughGagChoke);
  $('#ot-intake-food-repertoire').val(app_otIntake.foodRepertoire);
  $('#ot-intake-favorite-foods').val(app_otIntake.favoriteFoods);
  $('#ot-intake-foods-avoided').val(app_otIntake.foodsAvoided);
  $('#ot-intake-eating-habits').val(app_otIntake.eatingHabits);
  $('#ot-intake-drinking-habits').val(app_otIntake.drinkingHabits);
  $('#ot-intake-family-diet-and-limitations').val(app_otIntake.familyDietAndLimitations);
  $('#ot-intake-eat-with-family').val(util_booleanToInteger(app_otIntake.eatWithFamily));
  $('#ot-intake-eating-location').val(app_otIntake.eatingLocation);
  $('#ot-intake-sitting-duration').val(app_otIntake.sittingDuration);
  $('#ot-intake-needs-distraction').val(util_booleanToInteger(app_otIntake.needsDistraction));
  $('#ot-intake-distraction-routines').val(app_otIntake.distractionRoutines);
  $('#ot-intake-accomodations').val(app_otIntake.accomodations);
  $('#ot-intake-additional-info').val(app_otIntake.additionalInfo);
  $('#ot-intake-outside-eval-completed').val(util_booleanToInteger(app_otIntake.outsideEvalCompleted));
  $('#ot-intake-outside-eval-adequate').val(util_booleanToInteger(app_otIntake.outsideEvalAdequate));
  $('#ot-intake-tx-freq').val(app_otIntake.txFreq);
  $('#ot-intake-eval-rec').val(app_otIntake.evalRec);
  util_selectCheckboxesFromList(app_otIntake.tools, 'tools');
  $('#ot-intake-tools-other').val(app_otIntake.toolsOther);
  util_selectCheckboxesFromList(app_otIntake.areaConcern, 'area-concern');
  
  $('#ot-intake-close-record-btn').on('click', function(e){ pot_ehr_closeOTIntake(e); });
}



function pot_ehr_renderClosedOTIntake() {
  $('#ot-intake-screen .input-field').attr("readonly", "readonly");
  $('#ot-intake-screen .selectpicker').attr("disabled", "disabled");
  $('#ot-intake-screen .input-select').attr("disabled", "disabled");
  $('#ot-intake-screen .input-checkbox').attr("disabled", "disabled");
  $('#ot-intake-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#ot-intake-close-record-btn').hide();
}



function pot_ehr_renderOTIntakeScreen() {
 RenderUtil.render('screen/pot/ehr/ot_intake_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('OT Intake', app_patientChartItemCache);
  app_patientChartItemStack($('#ot-intake-screen'), true);
  
   var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
   $.post("patient/getOTIntake", {data:jsonData}, function(data) {
     var parsedData = $.parseJSON(data);
     app_otIntake = parsedData.object;
     pot_ehr_loadOTIntakeForm();
     if (app_otIntake.closed == true) {
       pot_ehr_renderClosedOTIntake();
     }
   });
   
 });  
}



function pot_ehr_updateOTIntakeAge(value) {
  var age = util_calculateAgeFromBirthDate(value);
  $('#ot-intake-age').val(age);
}
