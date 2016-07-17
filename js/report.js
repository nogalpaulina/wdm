var app_currentReportId;
var app_clinicianActivity;
var app_activityLogs;
var app_groupByPatientsLog;



function pm_clearActivityLogFilter() {
  $('#reports-clinician-search-full-name').val('');
  $('#reports-activity-log-activity').val('0');
  $('#reports-patient-search-full-name').val('');
  $('#report-date-from').val('');
  $('#report-date-to').val('');
}

function pm_clearSalesLeadFilter() {
  $('#sales-lead-age-range').val('0');
  $('#sales-lead-us-state').val('0');
  $('#sales-lead-gender').val('0');
}



function pm_getReportsList() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("reports/getReportList", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var reportList = parsedData.reportList;
    RenderUtil.render('component/simple_data_table', 
     {items:reportList, 
      title:'Reports List', 
      tableName:'reports-list', 
      clickable:true,
      columns:[
       {title:'Available Reports', field:'title', type:'simple'}
     ]}, function(s) {
      $('#reports-list').html(s); 
      $('#sales-lead-report-filter').css({display: "none"});
      $('#activity-log-report-filter').css({display: "none"});
      $('#activity-log-reports-view').css({display: "none"});
      $('#sales-lead-reports-view').css({display: "none"});
      $('#reports-view-header').css({display: "none"});
      $('').css({display: "none"});
      $('.clickable-table-row').click( function(e){ 
          $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
          app_handleClickableRow(e); 
      });
    });
  });
}



function pm_getActivityLog() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("reports/getActivityLog", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var app_activityLogs = parsedData;
    RenderUtil.render('component/simple_data_table', 
     {items:app_activityLogs, 
      title:'Activity Logs', 
      tableName:'reports-content', 
      clickable:false,
      columns:[
       {title:'User Name', field:'userName', type:'simple'},
       {title:'Patient Name', field:'patientName', type:'simple'},
       {title:'Time Performed', field:'timePerformed', type:'simple'},
       {title:'Clinician Name', field:'clinicianName', type:'simple'},
       {title:'Field Name', field:'fieldName', type:'simple'},
       {title:'Activity', field:'activity', type:'simple'},
       {title:'Module', field:'module', type:'simple'}
      ]}, function(s) {
      $('#activity-log-reports-content').html(s);
      $('#reports-view-header').html("Activity Logs");  
      $('#report-date-from').mask("99/99/9999");
      $('#report-date-to').mask("99/99/9999");
    });
  });
}



function pm_getGroupByPatientsLogs() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("reports/getGroupByPatientsLogs", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_groupByPatientsLog = parsedData.groupByPatientsLog;
    RenderUtil.render('component/reports_nested_table', 
     {items:app_groupByPatientsLog, 
      title:'Grouped by Patients Activity Logs', 
      tableName:'reports-content', 
      clickable:false
      }, function(s) {
      $('#activity-log-reports-content').html(s);
      $('#reports-view-header').html("Grouped by Patients Activity Logs");  
      $('#report-date-from').mask("99/99/9999");
      $('#report-date-to').mask("99/99/9999");
    });
  });
}



function pm_exportTableToCSV($table, filename) {
  $rows = $table.find('tr');
  var csvData = "";
  var csv = "";
  for(var i=0;i<$rows.length;i++) {
    var $cells = $($rows[i]).children('th,td'); //header or content cells
    for(var y=0;y<$cells.length;y++) {
      if(y>0) {
        csv += ",";
      }
      var txt = ($($cells[y]).text()).toString().trim();
      if (txt.indexOf(',')>=0 || txt.indexOf('\"')>=0 || txt.indexOf('\n')>=0) {
        txt = "\"" + txt.replace(/\"/g, "\"\"") + "\"";
      }
      csv += txt;
    }
    csv += '\n';
  }
  csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
  $(this).attr({ 'download': filename, 'href': csvData, 'target': '_blank' });
}



function pm_viewReport() {
  $('#reports-view').css({display: "block"});
  $('#reports-view-header').css({display: "block"});
  $('#reports-list').css({display: "none"});
  
  if(app_currentReportId == 25) {
    $('#activity-log-report-filter').css({display: "block"});
    $('#sales-lead-report-filter').css({display: "none"});
    pm_getActivityLog();
  }
  else if(app_currentReportId == 26) {
    $('#activity-log-report-filter').css({display: "block"});
    $('#sales-lead-report-filter').css({display: "none"});
    pm_getGroupByPatientsLogs();
  }
  else if(app_currentReportId == 27) {
    $('#sales-lead-report-filter').css({display: "block"});
    $('#activity-log-report-filter').css({display: "none"});
    pm_getSalesLeads();
  }
  else{
    $('#reports-view-header').html(app_currentReportId);
  }
}



