$('#app-allergies-btn').click(function(e){getPatientAllergens();});
$('#app-immunizations-btn').click(function(e){getPatientImmunizations();});
$('#app-medications-btn').click(function(e){getPatientMedications();});
$('#app-prevcare-btn').click(function(e){getPatientProcedures();});
$('#app-health-issues-btn').click(function(e){getPatientHealthIssues();});
$('#app-tests-btn').click(function(e){getPatientMedicalTests();});
$('#app-health-trends-btn').click(function(e){getPatientHealthTrendReports()});
$('#app-letters-btn').click(function(e){getPatientLetters()});


$('#back-to-tests-btn').click(function(e){
  $('#patient_medical_tests_table').css({display: "block"}); 
  $('#back-to-tests-btn').css({display: "none"}); 
  $('#patient_medical_test_components_table').css({display: "none"});
});

$('#back-to-health-trends-btn').click(function(e){
  $('#patient_health_trend_reports_table').css({display: "block"}); 
  $('#patient_health_issue_detail_table').css({display: "none"}); 
  $('#health-trends-chart-canvas').css({display: "none"}); 
  $('#back-to-health-trends-btn').css({display: "none"}); 
  $("#app-health-trends-subtitle").css({display: "block"});
});


function getPatientAllergens() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientAllergens", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientAllergens = parsedData.patientAllergens;
    RenderUtil.render('component/simple_data_table', 
     {items:patientAllergens, 
     title:'Allergies', 
     columns:[{title:'Allergen', field:'allergen.name', type:'name'}, 
              {title:'Reaction', field:'comment', type:'simple'}]},
     function(s) { $('#patient_allergies_table').html(s); });
  });
}


function getPatientImmunizations() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientImmunizations", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientImmunizations = parsedData.patientImmunizations;
    RenderUtil.render('component/simple_data_table', 
    {items:patientImmunizations, 
    title:'Immunizations', 
    columns:[{title:'Immunization', field:'immunization.name', type:'name'}, 
             {title:'Date', field:'date', type:'date'}]},
     function(s) { $('#patient_immunizations_table').html(s); });
  });
}


function getPatientProcedures() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientProcedures", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientMedicalProcedures = parsedData.patientMedicalProcedures;
    RenderUtil.render('component/simple_data_table', 
    {items:patientMedicalProcedures, 
    title:'Preventative Care', 
    columns:[{title:'Name', field:'medicalProcedure.name', type:'name'}, 
      {title:'Due Date', field:'dueDate', type:'date'}, 
      {title:'Status', field:'status.name', type:'name'}, 
      {title:'Last Done', field:'lastDone', type:'date'}]},
     function(s) { $('#patient_medical_procedures_table').html(s); });
  });
}


function getPatientHealthIssues() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientHealthIssues", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientHealthIssues = parsedData.patientHealthIssues;
    RenderUtil.render('component/simple_data_table', 
    {items:patientHealthIssues, 
    title:'Health Issues', 
    columns:[{title:'Health Issue', field:'healthIssue.name', type:'name'}, 
             {title:'Date', field:'date', type:'date'}]},
    function(s) { $('#patient_health_issues_table').html(s); });
  });
}

  
function getPatientMedications() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientMedications", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientMedications = parsedData.patientMedications;
    RenderUtil.render('component/simple_data_table', 
    {items:patientMedications, 
      title:'Medications', 
      columns:[{title:'Medication', field:'medication.name', type:'name'}, 
               {title:'Instructions', field:'instructions', type:'simple'},
               {title:'Prescriber', field:'prescriber', type:'prescriber'},
               {title:'Date', field:'date', type:'date'}]},
      function(s) { $('#patient_medications_table').html(s); });
  });
}


function getPatientMedicalTests() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientMedicalTests", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientMedicalTests = parsedData.patientMedicalTests;
    RenderUtil.render('component/simple_data_table', 
    {items:patientMedicalTests, 
    title:'Test Results', 
    columns:[{title:'Date', field:'date', type:'date'}, 
            {title:'Test', field:'medicalTest.name', type:'name'}, 
            {title:'Ordered By', field:'clinician.firstName', type:'clinician'}, 
            {title:'Status', field:'status.name', type:'name'}]},
    function(s) { 
      $(".app-test-results-title").html(" Test Results");
      $("#app-tests-subtitle").css({display: "block"});
      $('#patient_medical_tests_table').html(s); 
      $('#patient_medical_tests_table').css({display: "block"}); 
      $('#back-to-tests-btn').css({display: "none"}); 
      $('#patient_medical_test_components_table').css({display: "none"}); 
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        handleClickablePatientMedicalTestRow(e); 
      });
    });
  });
}
  

function handleClickablePatientMedicalTestRow(e) {
  var id = undefined;
  var tableName = undefined;
  var attributes = e.currentTarget.attributes;
  for (i=0;i<attributes.length;i++) {
    if (attributes[i].name == 'name') {
      id = attributes[i].nodeValue; 
    }
    if (attributes[i].name == 'data-table-name') {
      app_currentMedicalTestName = attributes[i].nodeValue; 
      $(".app-test-results-title").html(app_currentMedicalTestName);
      $("#app-tests-subtitle").css({display: "none"});
    }
  }
  if (id !== undefined) {
    getPatientMedicalTestComponents(id);
  }
}
  

