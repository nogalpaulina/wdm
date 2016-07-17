
function pot_ehr_closeSpeechIntake(e) {
  var args = {
    modalTitle:"Complete Speech Intake Form?", 
    modalH3:"Complete Speech Intake Form?",
    modalH4:"Once completed, the Speech Intake form will be read-only.",
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
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_speechIntake.id});
      $.post("patient/closeSpeechIntake", {data:jsonData}, function(data) {
        app_displayNotification('Client Speech Intake Completed.');
        pot_ehr_renderClosedSpeechIntake();
      }); 
      
    }); 
  });
}



function pot_ehr_loadSpeechIntakeForm() {
  $('#speech-intake-form').attr('data-instance-id', app_speechIntake.id);  
  $('#speech-intake-form .selectpicker').selectpicker();
  $("#speech-intake-form input[data-field-type='date']").mask("99/99/9999");
  $('#speech-intake-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#speech-intake-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#speech-intake-form .input-checkbox').click(function() { form_validateAndupdateField(this) });
  $('#speech-intake-form .input-checkbox-group').click(function() { form_updateField($(this)) });
  
  $('#speech-intake-date').html(dateFormat(app_speechIntake.createdDate, 'mm/dd/yyyy'));
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { $("#speech-intake-gender").html(s); });
  $('#speech-intake-concerns').val(app_patientForm.concerns);
  $('#speech-intake-first-name').val(app_currentPatient.firstName);
  $('#speech-intake-middle-name').val(app_currentPatient.middleName);
  $('#speech-intake-last-name').val(app_currentPatient.lastName);
  $('#speech-intake-nick-name').val(app_patientForm.nickName);
  if (app_currentPatient.gender) {$('#speech-intake-gender').val(app_currentPatient.gender.id);}
  if (app_currentPatient.dob) {$('#speech-intake-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  $('#speech-intake-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  $('#speech-intake-siblings').val(app_patientForm.siblings);
  $('#speech-intake-school-name').val(app_patientForm.schoolName);
  $('#speech-intake-grade').val(app_patientForm.grade);
  $('#speech-intake-teachers').val(app_patientForm.teachers);
  $('#speech-intake-class-type').val(app_patientForm.classType);
  $('#speech-intake-classroom-asst').val(app_patientForm.classroomAsst);
  $('#speech-intake-pcp-name').val(app_patientForm.pcpName);
  $('#speech-intake-ref-source').val(app_patientForm.refSource);
  $('#speech-intake-ref-source-other').val(app_patientForm.refSourceOther);
  $('#speech-intake-ref-source-email').val(app_patientForm.refSourceEmail);
  $('#speech-intake-ref-source-phone').val(app_patientForm.refSourcePhone);
  $('#speech-intake-ref-source-street-address1').val(app_patientForm.refSourceStreetAddress1);
  $('#speech-intake-ref-source-city').val(app_patientForm.refSourceCity);
  if (app_patientForm.refSourceUSState) {$('#speech-intake-ref-source-us-state').val(app_patientForm.refSourceUSState.id);}
  $('#speech-intake-ref-source-postal-code').val(app_patientForm.refSourcePostalCode);
  $('#speech-intake-ins-name').val(app_patientForm.insName);
  $('#speech-intake-policy-number').val(app_patientForm.policyNumber);
  $('#speech-intake-has-dx').val(util_booleanToInteger(app_patientForm.hasDx));
  $('#speech-intake-dx').val(app_patientForm.dx);
  $('#speech-intake-adopted').val(util_booleanToInteger(app_patientForm.adopted));
  $('#speech-intake-adoption-details').val(app_patientForm.adoptionDetails);
  
  $('#speech-intake-second-opinion').val(util_booleanToInteger(app_speechIntake.secondOpinion));
  $('#speech-intake-medical-history').val(app_speechIntake.medicalHistory);
  $('#speech-intake-issues').val(app_speechIntake.issues);
  $('#speech-intake-rec-other').val(app_speechIntake.recOther);
  $('#speech-intake-outside-eval-completed').val(util_booleanToInteger(app_speechIntake.outsideEvalCompleted));
  $('#speech-intake-outside-eval-adequate').val(util_booleanToInteger(app_speechIntake.outsideEvalAdequate));
  $('#speech-intake-tx-freq').val(app_speechIntake.txFreq);
  $('#speech-intake-eval-rec').val(app_speechIntake.evalRec);
  util_selectCheckboxesFromList(app_speechIntake.receptiveLanguage, 'receptiveLanguage');
  $('#speech-intake-receptive-other').val(app_speechIntake.receptiveOther);
  util_selectCheckboxesFromList(app_speechIntake.expressiveLanguage, 'expressiveLanguage');
  $('#speech-intake-expressive-other').val(app_speechIntake.expressiveOther);
  $('#speech-intake-length-utterance').val(app_speechIntake.lengthUtterance);
  $('#speech-intake-which-grammatical').val(app_speechIntake.whichGrammatical);
  util_selectCheckboxesFromList(app_speechIntake.socialLanguage, 'socialLanguage');
  $('#speech-intake-social-other').val(app_speechIntake.socialOther);
  util_selectCheckboxesFromList(app_speechIntake.execFunctions, 'execFunctions');
  $('#speech-intake-exec-impact').val(app_speechIntake.execImpact);
  
  $('input[name=speech-intake-intell-no-concerns][value='+app_speechIntake.intellNoConcerns+']').attr("checked", true);
  $('#speech-intake-intell-unfamiliar').val(app_speechIntake.intellUnfamiliar);
  $('#speech-intake-intell-context').val(util_booleanToInteger(app_speechIntake.intellContext));
  $('#speech-intake-intell-consistent').val(util_booleanToInteger(app_speechIntake.intellConsistent));
  $('#speech-intake-intell-groping').val(util_booleanToInteger(app_speechIntake.intellGroping));
  $('#speech-intake-intell-aware').val(util_booleanToInteger(app_speechIntake.intellAware));
  $('#speech-intake-intell-frust').val(util_booleanToInteger(app_speechIntake.intellFrust));
  $('#speech-intake-intell-strat').val(app_speechIntake.intellStrat);
  $('#speech-intake-intell-sound-errors').val(app_speechIntake.intellSoundErrors);
  $('#speech-intake-intell-info').val(app_speechIntake.intellInfo);
  
  util_selectCheckboxesFromList(app_speechIntake.omf, 'omf');
  $('#speech-intake-tongue-tied').val(util_booleanToInteger(app_speechIntake.tongueTied));
  $('#speech-intake-tongue-clipped').val(util_booleanToInteger(app_speechIntake.tongueClipped));
  $('#speech-intake-omf-other').val(app_speechIntake.omfOther);
  
  util_selectCheckboxesFromList(app_speechIntake.fluency, 'fluency');
  $('#speech-intake-fluency-frust').val(util_booleanToInteger(app_speechIntake.fluencyFrust));
  $('#speech-intake-fam-hx-stutter').val(util_booleanToInteger(app_speechIntake.famHxStutter));
  $('#speech-intake-fluency-other').val(app_speechIntake.fluencyOther);
  
  util_selectCheckboxesFromList(app_speechIntake.vocalQuality, 'vocalQuality');
  $('#speech-intake-vocal-pathology').val(util_booleanToInteger(app_speechIntake.vocalPathology));
  $('#speech-intake-vocal-desc').val(app_speechIntake.vocalDesc);
  $('#speech-intake-vocal-other').val(app_speechIntake.vocalOther);
  
  util_selectCheckboxesFromList(app_speechIntake.hearing, 'hearing');
  $('#speech-intake-hearing-other').val(app_speechIntake.hearingOther);
  
  util_selectCheckboxesFromList(app_speechIntake.tools, 'tools');
  util_selectCheckboxesFromList(app_speechIntake.cpt, 'cpt');
  util_selectCheckboxesFromList(app_speechIntake.rec, 'rec');
  
  $('#speech-intake-close-record-btn').on('click', function(e){ pot_ehr_closeSpeechIntake(e); });
}



function pot_ehr_renderClosedSpeechIntake() {
  $('#speech-intake-screen .input-field').attr("readonly", "readonly");
  $('#speech-intake-screen .selectpicker').attr("disabled", "disabled");
  $('#speech-intake-screen .input-select').attr("disabled", "disabled");
  $('#speech-intake-screen .input-checkbox').attr("disabled", "disabled");
  $('#speech-intake-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#speech-intake-close-record-btn').hide();
}


function pot_ehr_renderSpeechIntakeScreen() {
 RenderUtil.render('screen/pot/ehr/speech_intake_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Speech Therapy Intake', app_patientChartItemCache);
  app_patientChartItemStack($('#speech-intake-screen'), true);
  
  var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
  $.post("patient/getSpeechIntake", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_speechIntake = parsedData.object;
    pot_ehr_loadSpeechIntakeForm();
    if (app_speechIntake.closed == true) {
      pot_ehr_renderClosedSpeechIntake();
    }
  });
 });  
}


function pot_ehr_updateSpeechIntakeAge(value) {
  var age = util_calculateAgeFromBirthDate(value);
  $('#speech-intake-age').val(age);
}