function pm_initActivityLogSearchTypeAheads() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("reports/getActivityLogSearchTypeAheads", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var activityLogClinicianSearchTypeAheads = parsedData.activityLogClinicianSearchTypeAheads;
    var activityLogPatientSearchTypeAheads = parsedData.activityLogPatientSearchTypeAheads;
    app_clinicianActivity = parsedData.clinicianActivityList.clinicianActivity;
    $('#reports-clinician-search-full-name').typeahead(
      { hint: true, highlight: true, minLength: 1 },
      { name: 'clinicianFullNames', displayKey: 'value', source: util_substringMatcher(activityLogClinicianSearchTypeAheads.clinicianFullNames) }); 
    $('#reports-patient-search-full-name').typeahead(
      { hint: true, highlight: true, minLength: 1 },
      { name: 'patientFullNames', displayKey: 'value', source: util_substringMatcher(activityLogPatientSearchTypeAheads.patientFullNames) });
    pm_renderClinicianActivity();
  });      
}



function pm_initSalesLeadSearchTypeAheads() {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("reports/getSalesLeadSearchTypeAheads", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var salesLeadUSStateSearchTypeAheads = parsedData.salesLeadUSStateSearchTypeAheads;
    $('#sales-lead-us-state').typeahead(
      { hint: true, highlight: true, minLength: 1 },
      { name: 'usStates', displayKey: 'value', source: util_substringMatcher(salesLeadUSStateSearchTypeAheads.usStates)
    }); 
    pm_renderGoals();
    pm_renderGender();
    pm_renderSalesLeadAgeRanges();
  });      
}



function pm_renderClinicianActivity() {
  RenderUtil.render('component/basic_select_options', {options:app_clinicianActivity, collection:'app_clinicianActivity', choose:true}, function(s) {
    $('#reports-activity-log-activity').html(s);
  });
}



function pm_renderGender() {
  RenderUtil.render('component/basic_select_options', {options:app_gender, collection:'app_gender', choose:true}, function(s) {
    $("#sales-lead-gender").html(s);
  });
}



function pm_renderGoals() {
  RenderUtil.render('component/basic_select_options', {options:pm_salesLeadGoals, collection:'pm_salesLeadGoals', choose:true}, function(s) {
    $("#sales-lead-goals").html(s);
  });
}



function pm_renderSalesLeadAgeRanges() {
  RenderUtil.render('component/basic_select_options', {options:pm_salesLeadAgeRanges, collection:'pm_salesLeadAgeRanges', choose:true}, function(s) {
    $("#sales-lead-age-range").html(s);
  });
}



function pm_filterSalesLeads(){
  var jsonData = JSON.stringify({ 
  module:app_currentModule,
  ageRangeId: $.trim($("#sales-lead-age-range").val()),
  usState: $.trim($("#sales-lead-us-state").val()),
  genderId: $.trim($("#sales-lead-gender").val()),
  goalId: $.trim($("#sales-lead-goals").val()),
    sessionId: app_client.sessionId 
  });debug("filterSalesLeads filter json data: "+jsonData);
  $.post("reports/filterSalesLeads", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var salesLeads = parsedData;
    RenderUtil.render('component/simple_data_table', 
   {items:salesLeads, 
    title:'Sales Leads', 
    tableName:'sales-lead-reports-content', 
    clickable:false,
    columns:[
     {title:'Title', field:'title', type:'simple'},
     {title:'Name', field:'fullName', type:'simple'},
     {title:'Email', field:'email', type:'simple'},
     {title:'Primary Phone', field:'primaryPhone', type:'simple'},
     {title:'Secondary Phone', field:'secondaryPhone', type:'simple'},
     {title:'DOB', field:'dob', type:'simple'},
     {title:'Gender', field:'gender', type:'simple'},
     {title:'Age Range', field:'ageRange', type:'simple'},
     {title:'Street Address', field:'streetAddress1', type:'simple'},
     {title:'City', field:'city', type:'simple'},
     {title:'US State', field:'usState', type:'simple'},
     {title:'Postal Code', field:'postalCode', type:'simple'},
     {title:'Goal', field:'goal', type:'simple'},
     {title:'Incomplete', field:'incomplete', type:'simple'}
     ]}, function(s) {
    $('#sales-lead-reports-content').html(s);
    $('#reports-view-header').html("Sales Leads");    
  });
  });
}



