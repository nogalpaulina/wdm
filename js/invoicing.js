
function pm_getPatientInvoices() {
  var jsonData = JSON.stringify({ id: app_currentPatientId, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("patient/getPatientInvoices", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    var invoices = parsedData.patientInvoices;
    RenderUtil.render('component/simple_data_table', 
     {items:invoices, 
      title:app_practiceClientProperties['app.patient_label'] + ' Invoices', 
      tableName:'patient-invoices-list', 
      clickable:true, 
      columns:[
        {title:'Issue Date', field:'issueDate', type:'date'},
        {title:'Due Date', field:'dueDate', type:'date'},
        {title:'Description', field:'title', type:'simple'},
        {title:'Amount', field:'total', type:'dollar'},
        {title:'Paid', field:'paid', type:'yes-no'}
      ]}, function(s) {
      $('#patient-invoices-list').html(s);
      $('#patient-invoices-list-title').html("Invoice History");
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        app_handleClickableRow(e); 
      });
    });
  });
}



function pm_newInvoice() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId: app_currentPatientId, module:app_currentModule });
  $.post("patient/createPatientInvoice", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_currentInvoiceId =  parsedData.id;
    pm_getPatientInvoices();
    pm_viewInvoice(app_currentInvoiceId);
  });
}



function pm_viewInvoice(invoiceId) {
  var jsonData = JSON.stringify({ id: invoiceId, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("patient/getPatientInvoice", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_currentInvoice = parsedData.patientInvoice;
    $("#invoice-form").show();
    
    if(app_currentInvoice.issueDate != null) { $('#invoice-date').html(dateFormat(app_currentInvoice.issueDate, 'mm/dd/yyyy')); }
    $('#invoice-patient-name').html(app_currentPatient.fullName);
    $('#invoice-invoice-number').html(app_currentInvoice.invoiceNumber);
    $('#invoice-patient-primary-phone').html(app_currentPatient.primaryPhone);
    $('#invoice-patient-street-address').html(app_currentPatient.streetAddress1);
    $('#invoice-patient-city').html(app_currentPatient.city);
    $('#invoice-patient-us-state').html(app_currentPatient.usState.code);
    $('#invoice-patient-postal-code').html(app_currentPatient.postalCode);
    $('#invoice-title').html(app_currentInvoice.title);
    $('#invoice-description').html(app_currentInvoice.description);
    
    RenderUtil.render('component/simple_data_table', 
     {items:app_currentInvoice.invoiceLineItemList, 
      title:'items', 
      tableName:'patient-invoice-item-list', 
      clickable:true, 
      columns:[
        {title:'Item', field:'description', type:'simple'},
        {title:'Price', field:'price', type:'dollar'},
      ]}, function(s) {
      $('#patient-invoice-item-list').html(s);
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        app_handleClickableRow(e); 
      });
    });
    
    
    /*
    $('#exam-patient-name').val(app_currentExam.patientName);
     if(app_currentExam.dob != null) { $('#exam-dob').val(dateFormat(app_currentExam.dob, 'mm/dd/yyyy')); }
    $('#exam-age').val(app_currentExam.age);
    $('#exam-preferred-name').val(app_currentExam.preferredName);
    $('#exam-gender').val(app_currentExam.gender);
    $('#exam-by').val(app_currentExam.clinicianName);
    $('#exam-height').val(app_currentExam.height);
    $('#exam-weight').val(app_currentExam.weight);
    $('#exam-waist').val(app_currentExam.waist);
    $('#exam-sys').val(app_currentExam.sys);
    $('#exam-dia').val(app_currentExam.dia);
    $('#exam-bpm').val(app_currentExam.bpm);
    $('#exam-observer').val(app_currentExam.observer);
    
    if (app_currentExam.general) {$("#exam-general").selectpicker('val', app_currentExam.general.split(",")); $("#exam-general").selectpicker('render');}
    if (app_currentExam.language) {$("#exam-language").selectpicker('val', app_currentExam.language.split(",")); $("#exam-language").selectpicker('render');}
    if (app_currentExam.disability) {$("#exam-disability").selectpicker('val', app_currentExam.disability.split(",")); $("#exam-disability").selectpicker('render');}
    if (app_currentExam.heent) {$("#exam-heent").selectpicker('val', app_currentExam.heent.split(",")); $("#exam-heent").selectpicker('render');}
    if (app_currentExam.hair) {$("#exam-hair").selectpicker('val', app_currentExam.hair.split(",")); $("#exam-hair").selectpicker('render');}
    if (app_currentExam.hairLoss) {$("#exam-hair-loss").selectpicker('val', app_currentExam.hairLoss.split(",")); $("#exam-hair-loss").selectpicker('render');}
    if (app_currentExam.acne) {$("#exam-acne").selectpicker('val', app_currentExam.acne.split(",")); $("#exam-acne").selectpicker('render');}
    if (app_currentExam.skin) {$("#exam-skin").selectpicker('val', app_currentExam.skin.split(",")); $("#exam-skin").selectpicker('render');}
    if (app_currentExam.neck) {$("#exam-neck").selectpicker('val', app_currentExam.neck.split(",")); $("#exam-neck").selectpicker('render');}
    if (app_currentExam.chest) {$("#exam-chest").selectpicker('val', app_currentExam.chest.split(",")); $("#exam-chest").selectpicker('render');}
    if (app_currentExam.heart) {$("#exam-heart").selectpicker('val', app_currentExam.heart.split(",")); $("#exam-heart").selectpicker('render');}
    if (app_currentExam.breasts) {$("#exam-breasts").selectpicker('val', app_currentExam.breasts.split(",")); $("#exam-breasts").selectpicker('render');}
    if (app_currentExam.abd) {$("#exam-abd").selectpicker('val', app_currentExam.abd.split(",")); $("#exam-abd").selectpicker('render');}
    if (app_currentExam.liverSpleen) {$("#exam-liver-spleen").selectpicker('val', app_currentExam.liverSpleen.split(",")); $("#exam-liver-spleen").selectpicker('render');}
    if (app_currentExam.groinPelvisMale) {$("#exam-groin-pelvis-male").selectpicker('val', app_currentExam.groinPelvisMale.split(",")); $("#exam-groin-pelvis-male").selectpicker('render');}
    if (app_currentExam.groinPelvisFemale) {$("#exam-groin-pelvis-female").selectpicker('val', app_currentExam.groinPelvisFemale.split(",")); $("#exam-groinPelvisFemale").selectpicker('render');}
    if (app_currentExam.prostate) {$("#exam-prostate").selectpicker('val', app_currentExam.prostate.split(",")); $("#exam-prostate").selectpicker('render');}
    if (app_currentExam.rectalMale) {$("#exam-rectal-male").selectpicker('val', app_currentExam.rectalMale.split(",")); $("#exam-rectal-male").selectpicker('render');}
    if (app_currentExam.extUpper) {$("#exam-ext-upper").selectpicker('val', app_currentExam.extUpper.split(",")); $("#exam-ext-upper").selectpicker('render');}
    if (app_currentExam.extLower) {$("#exam-ext-lower").selectpicker('val', app_currentExam.extLower.split(",")); $("#exam-ext-lower").selectpicker('render');}
    if (app_currentExam.circPulses) {$("#exam-circ-pulses").selectpicker('val', app_currentExam.circPulses.split(",")); $("#exam-circ-pulses").selectpicker('render');}
    if (app_currentExam.reflexes) {$("#exam-reflexes").selectpicker('val', app_currentExam.reflexes.split(",")); $("#exam-reflexes").selectpicker('render');}
    if (app_currentExam.neurologic) {$("#exam-neurologic").selectpicker('val', app_currentExam.neurologic.split(",")); $("#exam-neurologic").selectpicker('render');}
    
    $('#exam-patient-initials').val(app_currentExam.patientInitials);
    $('#exam-completed-by').val(app_currentExam.completedBy);
    if(app_currentExam.completedByDate != null) { $('#exam-completed-by-date').val(dateFormat(app_currentExam.completedByDate, 'mm/dd/yyyy')); }
    
    initExamRadioButtonGroups();
    initExamSelectpickers();
    
    if (app_currentExam.completed == true) {
      $('#physical-exam-form .intake-field').attr("readonly", "readonly");
      $('#physical-exam-form .selectpicker').attr("disabled", "disabled");
      $('#physical-exam-form .desc-text').attr("readonly", "readonly");
      $('#physical-exam-form .radio-btn-group a').attr("disabled", "disabled");
      $('#app-close-exam-btn').hide();
      $('#app-delete-exam-btn').hide();
    }
    else {
      $('#physical-exam-form .intake-field').removeAttr("readonly");
      $('#physical-exam-form .selectpicker').removeAttr("disabled");
      $('#physical-exam-form .desc-text').removeAttr("readonly");
      $('#physical-exam-form .radio-btn-group a').removeAttr("disabled");
      $('#app-close-exam-btn').show();
      $('#app-delete-exam-btn').show();
      $('#app-close-exam-btn').off('click').on('click', function() { closeExamDialog() }); 
      $('#app-delete-exam-btn').off('click').on('click', function() { deleteExamDialog() }); 
      $('#physical-exam-form .intake-field').off('click').on('blur', function() { validateAndUpdateExamField(this) });
      $('#physical-exam-form .intake-select').off('click').on('change', function() { validateAndUpdateExamField(this) });
      $('#physical-exam-form .desc-text').off('click').on('blur', function() { updateExamRadioButtonField($(this), 'desc') });
    }
    
    $('#physical-exam-form .input-decimal').keydown(function(e) { util_filterDecimalInput(e); });
    $('#physical-exam-form .input-integer').keydown(function(e) { util_filterIntegerInput(e); });
    */
    
  });
}



function pm_viewInvoicing(){
 app_viewStack('invoicing-screen', DO_SCROLL);  
}



function pm_renderInvoicingScreen() {
 RenderUtil.render('screen/'+SPECIALTY+'/invoicing_screen', {}, function(s) {
  $("#patient-chart-item-screen").html(s);
  app_showScreen('Invoicing', app_patientChartItemCache);
  app_patientChartItemStack($('#invoicing-screen'), true);
  $("#patient-chart-item-screen").css({display: "block"});
  
  $('.selectpicker').selectpicker();
  $('#app-new-invoice-btn').click( function() { pm_newInvoice() }); 
  pm_getPatientInvoices();
 });  
}