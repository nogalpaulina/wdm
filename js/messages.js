
function ehr_getClinicianMessages() {
  var jsonData = JSON.stringify({ id: app_client.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getClinicianMessages", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    app_clinicianMessages = parsedData.clinicianMessages;
    RenderUtil.render('component/simple_data_table', 
     {items:app_clinicianMessages, 
      title:'Messages', 
      tableName:'messages-inbox', 
      clickable:true, 
      columns:[
        {title:'Date', field:'date', type:'date'},
        {title:'From', field:'patient.firstName', type:'double-person'},
        {title:'Subject', field:'subject', type:'simple'}
      ]}, function (s) {
      $('#messages-inbox').html(s);
      $('.clickable-table-row').click( function(e) { 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        app_currentMessageId = $(this).attr('name');
        app_viewClinicianMessage();
      });
    });
  });
}



function portal_getPatientMessages() {
  var jsonData = JSON.stringify({ id: patient.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientMessages", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    patientMessages = parsedData.patientMessages;
    RenderUtil.render('component/simple_data_table', 
    {items:patientMessages, 
    title:'Messages', 
    tableId:'patient_messages', 
    columns:[{title:'Date', field:'date', type:'date'}, 
             {title:'From', field:'clinician.firstName', type:'clinician'}, 
             {title:'Subject', field:'subject', type:'simple'}]},
    function(s) { 
      $('#patient_messages_table').html(s);
      $('.clickable-table-row').click( function(e) { 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        portal_handleClickablePatientMessageRow(e); 
      });
    });
  });
}



function portal_getPatientSentMessages() {
  var jsonData = JSON.stringify({ id: app_client.id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientSentMessages", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    portal_patientMessages = parsedData.patientMessages;
    RenderUtil.render('component/simple_data_table', 
    {items:portal_patientMessages, 
    title:'Messages', 
    tableId:'patient_sent_messages', 
    columns:[{title:'Date', field:'date', type:'date'}, 
             {title:'To', field:'clinician.firstName', type:'clinician'}, 
             {title:'Subject', field:'subject', type:'simple'}]},
    function(s) {
      $('#patient_sent_messages_table').html(s);
      $('.clickable-table-row').click( function(e) { 
        $(this).addClass('table-row-highlight').siblings().removeClass('table-row-highlight');
        portal_handleClickablePatientMessageRow(e); 
      });
    });
  });
}

  

function portal_handleClickablePatientMessageRow(e) {
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
    portal_getPatientMessage(id, tableId);
  }
}
  
  
function portal_getPatientMessage(id, tableId) {
  var jsonData = JSON.stringify({ id: id, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getPatientMessage", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    var content = parsedData.content;
    var fromClinician = parsedData.fromClinician;
    $('tr.row-content').css({"display":"table-row"});
    $('.row-content td').html('');
    $('.row-content td').css({"padding-bottom":"0px"});
    $('#'+tableId+'-content td').html(content);
    $('#'+tableId+'-content td').css({"padding-bottom":"20px"});
    if (fromClinician == true) {
      $('#'+tableId+' td').css({"font-weight":"normal"});
    }
  });
}

function portal_sendMessageToProvider() {
  var isValid = true;

  portal_sendMessage_clearErrors();
  
  if($("#send-message-clinician").val().length < 1) { 
    util_showError('#send-message-clinician-validation');
    isValid = false;
  }
  if($("#send-message-message").val().length < 1) { 
    util_showError('#send-message-message-validation');
    isValid = false;
  }
  
  if (isValid == false) {
    return;
  }
  
  var jsonData = JSON.stringify({ 
    patientId: app_client.id,
    sessionId: app_client.sessionId, 
    module:app_currentModule,
    subject: $('#send-message-subject').val(), 
    clinicianId: $('#send-message-clinician').val(), 
    content: $('#send-message-message').val(),
    messageType: MESSAGE_TYPE_MEDICAL_ADVICE
  });
  $('#getMedicalAdviceRunning').css({display: "block"});
  $.post("app/getMedicalAdvice", {data:jsonData}, function(data) {
    $('#getMedicalAdviceRunning').css({display: "none"});
    portal_sendMessage_clearForm();
    var parsedData = $.parseJSON(data);
    app_displayNotification('Message sent to provider.');
  });
}