function pm_filterActivityLogs() {
  var jsonData = JSON.stringify({ 
  module:app_currentModule,
  dateFrom: $.trim($("#report-date-from").val()),
  dateTo: $.trim($("#report-date-to").val()),
  clinicianName: $.trim($("#reports-clinician-search-full-name").val()),
  activityId: $.trim($("#reports-activity-log-activity").val()),
    patientName: $.trim($("#reports-patient-search-full-name").val()),
    sessionId: app_client.sessionId 
  });debug("ActivityLog filter json data: "+jsonData);
  $.post("reports/filterActivityLogs", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var activityLogs = parsedData;
    RenderUtil.render('component/simple_data_table', 
   {items:activityLogs, 
    title:'Activity Logs', 
    tableName:'activity-log-reports-content', 
    clickable:false,
    columns:[
     {title:'User Name', field:'userName', type:'simple'},
     {title:'Patient Name', field:'patientName', type:'simple'},
     {title:'Time Performed', field:'timePerformed', type:'simple'},
     {title:'Clinician Name', field:'clinicianName', type:'simple'},
     {title:'Field Name', field:'fieldName', type:'simple'},
     {title:'Activity', field:'activity', type:'simple'},
     {title:'Module', field:'module', type:'simple'}
    ]}, function(s) {
    $('#activity-log-reports-content').html(s);
    $('#reports-view-header').html("Activity Logs");        
  });
  });
}



function pm_filterGroupByPatientsActivityLogs() {
  var jsonData = JSON.stringify({ 
  module:app_currentModule,
  dateFrom: $.trim($("#report-date-from").val()),
  dateTo: $.trim($("#report-date-to").val()),
  clinicianName: $.trim($("#reports-clinician-search-full-name").val()),
  activityId: $.trim($("#reports-activity-log-activity").val()),
    patientName: $.trim($("#reports-patient-search-full-name").val()),
    sessionId: app_client.sessionId 
  });debug("Grouped by " + app_practiceClientProperties['app.patient_label'] + "s Activity Logs json data: "+jsonData);
  $.post("reports/filterGroupByPatientsActivityLogs", {data:jsonData}, function(data) {
      var parsedData = $.parseJSON(data);
      if (!util_checkSessionResponse(parsedData)) return false;
      RenderUtil.render('component/reports_nested_table', 
       {items:parsedData, 
        title:'Grouped by Patients Activity Logs', 
        tableName:'activity-log-reports-content', 
        clickable:false
        }, function(s) {
        $('#activity-log-reports-content').html(s);
        $('#reports-view-header').html("Grouped by " + app_practiceClientProperties['app.patient_label'] + " Activity Logs");        
      });
  });
}



function pm_getSalesLeads(){
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule });
  $.post("reports/getSalesLeads", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var salesLeads = parsedData.salesLeads;
    RenderUtil.render('component/simple_data_table', 
   {items:salesLeads, 
    title:'Sales Leads', 
    tableName:'sales-lead-reports-content', 
    clickable:false,
    columns:[
     {title:'Title', field:'title', type:'simple'},
     {title:'Name', field:'fullName', type:'simple'},
     {title:'Email', field:'email', type:'simple'},
     {title:'Primary Phone', field:'primaryPhone', type:'simple'},
     {title:'Secondary Phone', field:'secondaryPhone', type:'simple'},
     {title:'DOB', field:'dob', type:'simple'},
     {title:'Gender', field:'gender', type:'simple'},
     {title:'Age Range', field:'ageRange', type:'simple'},
     {title:'Street Address', field:'streetAddress1', type:'simple'},
     {title:'City', field:'city', type:'simple'},
     {title:'US State', field:'usState', type:'simple'},
     {title:'Postal Code', field:'postalCode', type:'simple'},
     {title:'Goal', field:'goal', type:'simple'},
     {title:'Incomplete', field:'incomplete', type:'simple'}
    ]}, function(s) {
    $('#sales-lead-reports-content').html(s);
    $('#reports-view-header').html("Sales Leads");
  });
  });
}



function pm_viewReports() {
  app_viewStack('reports-screen', DO_SCROLL);
  pm_initActivityLogSearchTypeAheads();
  pm_initSalesLeadSearchTypeAheads();
  pm_getReportsList();
}


