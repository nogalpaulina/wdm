
function pm_deleteApptConfirm(e, id) {
  var args = {
    modalTitle:"Delete Appointment", 
    modalH3:"Delete Appointment?",
    modalH4:"",
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').click(function(){  
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id, module:app_currentModule });
      $.post("app/deleteAppt", {data:jsonData}, function(data) {
        var parsedData = $.parseJSON(data);
        if (!util_checkSessionResponse(parsedData)) return false;
        $('#modal-confirm').modal('hide'); 
        $('#modal-appt').modal('hide');
        app_displayNotification('Appointment Deleted.');
        app_loadCalendar();
      }); 
    });
  });
}



function pm_editApptForm(calEvent) {
  var start = calEvent.start;
  var end = calEvent.end;
  var id = calEvent.id;
  var offset = new Date().getTimezoneOffset();
  start.add(offset,'m');
  end.add(offset,'m');
  var title = 'Edit Appointment';
  RenderUtil.render('dialog/appt', {title:title, deleteButton:'Delete',submitButtonLabel:'Update'}, function(s) {
    $('#modals-placement').html(s);
    $('#modal-appt').modal('show'); 
    $('#app-appt-date').datetimepicker({ format: 'L', defaultDate: start });
    $('#modal-appt .input-timepicker').timepicker();
    $('#app-appt-start').val(dateFormat(start, 'h:MM TT'));
    $('#app-appt-end').val(dateFormat(end, 'h:MM TT'));
    $('#app-appt-desc').val(calEvent.desc);
    
    var jsonData = JSON.stringify({ 
      sessionId: app_client.sessionId,
      module:app_currentModule,
      id: calEvent.id
    });
  
    $.post("app/getCalendarEvent", {data:jsonData}, function(data) {
      var parsedData = $.parseJSON(data);
      if (!util_checkSessionResponse(parsedData)) return false;
      var appt = parsedData.calendarEvent;
      var patientFullName = util_buildFullName(appt.patient.firstName, appt.patient.middleName, appt.patient.lastName);
      $('#app-appt-patient-text').val(patientFullName);
      $('#app-appt-patient-text').show();
      $('#app-appt-patient').hide();
      var clinicianFullName = util_buildFullName(appt.clinician.firstName, appt.clinician.middleName, appt.clinician.lastName);
      RenderUtil.render('component/person_select_options', {options:app_clinicians}, function(s) {
        $("#app-appt-clinician").html(s);
        $("#app-appt-clinician").val(appt.clinician.id);
      });
      $('#app-appt-clinician-text').hide();
      $('#app-appt-clinician').show();
    });
    
    $('#app-appt-submit').off('click').on("click", function (e) { 
      var dateString = $("#app-appt-date").find("input").val();
      pm_handleUpdateAppt(e, dateString, id); 
    });
    $('#app-appt-delete').off('click').on("click", function (e) { pm_deleteApptConfirm(e, id); });
  });
}



function pm_handleNewAppt(e, dateString) {
  var isValid = true;
  pm_handleNewAppt_clearErrors();
  
  var apptStartValid = util_checkRegexp($.trim($("#app-appt-start").val()), /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
  if (apptStartValid == false) {
    app_showError('#app-appt-start-validation', 'invalid time format');
    isValid = false;
  }
  
  var apptEndValid = util_checkRegexp($.trim($("#app-appt-end").val()), /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
  if (apptEndValid == false) {
    app_showError('#app-appt-end-validation', 'invalid time format');
    isValid = false;
  }
  
  if($("#app-appt-clinician").val().length < 1) { 
    app_showError('#app-appt-clinician-validation');
    isValid = false;
  }
  if(!$("#app-appt-patient").val() || $("#app-appt-patient").val().length < 1) { 
    app_showError('#app-appt-patient-validation');
    isValid = false;
  }
  
  app_currentDate = dateString;
  var startTimeString = dateString + " " + $('#app-appt-start').val();
  var endTimeString = dateString + " " + $('#app-appt-end').val();
  var startDate = new Date(startTimeString);
  var endDate = new Date(endTimeString);
  var startTimestamp = startDate.getTime();
  var endTimestamp = endDate.getTime();
 
  if (endTimestamp < startTimestamp) {
    isValid = false;
    app_showError('#app-appt-end-validation', 'invalid time range');
  }
  else if (endTimestamp - startTimestamp < 900000) {
    isValid = false;
    app_showError('#app-appt-end-validation', 'Appointment must be at least 15 minutes long.');
  }
  
  if (isValid == false) {
    return;
  }
  
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    module:app_currentModule,
    startTime: startTimeString,
    endTime: endTimeString,
    clinicianId: $('#app-appt-clinician').val(), 
    id: $('#app-appt-patient').val(),
    desc: $('#app-appt-desc').val() 
  });
  
  $.post("app/newAppt", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_displayNotification('New appointment created.');
    pm_handleNewAppt_clearForm();
    $('#modal-appt').modal('hide');
    app_loadCalendar();
  });
}



function pm_handleNewAppt_clearErrors() {
  $('#app-appt-start-validation').css({visibility: "hidden"});
  $('#app-appt-end-validation').css({visibility: "hidden"});
  $('#app-appt-clinician-validation').css({visibility: "hidden"});
  $('#app-appt-patient-validation').css({visibility: "hidden"});
  $('#app-appt-desc-validation').css({visibility: "hidden"});
}



function pm_handleNewAppt_clearForm() {
  $('#app-appt-start').val('');
  $('#app-appt-end').val('');
  $('#app-appt-clinician').val('');
  $('#app-appt-patient').val('');
  $('#app-appt-desc').val('');
  pm_handleNewAppt_clearErrors();
}



