
function pot_ehr_addAACAccessory($this, list) {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId:app_currentPatient.id});
  $.post("patient/addAACAccessory", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var accessoryId = parsedData.id;
    RenderUtil.render('component/'+SPECIALTY+'/aac_accessory', {id: accessoryId, list: list, instanceName:'pot-entity-form-AACAccessory', index: list.length+1}, function(s) { 
      $('#aac-accessories').append(s); 
      $('.aac-accessory-delete-control').click(function() { pot_ehr_deleteAACAccessoryConfirm($(this)); });
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
    });
  }); 
}


function pot_ehr_addAACSystemTrial($this, list) {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId:app_currentPatient.id});
  $.post("patient/addAACSystemTrial", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var systemTrialId = parsedData.id;
    RenderUtil.render('component/'+SPECIALTY+'/aac_system_trial', {id: systemTrialId, list: list, instanceName:'pot-entity-form-AACSystemTrial', index: list.length+1}, function(s) { 
      $('#system-trials').append(s); 
      $('.system-trial-delete-control').click(function() { pot_ehr_deleteAACSystemTrialConfirm($(this)); });
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
    });
  }); 
}



function pot_ehr_closeAACEval(e) {
  var args = {
    modalTitle:"Complete AAC Evaluation Form?", 
    modalH3:"Complete AAC Evaluation Form?",
    modalH4:"Once completed, the AAC Evaluation form will be read-only.",
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
      
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:app_aacEval.id});
      $.post("patient/closeAACEval", {data:jsonData}, function(data) {
        app_displayNotification('Client AAC Evaluation Completed.');
        pot_ehr_renderClosedAACEval();
      }); 
      
    }); 
  });
}



function pot_ehr_deleteAACAccessoryConfirm($this) {
  $('#modal-confirm').remove();
  var id = $this.attr('data-id');
  var args = {
    modalTitle:"Delete Accessory?", 
    modalH3:"Delete Accessory?",
    modalH4:'',
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').on('click', function() {  
      
      var id = $this.attr('data-id');
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id});
      $.post("patient/deleteAACAccessory", {data:jsonData}, function(data) { 
        $('#aac-accessory-'+id).remove();
        $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
          $('#modal-confirm').remove();
        });
        app_displayNotification('Accessory Deleted.');
      }); 
    });
  });
}



function pot_ehr_deleteAACSystemTrialConfirm($this) {
  $('#modal-confirm').remove();
  var id = $this.attr('data-id');
  var args = {
    modalTitle:"Delete System Trial?", 
    modalH3:"Delete System Trial?",
    modalH4:'',
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').on('click', function() {  
      
      var id = $this.attr('data-id');
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id});
      $.post("patient/deleteAACSystemTrial", {data:jsonData}, function(data) { 
        $('#aac-system-trial-'+id).remove();
        $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
          $('#modal-confirm').remove();
        });
        app_displayNotification('System Trial Deleted.');
      }); 
    });
  });
}