function portal_sendMessage_clearForm() {
  $('#send-message-clinician').val('');
  $('#send-message-subject').val('');
  $('#send-message-message').val('');
  portal_sendMessage_clearErrors();
}



function portal_sendMessage_clearErrors() {
  $('#send-message-clinician-validation').css({visibility: "hidden"});
  $('#send-message-message-validation').css({visibility: "hidden"});
}



function portal_rxRequest() {
  var isValid = true;
  portal_rxRequest_clearErrors();
  
  if($("#rx-request-clinician").val().length < 1) { 
    util_showError('#rx-request-clinician-validation');
    isValid = false;
  }
  if($("#rx-request-message").val().length < 1) { 
    util_showError('#rx-request-message-validation');
    isValid = false;
  }
  
  if (isValid == false) {
    return;
  }
  
  var jsonData = JSON.stringify({ 
    patientId: app_client.id,
    sessionId: app_client.sessionId, 
    module:app_currentModule,
    subject: "Rx Renewal Request", 
    clinicianId: $('#rx-request-clinician').val(), 
    content: $('#rx-request-message').val(), 
    messageType: MESSAGE_TYPE_RX_RENEWAL
  });
  $('#requestRxRenewalRunning').css({display: "block"});
  $.post("app/requestRxRenewal", {data:jsonData}, function(data) {
    $('#requestRxRenewalRunning').css({display: "none"});
    rxRequest_clearForm();
    var parsedData = $.parseJSON(data);
    app_displayNotification('Prescription renewal request sent.');
  });
}




function portal_rxRequest_clearForm() {
  $('#rx-request-clinician').val('');
  $('#rx-request-message').val('');
  portal_rxRequest_clearErrors();
}



function portal_rxRequest_clearErrors() {
  $('#rx-request-clinician-validation').css({visibility: "hidden"});
  $('#rx-request-message-validation').css({visibility: "hidden"});
}



function app_viewClinicianMessage() {
  $('#messages-view').css({display: "block"});
  $('#messages-inbox').css({display: "none"});
  var jsonData = JSON.stringify({ id: app_currentMessageId, sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getClinicianMessage", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    var content = parsedData.content;
    if (parsedData.patient) {
      var patientName =  util_buildFullName(parsedData.patient.firstName, parsedData.patient.middleName, parsedData.patient.lastName);
      $('#messages-inbox-header').html("Message from: " + patientName);
    }
    else {
      $('#messages-inbox-header').html("Message from Request Appointment Form");
    }
    $('#message-content').html(content);
    $('#message-inbox-btn, #message-close-button').off('click').on('click', function() { 
       $('#messages-inbox').css({display: "block"}); 
       $('#messages-view').css({display: "none"}); 
     });
  });
}



function app_getValidMessageRecipients() {
  var jsonData = JSON.stringify({sessionId: app_client.sessionId, module:app_currentModule });
  $.post("app/getValidMessageRecipients", {data:jsonData}, function(data) {
  });
}



function pm_viewMessages() {
  app_viewStack('messages-screen', DO_SCROLL);
  RenderUtil.render('screen/messages_screen', {}, function(s) {
    $("#messages-screen").html(s);
    $('#messages-inbox-header').html('Inbox');
    pm_getPatientToClinicianMessages();
    app_getValidMessageRecipients();
  }); 
}



function ehr_viewMessages() {
  app_viewStack('messages-screen', DO_SCROLL);
  RenderUtil.render('screen/messages_screen', {}, function(s) {
    $("#messages-screen").html(s);
    $('#messages-inbox-header').html('Inbox');
    ehr_getClinicianMessages();
    app_getValidMessageRecipients();
  }); 
}



function ehr_viewMessages() {
  app_viewStack('messages-screen', DO_SCROLL);
  RenderUtil.render('screen/messages_screen', {}, function(s) {
    $("#messages-screen").html(s);
    $('#messages-inbox-header').html('Inbox');
    ehr_getClinicianMessages();
    app_getValidMessageRecipients();
  }); 
}