function pm_handleUpdateAppt(e, dateString, id) {
  var isValid = true;
  pm_handleNewAppt_clearErrors();
  
  var apptStartValid = util_checkRegexp($.trim($("#app-appt-start").val()), /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
  if (apptStartValid == false) {
    showError('#app-appt-start-validation', 'invalid time format');
    isValid = false;
  }
  
  var apptEndValid = util_checkRegexp($.trim($("#app-appt-end").val()), /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/);
  if (apptEndValid == false) {
    showError('#app-appt-end-validation', 'invalid time format');
    isValid = false;
  }
  if($("#app-appt-clinician").val().length < 1) { 
    showError('#app-appt-clinician-validation');
    isValid = false;
  }

  if (isValid == false) {
    return;
  }
  
  app_currentDate = dateString;
  var startTimeString = dateString + " " + $('#app-appt-start').val();
  var endTimeString = dateString + " " + $('#app-appt-end').val();
  var startDate = new Date(startTimeString);
  var endDate = new Date(endTimeString);
  var startTimestamp = startDate.getTime();
  var endTimestamp = endDate.getTime();
 
  if (endTimestamp < startTimestamp) {
    isValid = false;
    showError('#app-appt-end-validation', 'invalid time range');
  }
  else if (endTimestamp - startTimestamp < 900000) {
    isValid = false;
    showError('#app-appt-end-validation', 'Appointment must be at least 15 minutes long.');
  }
  
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    module:app_currentModule,
    id: id,
    clinician: $('#app-appt-clinician').val(), 
    startTime: startTimeString,
    endTime: endTimeString,
    desc: $('#app-appt-desc').val() 
  });
  
  $.post("app/updateAppt", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    pm_handleNewAppt_clearForm();
    app_displayNotification('Appointment updated.');
    $('#modal-appt').modal('hide');
    app_loadCalendar();
  });
 
}


function pm_moveAppt(event, jsEvent, ui, view) {
  var start = event.start;
  var end = event.end;
  var offset = new Date().getTimezoneOffset();
  start.add(offset,'m');
  end.add(offset,'m');
  app_currentDate = dateFormat(start, 'mm/dd/yyyy');
  var startTimeString = dateFormat(start, 'mm/dd/yyyy') + " " + dateFormat(start, 'h:MM TT');
  var endTimeString = dateFormat(end, 'mm/dd/yyyy') + " " + dateFormat(end, 'h:MM TT');
  
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    module:app_currentModule,
    startTime: startTimeString,
    endTime: endTimeString,
    id: event.id
  });
  
  $.post("app/changeApptTime", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_displayNotification('Appointment moved.');
    app_loadCalendar();
  });
}



function pm_newApptForm(start, end) {
  var offset = new Date().getTimezoneOffset();
  start.add(offset,'m');
  end.add(offset,'m');
  var title = 'New Appointment';
  RenderUtil.render('dialog/appt', {title:title,deleteButton:null,submitButtonLabel:'Add'}, function(s) {
    $('#modals-placement').html(s);
    $('#modal-appt').modal('show'); 
    $('#app-appt-date').datetimepicker({ format: 'L', defaultDate: start });
    $('#modal-appt .input-timepicker').timepicker();
    
    if (app_currentCalendarView == 'month') {
      var startTimeString = dateFormat(start, 'mm/dd/yyyy') + ' 9:00 AM';
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, module:app_currentModule, startTime: startTimeString, apptLengthInMinutes: 30 });
      $.post("app/suggestApptSlot", {data:jsonData}, function(data) {
        var parsedData = $.parseJSON(data);
        if (!util_checkSessionResponse(parsedData)) return false;
        $('#app-appt-start').val(dateFormat(parsedData.newApptStartTime, 'h:MM TT'));
        $('#app-appt-end').val(dateFormat(parsedData.newApptEndTime, 'h:MM TT'));
      });
    }
    else {
      $('#app-appt-start').val(dateFormat(start, 'h:MM TT'));
      $('#app-appt-end').val(dateFormat(end, 'h:MM TT'));
    }
    RenderUtil.render('component/person_select_options', {options:app_clinicians}, function(s) {
      $("#app-appt-clinician").html(s);
    });
    $('#app-appt-clinician').on('change',function(){
      app_selectedClinician = $('#app-appt-clinician').val();
      app_getClinicianPatients();
    });
    $('#app-appt-submit').off('click').on("click", function (e) { 
      var dateString = $("#app-appt-date").find("input").val();
      pm_handleNewAppt(e, dateString, offset); 
    });
  });
}



function pm_resizeAppt(event, jsEvent, ui, view) {
  var start = event.start;
  var end = event.end;
  var offset = new Date().getTimezoneOffset();
  start.add(offset,'m');
  end.add(offset,'m');
  app_currentDate = dateFormat(start, 'mm/dd/yyyy');
  var startTimeString = dateFormat(start, 'mm/dd/yyyy') + " " + dateFormat(start, 'h:MM TT');
  var endTimeString = dateFormat(end, 'mm/dd/yyyy') + " " + dateFormat(end, 'h:MM TT');
  
  var jsonData = JSON.stringify({ 
    sessionId: app_client.sessionId,
    module:app_currentModule,
    startTime: startTimeString,
    endTime: endTimeString,
    id: event.id
  });
  
  $.post("app/changeApptTime", {data:jsonData}, function(data) {
    var parsedData = $.parseJSON(data);
    if (!util_checkSessionResponse(parsedData)) return false;
    app_displayNotification('Appointment length changed.');
    app_loadCalendar();
  });
}