function pot_ehr_loadAACEvalForm() {
  $('#aac-eval-form').attr('data-instance-id', app_aacEval.id);  
  $('#aac-eval-form .selectpicker').selectpicker();
  $("#aac-eval-form input[data-field-type='date']").mask("99/99/9999");
  $('#aac-eval-form .input-field').blur(function() { form_validateAndUpdateField(this) });
  $('#aac-eval-form .input-select').change(function() { form_validateAndUpdateField(this) });
  $('#aac-eval-form .input-checkbox').click(function() { form_validateAndUpdateField(this) });
  $('#aac-eval-form .input-checkbox-group').click(function() { form_updateField($(this)) });
    
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender'}, function(s) { 
    $("#aac-eval-gender").html(s); 
    if (app_currentPatient.gender) {$('#aac-eval-gender').val(app_currentPatient.gender.id);}
  });
  $('#aac-eval-first-name').val(app_currentPatient.firstName);
  $('#aac-eval-middle-name').val(app_currentPatient.middleName);
  $('#aac-eval-last-name').val(app_currentPatient.lastName);
  if (app_currentPatient.dob) {$('#aac-eval-dob').val(dateFormat(app_currentPatient.dob, 'mm/dd/yyyy'));}
  $('#aac-eval-age').val(util_calculateAgeFromBirthDate(app_currentPatient.dob));
  if (app_aacEval.date) {$('#aac-eval-date').val(dateFormat(app_aacEval.date, 'mm/dd/yyyy'));}
  if (app_aacEval.onsetDate) {$('#aac-eval-onset-date').val(dateFormat(app_aacEval.onsetDate, 'mm/dd/yyyy'));}
  $('#aac-eval-pcp-name').val(app_patientForm.pcpName);
  $('#aac-eval-policy-number').val(app_patientForm.policyNumber);
  $('#aac-eval-length-of-session').val(app_aacEval.lengthOfSession);
  $('#aac-eval-dx').val(app_aacEval.dx);
  $('input[name=aac-eval-impairment-length][value='+app_aacEval.impairmentLength+']').attr("checked", true);
  $('input[name=aac-eval-impairment-presentation][value='+app_aacEval.impairmentPresentation+']').attr("checked", true);
  $('#aac-eval-impairment-presentation-other').val(app_aacEval.impairmentPresentationOther);
  $('input[name=aac-eval-impairment-timeframe][value='+app_aacEval.impairmentTimeframe+']').attr("checked", true);
  $('#aac-eval-impairment-timeframe-other').val(app_aacEval.impairmentTimeframeOther);
  if (app_aacEval.infoGatheredVia) {$("#aac-eval-info-gathered-via").selectpicker('val', app_aacEval.infoGatheredVia.split(",")); $("#aac-eval-info-gathered-via").selectpicker('refresh');}
  $('input[name=aac-eval-rec-name][value='+app_aacEval.recName+']').attr("checked", true);
  if (app_aacEval.recNameDesc) {$("#aac-eval-rec-name-desc").selectpicker('val', app_aacEval.recNameDesc.split(",")); $("#aac-eval-rec-name-desc").selectpicker('refresh');}
  $('input[name=aac-eval-attends][value='+app_aacEval.attends+']').attr("checked", true);
  $('input[name=aac-eval-directions-no][value='+app_aacEval.directionsNO+']').attr("checked", true);
  util_selectCheckboxesFromList(app_aacEval.directionTypes, 'direction-types');
  $('input[name=aac-eval-no-assistance-req][value='+app_aacEval.noAssistanceReq+']').attr("checked", true);
  if (app_aacEval.assistanceReq) {$("#aac-eval-assistance-req").selectpicker('val', app_aacEval.assistanceReq.split(",")); $("#aac-eval-rec-assistance-req").selectpicker('refresh');}
  $('input[name=aac-eval-impeded][value='+app_aacEval.impeded+']').attr("checked", true);
  $('#aac-eval-impeded-desc').val(app_aacEval.impededDesc);
  $('input[name=aac-eval-questions-no][value='+app_aacEval.questionsNO+']').attr("checked", true);
  $('input[name=aac-eval-no-yes-no][value='+app_aacEval.noYesNoQuestions+']').attr("checked", true);
  $('#aac-eval-yes-no-via').val(app_aacEval.yesNoVia);
  $('#aac-eval-intell-percent').val(app_aacEval.intellPercent);
  if (app_aacEval.yesNoPurpose) {$("#aac-eval-yes-no-purpose").selectpicker('val', app_aacEval.yesNoPurpose.split(",")); $("#aac-eval-yes-no-purpose").selectpicker('refresh');}
  $('input[name=aac-eval-vocab-no][value='+app_aacEval.vocabNO+']').attr("checked", true);
  util_selectCheckboxesFromList(app_aacEval.vocabDiff, 'vocabDiff');
  $('input[name=aac-eval-category][value='+app_aacEval.category+']').attr("checked", true);
  if (app_aacEval.completedVia) {$("#aac-eval-completed-via").selectpicker('val', app_aacEval.completedVia.split(",")); $("#aac-eval-completed-via").selectpicker('refresh');}
  $('input[name=aac-eval-grammar-no][value='+app_aacEval.grammarNO+']').attr("checked", true);
  $('#aac-eval-comprehend').val(app_aacEval.comprehend);
  util_selectCheckboxesFromList(app_aacEval.grammarDiff, 'grammarDiff');
  $('#aac-eval-grammar-comments').val(app_aacEval.grammarComments);
  if (app_aacEval.communicatesBy) {$("#aac-eval-communicates-by").selectpicker('val', app_aacEval.communicatesBy.split(",")); $("#aac-eval-communicates-by").selectpicker('refresh');}
  $('input[name=aac-eval-device][value='+app_aacEval.device+']').attr("checked", true);
  $('#aac-eval-device-name').val(app_aacEval.deviceName);
  $('input[name=aac-eval-tablet][value='+app_aacEval.tablet+']').attr("checked", true);
  $('#aac-eval-tablet-name').val(app_aacEval.tabletName);
  util_selectCheckboxesFromList(app_aacEval.environments, 'environments');
  $('#aac-eval-environments-other').val(app_aacEval.environmentsOther);
  $('input[name=aac-eval-identify][value='+app_aacEval.identify+']').attr("checked", true);
  util_selectCheckboxesFromList(app_aacEval.purpose, 'purpose');
  $('#aac-eval-purpose-other').val(app_aacEval.purposeOther);
  util_selectCheckboxesFromList(app_aacEval.partners, 'partners');
  util_selectCheckboxesFromList(app_aacEval.sentenceLength, 'sentenceLength');
  $('input[name=aac-eval-assistance][value='+app_aacEval.assistance+']').attr("checked", true);
  if (app_aacEval.assistanceTypes) {$("#aac-eval-assistance-types").selectpicker('val', app_aacEval.assistanceTypes.split(",")); $("#aac-eval-assistance-types").selectpicker('refresh');}
  $('#aac-eval-understands').val(app_aacEval.understands);
  $('#aac-eval-expressive-comments').val(app_aacEval.expressiveComments);
  util_selectCheckboxesFromList(app_aacEval.speech, 'speech');
  $('#aac-eval-listeners').val(app_aacEval.listeners);
  $('#aac-eval-contexts').val(app_aacEval.contexts);
  $('#aac-eval-percent').val(app_aacEval.percent);
  $('#aac-eval-speech-comments').val(app_aacEval.speechComments);
  if (app_aacEval.commMode) {$("#aac-eval-comm-mode").selectpicker('val', app_aacEval.commMode.split(",")); $("#aac-eval-comm-mode").selectpicker('refresh');}
  $('input[name=aac-eval-joint-attention][value='+app_aacEval.jointAttention+']').attr("checked", true);
  $('input[name=aac-eval-responsive][value='+app_aacEval.responsive+']').attr("checked", true);
  $('#aac-eval-responsive-desc').val(app_aacEval.responsiveDesc);
  util_selectCheckboxesFromList(app_aacEval.rules, 'rules');
  $('#aac-eval-social-comments').val(app_aacEval.socialComments);
  $('input[name=aac-eval-reading-no][value='+app_aacEval.readingNO+']').attr("checked", true);
  $('#aac-eval-reading-level').val(app_aacEval.readingLevel);
  $('input[name=aac-eval-reading1][value='+app_aacEval.reading1+']').attr("checked", true);
  $('input[name=aac-eval-reading2][value='+app_aacEval.reading2+']').attr("checked", true);
  $('input[name=aac-eval-reading3][value='+app_aacEval.reading3+']').attr("checked", true);
  $('input[name=aac-eval-reading4][value='+app_aacEval.reading4+']').attr("checked", true);
  $('#aac-eval-reading-comments').val(app_aacEval.readingComments);
  $('input[name=aac-eval-writing-no][value='+app_aacEval.writingNO+']').attr("checked", true);
  $('input[name=aac-eval-writing1][value='+app_aacEval.writing1+']').attr("checked", true);
  $('input[name=aac-eval-writing2][value='+app_aacEval.writing2+']').attr("checked", true);
  $('#aac-eval-writing2-other').val(app_aacEval.writing2Other);
  $('input[name=aac-eval-writing3][value='+app_aacEval.writing3+']').attr("checked", true);
  $('input[name=aac-eval-writing4][value='+app_aacEval.writing4+']').attr("checked", true);
  $('#aac-eval-writing4-other').val(app_aacEval.writing4Other);
  $('#aac-eval-writing-level').val(app_aacEval.writingLevel);
  $('#aac-eval-writing-comments').val(app_aacEval.writingComments);
  $('#aac-eval-vision-info').val(app_aacEval.visionInfo);
  $('input[name=aac-eval-vision-history][value='+app_aacEval.visionHistory+']').attr("checked", true);
  $('#aac-eval-vision-history-desc').val(app_aacEval.visionHistoryDesc);
  $('input[name=aac-eval-lens][value='+app_aacEval.lens+']').attr("checked", true);
  $('#aac-eval-lens-desc').val(app_aacEval.lensDesc);
  $('#aac-eval-vision-comments').val(app_aacEval.visionComments);
  $('#aac-eval-hearing-info').val(app_aacEval.hearingInfo);
  $('input[name=aac-eval-hearing-history][value='+app_aacEval.hearingHistory+']').attr("checked", true);
  $('#aac-eval-hearing-history-desc').val(app_aacEval.hearingHistoryDesc);
  $('input[name=aac-eval-augment][value='+app_aacEval.augment+']').attr("checked", true);
  $('#aac-eval-augment-device').val(app_aacEval.augmentDevice);
  $('#aac-eval-hearing-comments').val(app_aacEval.hearingComments);
  $('#aac-eval-cog-impairment').val(app_aacEval.cogImpairment);
  util_selectCheckboxesFromList(app_aacEval.behavioral, 'behavioral');
  util_selectCheckboxesFromList(app_aacEval.presents, 'presents');
  $('#aac-eval-readiness-comments').val(app_aacEval.readinessComments);
  $('#aac-eval-motor-info').val(app_aacEval.motorInfo);
  $('#aac-eval-mobility-level').val(app_aacEval.mobilityLevel);
  $('#aac-eval-mobility-level-other').val(app_aacEval.mobilityLevelOther);
  $('#aac-eval-wheelchair').val(app_aacEval.wheelchair);
  $('#aac-eval-limitations').val(app_aacEval.limitations);
  $('#aac-eval-transport').val(app_aacEval.transport);
  $('input[name=aac-eval-motor-ability-issue][value='+app_aacEval.motorAbilityIssue+']').attr("checked", true);
  $('#aac-eval-motor-ability-issue-desc').val(app_aacEval.motorAbilityIssueDesc);
  $('#aac-eval-motor-comments').val(app_aacEval.motorComments);
  util_selectCheckboxesFromList(app_aacEval.fineMotor, 'fineMotor');
  $('input[name=aac-eval-fine-motor-hand][value='+app_aacEval.fineMotorHand+']').attr("checked", true);
  $('#aac-eval-fine-motor-comments').val(app_aacEval.fineMotorComments);
  util_selectCheckboxesFromList(app_aacEval.alternative, 'alternative');
  $('#aac-eval-alternative-other').val(app_aacEval.alternativeOther);
  if (app_aacEval.direct) {$("#aac-eval-direct").selectpicker('val', app_aacEval.direct.split(",")); $("#aac-eval-direct").selectpicker('refresh');}
  $('#aac-eval-direct-rat').val(app_aacEval.directRat);
  if (app_aacEval.scanning) {$("#aac-eval-scanning").selectpicker('val', app_aacEval.scanning.split(",")); $("#aac-eval-scanning").selectpicker('refresh');}
  $('input[name=aac-eval-scanning-partner][value='+app_aacEval.scanningPartner+']').attr("checked", true);
  $('#aac-eval-scanning-rat').val(app_aacEval.scanningRat);
  if (app_aacEval.outputRec) {$("#aac-eval-output-rec").selectpicker('val', app_aacEval.outputRec.split(",")); $("#aac-eval-output-rec").selectpicker('refresh');}
  $('#aac-eval-output-rec-other').val(app_aacEval.outputRecOther);
  $('#aac-eval-output-rat').val(app_aacEval.outputRat);
  $('input[name=aac-eval-positioning][value='+app_aacEval.positioning+']').attr("checked", true);
  $('#aac-eval-positioning-comments').val(app_aacEval.positioningComments);
  if (app_aacEval.font) {$("#aac-eval-font").selectpicker('val', app_aacEval.font.split(",")); $("#aac-eval-font").selectpicker('refresh');}
  $('#aac-eval-symbol').val(app_aacEval.symbol);
  if (app_aacEval.font) {$("#aac-eval-font").selectpicker('val', app_aacEval.font.split(",")); $("#aac-eval-font").selectpicker('refresh');}
  if (app_aacEval.itemsPerDisplay) {$("#aac-eval-items-per-display").selectpicker('val', app_aacEval.itemsPerDisplay.split(",")); $("#aac-eval-items-per-display").selectpicker('refresh');}
  if (app_aacEval.visualFactors) {$("#aac-eval-visual-factors").selectpicker('val', app_aacEval.visualFactors.split(",")); $("#aac-eval-visual-factors").selectpicker('refresh');}
  $('#aac-eval-visual-rat').val(app_aacEval.visualRat);
  if (app_aacEval.language) {$("#aac-eval-language").selectpicker('val', app_aacEval.language.split(",")); $("#aac-eval-language").selectpicker('refresh');}
  $('#aac-eval-language-rat').val(app_aacEval.languageRat);
  $('#aac-eval-accessories-rat').val(app_aacEval.accessoriesRat);
  if (app_aacEval.accessories) {$("#aac-eval-accessories").selectpicker('val', app_aacEval.accessories.split(",")); $("#aac-eval-accessories").selectpicker('refresh');}
  $('#aac-eval-accessories-rat').val(app_aacEval.accessoriesRat);
  $('#aac-eval-device1').val(app_aacEval.device1);
  $('#aac-eval-device1-man').val(app_aacEval.device1Man);
  $('#aac-eval-device2').val(app_aacEval.device2);
  $('#aac-eval-device2-man').val(app_aacEval.device2Man);
  $('#aac-eval-device3').val(app_aacEval.device3);
  $('#aac-eval-device3-man').val(app_aacEval.device3Man);
  $('#aac-eval-device-summary').val(app_aacEval.deviceSummary);
  $('#aac-eval-selected-device').val(app_aacEval.selectedDevice);
  $('#aac-eval-cpt').val(app_aacEval.cpt);
  $('#aac-eval-vendor-name').val(app_aacEval.vendorName);
  $('#aac-eval-vendor-address').val(app_aacEval.vendorAddress);
  $('#aac-eval-vendor-phone').val(app_aacEval.vendorPhone);
  $('#aac-eval-vendor-fax').val(app_aacEval.vendorFax);
  $('input[name=aac-eval-prognosis][value='+app_aacEval.prognosis+']').attr("checked", true);
  $('input[name=aac-eval-outpatient][value='+app_aacEval.outpatient+']').attr("checked", true);
  $('#aac-eval-tx-freq').val(app_aacEval.txFreq);
  if (app_aacEval.txGoals) {$("#aac-eval-tx-goals").selectpicker('val', app_aacEval.txGoals.split(",")); $("#aac-eval-tx-goals").selectpicker('refresh');}
  $('#aac-eval-system').val(app_aacEval.system);
  
  $('#aac-eval-close-record-btn').on('click', function(e){ pot_ehr_closeAACEval(e); });
  
  pot_ehr_renderEvalTests(app_aacEval.evalTests, 'pot-entity-form-EvalTest', AAC_EVAL_TYPE);
  pot_ehr_renderEvalLongTermGoals(app_aacEval.longTermGoals, 'pot-entity-form-LongTermGoal', AAC_EVAL_TYPE);
  pot_ehr_renderEvalShortTermGoals(app_aacEval.shortTermGoals, 'pot-entity-form-ShortTermGoal', AAC_EVAL_TYPE);
  pot_ehr_renderAACSystemTrials(app_aacEval.aacSystemTrials, 'pot-entity-form-AACSystemTrial');
  pot_ehr_renderAACAccessories(app_aacEval.aacAccessories, 'pot-entity-form-AACAccessory');
}



