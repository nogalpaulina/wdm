

function pot_ehr_closeOTEval(e) {
  var args = {
    modalTitle:"Complete OT Evaluation Form?", 
    modalH3:"Complete OT Evaluation Form?",
    modalH4:"Once completed, the OT Evaluation form will be read-only.",
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
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_otEval.id});
      $.post("patient/closeOTEval", {data:jsonData}, function(data) {
        app_displayNotification('Client OT Evaluation Completed.');
        pot_ehr_renderClosedOTEval();
      }); 
      
    }); 
  });
}



function pot_ehr_loadOTEvalForm() {
  form_addForm('pot-entity-form-OTEval', app_otEval.id, app_otEval);
  $('#ot-eval-form').attr('data-instance-id', app_otEval.id);  
  $('#ot-eval-form .selectpicker').selectpicker();
  $("#ot-eval-form input[data-field-type='date']").mask("99/99/9999");
  $('#ot-eval-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#ot-eval-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#ot-eval-form .input-checkbox').click(function() { form_validateAndUpdateField(this) });
  $('#ot-eval-form .input-checkbox-group').click(function() { form_updateField($(this)) });
    
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { 
    $("#ot-eval-gender").html(s); 
    if (app_currentPatient.gender) {$('#ot-eval-gender').val(app_currentPatient.gender.id);}
  });
  $('#ot-eval-first-name').val(app_currentPatient.firstName);
  $('#ot-eval-middle-name').val(app_currentPatient.middleName);
  $('#ot-eval-last-name').val(app_currentPatient.lastName);
  if (app_currentPatient.dob) {$('#ot-eval-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  if (app_otEval.date) {$('#ot-eval-date').val(dateFormat(app_otEval.date, 'mm/dd/yyyy'));}
  $('#ot-eval-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  $('#ot-eval-pcp-name').val(app_patientForm.pcpName);
  $('#ot-eval-policy-number').val(app_patientForm.policyNumber);
  $('#ot-eval-length-of-session').val(app_otEval.lengthOfSession);
  $('#ot-eval-dx').val(app_otEval.dx);
  $('#ot-eval-tx-frequency').val(app_otEval.txFrequency);
  $('#ot-eval-tx-length').val(app_otEval.txLength);
  $('#ot-eval-home-program-desc').val(app_otEval.homeProgramDesc);
  $('#ot-eval-additional-impressions').val(app_otEval.additionalImpressions);
  $('input[name=ot-eval-continue-ot][value='+app_otEval.continueOT+']').attr("checked", true);
  $('input[name=ot-eval-discharge][value='+app_otEval.discharge+']').attr("checked", true);
  $('input[name=ot-eval-home-program][value='+app_otEval.homeProgram+']').attr("checked", true);
  util_selectCheckboxesFromList(app_otEval.txPlan, 'tx-plan');
  $('#ot-eval-tx-plan-other1').val(app_otEval.txPlanOther1);
  $('#ot-eval-tx-plan-other2').val(app_otEval.txPlanOther2);
  $('#ot-eval-potential').val(app_otEval.potential);
  if (app_otEval.barriers) {$("#ot-eval-barriers").selectpicker('val', app_otEval.barriers.split(",")); $("#ot-eval-barriers").selectpicker('refresh');}
  
  $('#ot-eval-close-record-btn').on('click', function(e){ pot_ehr_closeOTEval(e); });
  pot_ehr_renderEvalTests(app_otEval.evalTests, 'pot-entity-form-EvalTest', OT_EVAL_TYPE);
  pot_ehr_renderEvalLongTermGoals(app_otEval.longTermGoals, 'pot-entity-form-LongTermGoal', OT_EVAL_TYPE);
  pot_ehr_renderEvalShortTermGoals(app_otEval.shortTermGoals, 'pot-entity-form-ShortTermGoal', OT_EVAL_TYPE);
  pot_ehr_loadOTEvalSelectGroups();
}



function pot_ehr_loadOTEvalSelectGroups() {
  var formSections = ['foundations','postural','neuromuscular','praxis','visual','fine','oral','participation'];
  for (i=0;i<formSections.length;i++) {
    var formSection = formSections[i];
    var formSectionData = $.parseJSON(app_otEval[formSection]);
    // set parsed JSON object back onto the form section data element so that it can now be locally mutated.
    app_otEval[formSection] = formSectionData;
    $.each(formSectionData, function(key, value) {
      $('#ot-eval-'+formSection+'-'+key).val(value);
    });
  }
  $('.select-group').off('change').on('change', function() { pot_ehr_updateOTEvalSelectGroup($(this)) });
}



function pot_ehr_renderClosedOTEval() {
  $('#ot-eval-screen .input-field').attr("readonly", "readonly");
  $('#ot-eval-screen .selectpicker').attr("disabled", "disabled");
  $('#ot-eval-screen .input-select').attr("disabled", "disabled");
  $('#ot-eval-screen .input-checkbox').attr("disabled", "disabled");
  $('#ot-eval-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#ot-eval-close-record-btn').hide();
}



function pot_ehr_renderOTEvalScreen() {
 RenderUtil.render('screen/pot/ehr/ot_eval_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('OT Eval', app_patientChartItemCache);
  app_patientChartItemStack($('#ot-eval-screen'), true);
 
   var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
   $.post("patient/getOTEval", {data:jsonData}, function(data) {
     var parsedData = $.parseJSON(data);
     app_otEval = parsedData.object;
     pot_ehr_loadOTEvalForm();
     if (app_otEval.closed == true) {
       pot_ehr_renderClosedOTEval();
     }
   });
 });  
}



function pot_ehr_updateOTEvalSelectGroup($this) {
  var id = $this.closest('form').attr('data-instance-id');
  var property = $this.data('property');  //  pot-entity-form-OTEval.foundations.arousal
  var propArray = property.split(".");
  var className = propArray[0];          //  pot-entity-form-OTEval
  var formSection = propArray[1];        //  foundations
  var formElement = propArray[2];        //  arousal
  var formName = className+'-'+id;       //  pot-entity-form-OTEval-1
  
  var formSectionData = app_forms[formName]['data'][formSection];
  formSectionData[formElement] = $this.val();
  app_forms[formName]['data'][formSection][formElement] = $this.val(); 
  
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