function getPatientMedicalTestComponents(id) {
  var jsonData = JSON.stringify({ patientMedicalTestId: id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientMedicalTestComponents", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientMedicalTestComponents = parsedData.patientMedicalTestComponents;
    RenderUtil.render('component/simple_data_table', 
    {items:patientMedicalTestComponents, 
    title:'Component Results', 
    columns:[{title:'Component', field:'name', type:'simple'}, 
            {title:'Your Value', field:'testValue', type:'simple'}, 
            {title:'Standard Range', field:'testRange', type:'simple'}, 
            {title:'Units', field:'units', type:'simple'}, 
            {title:'Flag', field:'flag', type:'simple'}]},
    function(s) { 
      $('#patient_medical_test_components_table').html(s); 
      $('#patient_medical_tests_table').css({display: "none"}); 
      $('#patient_medical_test_components_table').css({display: "block"}); 
      $('#back-to-tests-btn').css({display: "inline-block"}); 
    });
  });
}


  
function getPatientHealthTrendReports() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientHealthTrendReports", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientHealthTrendReports = parsedData.patientHealthTrendReports;
    RenderUtil.render('component/simple_data_table', 
    {items:patientHealthTrendReports, 
    title:'Available Reports', 
    columns:[{title:'Available Reports', field:'healthTrendReport.name', type:'name'}]},
    function(s) { 
      $('#patient_health_trend_reports_table').html(s);
      $('#patient_health_trend_reports_table').css({display: "block"}); 
      $('#patient_health_issue_detail_table').css({display: "none"}); 
      $('#health-trends-chart-canvas').css({display: "none"}); 
      $('#back-to-health-trends-btn').css({display: "none"}); 
      $("#app-health-trends-subtitle").css({display: "block"});
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        handleClickableHealthTrendReportsRow(e); 
      });
    });
  });
}
  
function handleClickableHealthTrendReportsRow(e) {
  var id = undefined;
  var attributes = e.currentTarget.attributes;
  for (i=0;i<attributes.length;i++) {
    if (attributes[i].name == 'name') {
      id = attributes[i].nodeValue; 
    }
    if (attributes[i].name == 'data-table-name') {
      app_currentHealthIssueName = attributes[i].nodeValue; 
    }
  }
  if (id !== undefined) {
    if (id == HEALTH_TREND_VITAL_SIGNS) {  
      getPatientVitalSigns(id);
    }
    else if (id == HEALTH_TREND_DM_DATA) {  
      getPatientDMData(id);
    }
    else if (id == HEALTH_TREND_LIPIDS) {  
      getPatientLipids(id);
    }
    $('#patient_health_trend_reports_table').css({display: "none"}); 
    $('#patient_health_issue_detail_table').css({display: "block"}); 
    $('#health-trends-chart-canvas').css({display: "block"}); 
    $('#back-to-health-trends-btn').css({display: "inline-block"}); 
    $("#app-health-trends-subtitle").css({display: "none"});
  }
}


function getPatientLetters() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientLetters", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientLetters = parsedData.patientLetters;
    RenderUtil.render('component/simple_data_table', 
    {items:patientLetters, 
    title:'Letters', 
    tableId:'patient_letters', 
    columns:[{title:'Date', field:'date', type:'date'}, 
             {title:'From', field:'clinician.firstName', type:'clinician'}, 
             {title:'Reason', field:'reason.name', type:'name'}, 
             {title:'Status', field:'status.name', type:'name'}]},
    function (s) { 
      $('#patient_letters_table').html(s);
      $('.clickable-table-row').click( function(e){ 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        handleClickablePatientLetterRow(e); 
      });
    });
  });
}
  

function handleClickablePatientLetterRow(e) {
  var id = undefined;
  var tableId = undefined;
  var attributes = e.currentTarget.attributes;
  for (i=0;i<attributes.length;i++) {
    if (attributes[i].name == 'name') {
      id = attributes[i].nodeValue; 
    }
    if (attributes[i].name == 'id') {
      tableId = attributes[i].nodeValue; 
    }
  }
  if ($('#'+tableId+'-content td').html() != '') {
    $('#'+tableId+'-content td').html('');
    $('#'+tableId+'-content td').css({"padding-bottom":"0px"});
    $('tr.row-content').css({"display":"none"});
     return;
  }
  if (id !== undefined) {
    getPatientLetter(id, tableId);
  }
}
  
  
function getPatientLetter(id, tableId) {
  var jsonData = JSON.stringify({ id: id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientLetter", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    var content = parsedData.content;
    var fromClinician = parsedData.fromClinician;
    $('tr.row-content').css({"display":"table-row"});
    // $('#'+tableId+'-'+id+'-content').css({"display":"table-row"});
    $('.row-content td').html('');
    $('.row-content td').css({"padding-bottom":"0px"});
    $('#'+tableId+'-content td').html('<pre>'+content+'</pre>');
    $('#'+tableId+'-content td').css({"padding-bottom":"20px"});
    $('#'+tableId+' td').css({"font-weight":"normal"});
  });
}