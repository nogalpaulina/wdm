

function ehr_handleIntakePacketWizardNavigation(screenNumber){
  pm_intakePacketStack($('#intake-packet-subscreen-'+screenNumber), true);
}



function ehr_intakePacketStack(screen, doScroll) {
  app_previousScreen = app_currentScreen;
  $('.intake-packet-subscreen').css({display: "none"});
  screen.css({display: "block"});
  app_currentScreen = screen;
  if (doScroll) {scroll(0,0);}
}



function ehr_renderAdvocateProgressNoteScreen(){
 RenderUtil.render('screen/'+SPECIALTY+'/ehr/advocate_progress_note_screen', {}, function(s) {
   $("#patient-chart-item-screen").html(s);
   app_showScreen('Advocate Progress Note', app_patientChartItemCache);
   app_patientChartItemStack($('#advocate-progress-note-screen'), true);
 });
}



function pm_renderBeaconEOT() {
 RenderUtil.render('screen/'+SPECIALTY+'/pm/beaconeot_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Beacon EOT', app_patientChartItemCache);
  app_patientChartItemStack($('#beaconeot-screen'), true);
 });
}



function pm_renderBillingTicket() {
 RenderUtil.render('screen/'+SPECIALTY+'/pm/billing_ticket_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Billing Ticket', app_patientChartItemCache);
  app_patientChartItemStack($('#billing-ticket-screen'), true);
 });
}



function ehr_renderClinicalProgressNoteScreen(){
 RenderUtil.render('screen/'+SPECIALTY+'/ehr/clinical_progress_note_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Clinical Progress Note', app_patientChartItemCache);
  app_patientChartItemStack($('#clinical-progress-note-screen'), true);
 });
}



function pm_renderDischargeForm() {
 RenderUtil.render('screen/'+SPECIALTY+'/pm/discharge_form_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Discharge Form', app_patientChartItemCache);
  app_patientChartItemStack($('#discharge-form-screen'), true);
 });
}



function pm_renderEdAdvocateContract() {
 RenderUtil.render('screen/'+SPECIALTY+'/pm/ed_advocate_contract_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Ed Advocate', app_patientChartItemCache);
  app_patientChartItemStack($('#ed-advocate-contract-screen'), true);
 });
}



function ehr_renderIHBProgressNoteScreen(){
 RenderUtil.render('screen/'+SPECIALTY+'/ehr/ihb_progress_note_screen', {}, function(s) {
   $("#patient-chart-item-screen").html(s);
   app_showScreen('IHB Progress Note', app_patientChartItemCache);
   app_patientChartItemStack($('#ihb-progress-note-screen'), true);
 });
}



function ehr_renderIntakePacketScreen(){
 RenderUtil.render('intake_packet_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  showScreen('Intake Packet', intakePacketCache);
  app_intakePacketStack($('#intake-packet-subscreen-1'), true);
    $('.intake-packet-step-btn, .stepwizard-btn-circle').click(function(){handleIntakePacketWizardNavigation($(this).attr('name'))});
 });  
}



function pm_renderReferralForm() {
 RenderUtil.render('screen/'+SPECIALTY+'/pm/referral_form_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Referral', app_patientChartItemCache);
  app_patientChartItemStack($('#referral-form-screenn'), true);
 });
}



function pm_renderSchoolConsent() {
 RenderUtil.render('screen/'+SPECIALTY+'/pm/school_consent_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('School Consent', app_patientChartItemCache);
  app_patientChartItemStack($('#school-consent-screen'), true);
 });
}




function ehr_renderTreatmentPlanScreen(){
 RenderUtil.render('screen/'+SPECIALTY+'/ehr/treatment_plan_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Treatment Plan', app_patientChartItemCache);
  app_patientChartItemStack($('#treatment-plan-screen'), true);
 });
}
