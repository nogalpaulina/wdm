
function app_renderIntakeDocsSubscreen() {
  var jsonData = JSON.stringify({ id: app_client.id, module:app_currentModule, sessionId: app_client.sessionId });
  $.post("patient/getPatientIntake", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_patientIntake = parsedData.object;
    app_finalScreenNumber = app_patientIntake.forms.split(',').length + 1;
    app_finalScreenButton = app_finalScreenNumber + 1;
    
    RenderUtil.render('screen/intake_records_screen', {lastScreenNum:app_finalScreenNumber}, function(s) {
      $("#forms-subscreen").html(s);
      app_intakeRecordsViewStack($('#forms-subscreen-1'), true);
      $("#forms-subscreen-1").show();
      app_loadIntakeForms();
    });
  });
}



function ehr_viewPatientChartScreen() {
  RenderUtil.render('screen/'+SPECIALTY+'/ehr/patient_chart_screen', {}, function(s) {
    $("#patient-chart-screen").html(s);
    app_viewStack('patient-chart-screen', DO_SCROLL);
    $("#patient-chart-screen").show();
    
    if (SPECIALTY == BH_SPECIALTY) {
      $('#treatment-plan-link').click(function(){ ehr_renderTreatmentPlanScreen(); });
      $('#ihb-progress-note-link').click(function(){ ehr_renderIHBProgressNoteScreen(); });
      $('#advocate-progress-note-link').click(function(){ ehr_renderAdvocateProgressNoteScreen(); });
      $('#clinical-progress-note-link').click(function(){ ehr_renderClinicalProgressNoteScreen(); });
      $('#intake-docs-link').click(function(){ ehr_viewIntakeDocs(); });
      $('#patient-chart-files-link').click(function(){ ehr_viewPatientFiles(); });
    }
    else if (SPECIALTY == AC_SPECIALTY) {
      $('#intake-docs-link').click(function(){ ehr_viewIntakeDocs(); });
      $('#treatment-notes-link').click(function(){ ac_ehr_renderTreatmentNotes(); });
    }
    else if (SPECIALTY == POT_SPECIALTY) {
      $('#patient-info-link').click(function(){ pot_renderPatientInfoScreen(); });
      if (app_currentPatient != null) {
        $(".pc-tile").show();
        $('#ot-intake-form-link').click(function(){ pot_ehr_renderOTIntakeScreen(); });
        $('#speech-intake-form-link').click(function(){ pot_ehr_renderSpeechIntakeScreen(); });
        $('#aac-intake-form-link').click(function(){ pot_ehr_renderAACIntakeScreen(); });
        $('#ot-eval-form-link').click(function(){ pot_ehr_renderOTEvalScreen(); });
        $('#dev-hx-form-link').click(function(){ pot_ehr_renderDevHxScreen(); });
        $('#speech-eval-form-link').click(function(){ pot_ehr_renderSpeechEvalScreen(); });
        $('#aac-eval-form-link').click(function(){ pot_ehr_renderAACEvalScreen(); });
      }
    }
    
  });
}



function pm_viewPatientChartScreen() {
  RenderUtil.render('screen/'+SPECIALTY+'/pm/patient_chart_screen', {}, function(s) {
    $("#patient-chart-screen").html(s);
    app_viewStack('patient-chart-screen', DO_SCROLL);
    $("#patient-chart-screen").show();
    
    if (SPECIALTY == BH_SPECIALTY) {
      $('#beaconeot-link').click(function(){ pm_renderBeaconEOT(); });
      $('#referral-form-link').click(function(){ pm_renderReferralForm(); });
      $('#billing-ticket-link').click(function(){ pm_renderBillingTicket(); });
      $('#discharge-form-link').click(function(){ pm_renderDischargeForm(); });
      $('#school-consent-link').click(function(){ pm_renderSchoolConsent(); });
      $('#ed-advocate-contract-link').click(function(){ pm_renderEdAdvocateContract(); });
      $('#patient-chart-files-link').click(function(){ pm_viewPatientFiles(); });
    }
    
    if (SPECIALTY == POT_SPECIALTY) {
      $('#patient-info-link').click(function(){ pot_renderPatientInfoScreen(); });
    }
    else {
      $('#patient-info-link').click(function(){ pm_getPatientInfo(); });
    }  
    
    
  });
}