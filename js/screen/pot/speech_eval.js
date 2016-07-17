

function pot_ehr_closeSpeechEval(e) {
  var args = {
    modalTitle:"Complete Speech Evaluation Form?", 
    modalH3:"Complete Speech Evaluation Form?",
    modalH4:"Once completed, the Speech Evaluation form will be read-only.",
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
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_speechEval.id});
      $.post("patient/closeSpeechEval", {data:jsonData}, function(data) {
        app_displayNotification('Client Speech Evaluation Completed.');
        pot_ehr_renderClosedSpeechEval();
      }); 
      
    }); 
  });
}



function pot_ehr_loadSpeechEvalForm() {
  form_addForm('pot-entity-form-SpeechEval', app_speechEval.id, app_speechEval);
  $('#speech-eval-form').attr('data-instance-id', app_speechEval.id);  
  $('#speech-eval-form .selectpicker').selectpicker();
  $("#speech-eval-form input[data-field-type='date']").mask("99/99/9999");
  $('#speech-eval-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#speech-eval-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#speech-eval-form .input-checkbox').click(function() { form_validateAndUpdateField(this) });
  $('#speech-eval-form .input-checkbox-group').click(function() { form_updateField($(this)) });
    
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { 
    $("#speech-eval-gender").html(s); 
    if (app_currentPatient.gender) {$('#speech-eval-gender').val(app_currentPatient.gender.id);}
  });
  $('#speech-eval-first-name').val(app_currentPatient.firstName);
  $('#speech-eval-middle-name').val(app_currentPatient.middleName);
  $('#speech-eval-last-name').val(app_currentPatient.lastName);
  if (app_currentPatient.dob) {$('#speech-eval-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  if (app_speechEval.date) {$('#speech-eval-date').val(dateFormat(app_speechEval.date, 'mm/dd/yyyy'));}
  $('#speech-eval-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  $('#speech-eval-pcp-name').val(app_patientForm.pcpName);
  $('#speech-eval-policy-number').val(app_patientForm.policyNumber);
  $('#speech-eval-length-of-session').val(app_speechEval.lengthOfSession);
  $('#speech-eval-dx').val(app_speechEval.dx);
  util_selectCheckboxesFromList(app_speechEval.hearingHistory, 'hearing-history');
  $('#speech-eval-age-of-onset').val(app_speechEval.onsetAge);
  $('#speech-eval-block-duration').val(app_speechEval.blockDuration);
  $('input[name=speech-eval-inconsistent-sound][value='+app_speechEval.inconsistentSound+']').attr("checked", true);
  $('input[name=speech-eval-sound-sequencing][value='+app_speechEval.soundSequencing+']').attr("checked", true);
  $('input[name=speech-eval-limited-syllable][value='+app_speechEval.limitedSyllable+']').attr("checked", true);
  $('#speech-eval-structures-noted').val(app_speechEval.structuresNoted);
  $('input[name=speech-eval-vowel-distortions][value='+app_speechEval.vowelDistortions+']').attr("checked", true);
  $('#speech-eval-stimulability').val(app_speechEval.stimulability);
  $('input[name=speech-eval-intelligibility][value='+app_speechEval.intelligibility+']').attr("checked", true);
  $('input[name=speech-eval-familiar-listeners][value='+app_speechEval.familiarListeners+']').attr("checked", true);
  $('input[name=speech-eval-context-required][value='+app_speechEval.contextRequired+']').attr("checked", true);
  $('input[name=speech-eval-start-st][value='+app_speechEval.startST+']').attr("checked", true);
  $('#speech-eval-tx-length').val(app_speechEval.txLength);
  $('#speech-eval-tx-frequency').val(app_speechEval.txFrequency);
  $('input[name=speech-eval-consults-rec][value='+app_speechEval.consultsReccomended+']').attr("checked", true);
  $('input[name=speech-eval-potential][value='+app_speechEval.potential+']').attr("checked", true);
  $('#speech-eval-potential').val(app_speechEval.potential);
  $('#speech-eval-additional-impressions').val(app_speechEval.additionalImpressions);
  util_selectCheckboxesFromList(app_speechEval.txPlan, 'tx-plan');
  $('#speech-eval-tx-plan-other1').val(app_speechEval.txPlanOther1);
  $('#speech-eval-tx-plan-other2').val(app_speechEval.txPlanOther2);
  $('#speech-eval-tx-plan-other3').val(app_speechEval.txPlanOther3);
  
  $('#speech-eval-patient-sig').val(app_speechEval.patientSig);
  if (app_speechEval.patientSigDate) {$('#speech-eval-patient-sig-date').val(dateFormat(app_speechEval.patientSigDate, 'mm/dd/yyyy'));}
  $('#speech-eval-cosigner1').val(app_speechEval.cosigner1);
  if (app_speechEval.cosigner1Date) {$('#speech-eval-cosigner1-date').val(dateFormat(app_speechEval.cosigner1Date, 'mm/dd/yyyy'));}
  $('#speech-eval-cosigner2').val(app_speechEval.cosigner2);
  if (app_speechEval.cosigner2Date) {$('#speech-eval-cosigner2-date').val(dateFormat(app_speechEval.cosigner2Date, 'mm/dd/yyyy'));}

  $('#speech-eval-close-record-btn').on('click', function(e){ pot_ehr_closeSpeechEval(e); });
  pot_ehr_renderEvalTests(app_speechEval.evalTests, 'pot-entity-form-EvalTest', SPEECH_EVAL_TYPE);
  pot_ehr_renderEvalLongTermGoals(app_speechEval.longTermGoals, 'pot-entity-form-LongTermGoal', SPEECH_EVAL_TYPE);
  pot_ehr_renderEvalShortTermGoals(app_speechEval.shortTermGoals, 'pot-entity-form-ShortTermGoal', SPEECH_EVAL_TYPE);
  pot_ehr_loadSpeechEvalSelectGroups();
  
  $('#speech-eval-initial-word-pos').val(app_speechEval.initialWordPosition);
  $('#speech-eval-medial-word-pos').val(app_speechEval.medialWordPosition);
  $('#speech-eval-final-word-pos').val(app_speechEval.finalWordPosition);
  //$('#speech-eval-initial-word-pos').summernote({ callbacks: { onBlur: function(contents, $editable) { form_updateField($(this)); } }, height:200 }); 
  //$('#speech-eval-initial-word-pos').summernote('editor.pasteHTML', app_speechEval.initialWordPosition);
  //$('#speech-eval-medial-word-pos').summernote({ callbacks: { onBlur: function(contents, $editable) { form_updateField($(this)); } }, height:200 }); 
  //$('#speech-eval-medial-word-pos').summernote('editor.pasteHTML', app_speechEval.medialWordPosition);
  //$('#speech-eval-final-word-pos').summernote({ callbacks: { onBlur: function(contents, $editable) { form_updateField($(this)); } }, height:200 }); 
  //$('#speech-eval-final-word-pos').summernote('editor.pasteHTML', app_speechEval.finalWordPosition);
}



function pot_ehr_loadSpeechEvalSelectGroups() {
  var formSections = ['receptive','fluency','voice','expressive','executive','pragmatics'];
  for (i=0;i<formSections.length;i++) {
    var formSection = formSections[i];
    var formSectionData = $.parseJSON(app_speechEval[formSection]);
    // set parsed JSON object back onto the form section data element so that it can now be locally mutated.
    app_speechEval[formSection] = formSectionData;
    $.each(formSectionData, function(key, object) {
      $('#speech-eval-'+formSection+'-'+key+'-level').val(object.level);
      if (object.problems) {$('#speech-eval-'+formSection+'-'+key+'-problems').selectpicker('val', object.problems.split(",")); $('#speech-eval-'+formSection+'-'+key+'-problems').selectpicker('refresh');}
      if (object.other && object.other.length > 0) { $('#speech-eval-'+formSection+'-'+key+'-problems-other').val(object.other);$('#speech-eval-'+formSection+'-'+key+'-problems-other').show(); }
    });
  }
  $('.select-group').off('change').on('change', function() { pot_ehr_updateSpeechEvalSelectGroup($(this)) });
}



function pot_ehr_renderClosedSpeechEval() {
  $('#ot-speech-screen .input-field').attr("readonly", "readonly");
  $('#ot-speech-screen .selectpicker').attr("disabled", "disabled");
  $('#ot-speech-screen .input-select').attr("disabled", "disabled");
  $('#ot-speech-screen .input-checkbox').attr("disabled", "disabled");
  $('#ot-speech-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#ot-speech-close-record-btn').hide();
}



function pot_ehr_renderSpeechEvalScreen() {
 RenderUtil.render('screen/pot/ehr/speech_eval_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Speech Eval', app_patientChartItemCache);
  app_patientChartItemStack($('#speech-eval-screen'), true);
 
   var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
   $.post("patient/getSpeechEval", {data:jsonData}, function(data) {
     var parsedData = $.parseJSON(data);
     app_speechEval = parsedData.object;
     pot_ehr_loadSpeechEvalForm();
     if (app_speechEval.closed == true) {
       pot_ehr_renderClosedSpeechEval();
     }
   });
 });  
}