function pot_ehr_renderAACAccessories(list, instanceName) {
  RenderUtil.render('component/'+SPECIALTY+'/aac_accessories', {list: list, instanceName:instanceName}, function(s) { 
    $('#aac-accessories').html(s); 
    $('#new-aac-accessory-btn').click(function() { pot_ehr_addAACAccessory($(this), list); });
    $('.aac-accessory-delete-control').click(function() { pot_ehr_deleteAACAccessoryConfirm($(this)); });
    $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
  });
}



function pot_ehr_renderAACEvalScreen() {
 RenderUtil.render('screen/pot/ehr/aac_eval_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('AAC Eval', app_patientChartItemCache);
  app_patientChartItemStack($('#aac-eval-screen'), true);
 
   var jsonData = JSON.stringify({ id: app_currentPatient.id, sessionId: app_client.sessionId });
   $.post("patient/getAACEval", {data:jsonData}, function(data) {
     var parsedData = $.parseJSON(data);
     app_aacEval = parsedData.object;
     pot_ehr_loadAACEvalForm();
     if (app_aacEval.closed == true) {
       pot_ehr_renderClosedAACEval();
     }
   });
 });  
}



function pot_ehr_renderAACSystemTrials(list, instanceName) {
  RenderUtil.render('component/'+SPECIALTY+'/aac_system_trials', {list: list, instanceName:instanceName}, function(s) { 
    $('#system-trials').html(s); 
    $('#new-system-trial-btn').click(function() { pot_ehr_addAACSystemTrial($(this), list); });
    $('.system-trial-delete-control').click(function() { pot_ehr_deleteAACSystemTrialConfirm($(this)); });
    $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
  });
}



function pot_ehr_renderClosedAACEval() {
  $('#aac-eval-screen .input-field').attr("readonly", "readonly");
  $('#aac-eval-screen .selectpicker').attr("disabled", "disabled");
  $('#aac-eval-screen .input-select').attr("disabled", "disabled");
  $('#aac-eval-screen .input-checkbox').attr("disabled", "disabled");
  $('#aac-eval-screen .input-checkbox-group').attr("disabled", "disabled");
  $('#aac-eval-close-record-btn').hide();
}