function pot_ehr_updateOtherProblem($this) {
  var valArray = $this.val();
  var id = $this.attr('id');
  var otherId = id+'-other';
  var index = $.inArray("Other", valArray);
  if (index != -1) {
    $(otherId).show();
  }
  if (index == -1) {
    $(otherId).hide();
  }
}



function pot_ehr_updateSpeechEvalSelectGroup($this) {
  var id = $this.closest('form').attr('data-instance-id');
  var property = $this.data('property');      //  pot-entity-form-SpeechEval.receptive.basic.level
  if (typeof property == 'undefined') { return; }
  var propArray = property.split(".");
  var className = propArray[0];               //  pot-entity-form-SpeechEval
  var formSection = propArray[1];             //  receptive
  var formElement = propArray[2];             //  basic
  var formElementProperty = propArray[3];     //  level
  var formName = className+'-'+id;            //  pot-entity-form-SpeechEval-1
  
  var formSectionData = app_forms[formName]['data'][formSection];
  formSectionData[formElement][formElementProperty] = $this.val();
  if ($this.hasClass('selectpicker'))  { 
    app_forms[formName]['data'][formSection][formElement][formElementProperty] = $this.val().join(','); 
    pot_ehr_updateOtherProblem($this);
  }
  else {
    app_forms[formName]['data'][formSection][formElement][formElementProperty] = $this.val(); 
  }
  
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    module:app_currentModule,
    id: id,
    updateProperty: className+'.'+formSection,
    updatePropertyValue: JSON.stringify(formSectionData),
    updatePropertyFieldType:'text'
  });
  $.post("app/updateField", {data:jsonData}, function(data) {
  }); 
}


