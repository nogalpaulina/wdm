

function pot_ehr_addEvalLongTermGoal($this, list, evalType) {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId:app_currentPatient.id, evalType:evalType});
  $.post("patient/addLongTermGoal", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var longTermGoalId = parsedData.id;
    RenderUtil.render('component/long_term_goal', {id: longTermGoalId, instanceName:'pot-entity-form-LongTermGoal', index: list.length+1}, function(s) { 
      $('#eval-long-term-goals').append(s); 
      $('.eval-long-term-goal-delete-control').off().on('click', function() { pot_ehr_deleteEvalLongTermGoal($(this)); });
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
    });
  }); 
}



function pot_ehr_addEvalShortTermGoal($this, list, evalType) {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId:app_currentPatient.id, evalType:evalType});
  $.post("patient/addShortTermGoal", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var shortTermGoalId = parsedData.id;
    RenderUtil.render('component/short_term_goal', {id: shortTermGoalId, instanceName:'pot-entity-form-ShortTermGoal', index: list.length+1}, function(s) { 
      $('#eval-short-term-goals').append(s); 
      $('.eval-short-term-goal-delete-control').off().on('click', function() { pot_ehr_deleteEvalShortTermGoal($(this)); });
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
    });
  }); 
}



function pot_ehr_addEvalSubtest($this, evalType) {
  var testId = $this.attr('data-id');
  var testName = $('#eval-test-name-'+testId).val();
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, testId:testId, evalType:evalType});
  $.post("patient/addEvalSubtest", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var id = parsedData.id;
    RenderUtil.render('component/'+SPECIALTY+'/eval_subtest', {id:id, testName:testName, instanceName:'pot-entity-form-EvalSubtest'}, function(s) { 
      $('#eval-subtests-'+testId).append(s); 
      $('.eval-subtest-delete-control').off().on('click', function() { pot_ehr_deleteEvalSubtestConfirm($(this)); });
      $('.eval-subtest-name').off('change').on('change', function() { pot_ehr_updatePerformanceSelect($(this)) });
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
      $('.list-item-select').off().on('change', function(e) { form_updateListItem($(this)); });
    });
  }); 
}



function pot_ehr_addEvalTest($this, evalType, instanceName) {
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, patientId:app_currentPatient.id, evalType:evalType});
  $.post("patient/addEvalTest", {data:jsonData}, function(data) { 
    var parsedData = $.parseJSON(data);
    var testId = parsedData.id;
    RenderUtil.render('component/'+SPECIALTY+'/'+evalType+'_eval_test', {id: testId, instanceName:instanceName}, function(s) { 
      $('#eval-tests').append(s); 
      $('.eval-test-delete-control').off().on('click', function() { pot_ehr_deleteEvalTestConfirm($(this)); });
      $('.eval-test-name').off('change').on('change', function() { pot_ehr_handleEvalTestNameChange($(this)); });
      $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
      $('.list-item-select').off().on('change', function(e) { form_updateListItem($(this)); });
      $('.new-subtest-btn').off('click').on('click', function() { pot_ehr_addEvalSubtest($(this)); });
    });
  }); 
}


function pot_ehr_deleteEvalLongTermGoal($this) {
  var id = $this.attr('data-id');
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id});
  $.post("patient/deleteLongTermGoal", {data:jsonData}, function(data) { 
    $('#eval-long-term-goal-'+id).remove();
  });  
}



function pot_ehr_deleteEvalShortTermGoal($this) {
  var id = $this.attr('data-id');
  var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id});
  $.post("patient/deleteShortTermGoal", {data:jsonData}, function(data) { 
    $('#eval-short-term-goal-'+id).remove();
  });  
}



function pot_ehr_deleteEvalSubtestConfirm($this) {
  $('#modal-confirm').remove();
  var id = $this.attr('data-id');
  var args = {
    modalTitle:"Delete Subtest?", 
    modalH3:"Delete Subtest?",
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
      $.post("patient/deleteEvalSubtest", {data:jsonData}, function(data) { 
        $('#eval-subtest-'+id).remove();
        $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
          $('#modal-confirm').remove();
        });
        app_displayNotification('Subtest Deleted.');
      }); 
    });
  });
}



function pot_ehr_deleteEvalTestConfirm($this) {
  $('#modal-confirm').remove();
  var id = $this.attr('data-id');
  var $subtests = $('#eval-subtests-'+id).find('.eval-subtest');
  var numSubtests = $subtests.length;
  var subtestName = (numSubtests == 1 ? 'Subtest' : ' Subtests');
  
  var args = {
    modalTitle:"Delete Test?", 
    modalH3:"Delete Test" + (numSubtests > 0 ? ' and ' + numSubtests + ' ' + subtestName : '') + "?",
    modalH4:(numSubtests > 0 ? 'If deleted, any subtests will be deleted as well.' : ''),
    cancelButton: 'Cancel',
    okButton: 'Confirm'
  };
  RenderUtil.render('dialog/confirm', args, function(s) { 
    $('#modals-placement').append(s);
    $('#modal-confirm').modal('show'); 
    $('#app-modal-confirmation-btn').on('click', function() {  
      
      var id = $this.attr('data-id');
      var jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:id});
      $.post("patient/deleteEvalTest", {data:jsonData}, function(data) { 
        $('#eval-test-'+id).remove();
        $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
          $('#modal-confirm').remove();
        });
        app_displayNotification('Test Deleted.');
      }); 
    });
  });
}



function pot_ehr_handleEvalTestNameChange(element) {
  $('#modal-confirm').remove();
  var $element = $(element);
  var testId = $element.attr('data-id');
  var $subtests = $('#eval-subtests-'+testId).find('.eval-subtest');
  var numSubtests = $subtests.length;
  
  if (numSubtests > 0) {
    var args = {
      modalTitle:"Change Test?", 
      modalH3:"Change Test and remove subtests?",
      modalH4:"If test is changed, any subtests from the former test will be deleted.",
      cancelButton: 'Cancel',
      okButton: 'Confirm'
    };
    
    RenderUtil.render('dialog/confirm', args, function(s) { 
      $('#modals-placement').append(s);
      $('#modal-confirm').modal('show'); 
      $('#app-modal-confirmation-btn').on('click', function() {  
        var jsonData = JSON.stringify({ sessionId: app_client.sessionId, testId:testId});
        $.post("patient/deleteEvalSubtests", {data:jsonData}, function(data) { 
          $subtests.remove();
          $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
            $('#modal-confirm').remove();
          });
        }); 
      });
      $('#app-modal-cancel-btn').off('click').on('click', function() {  
        jsonData = JSON.stringify({ sessionId: app_client.sessionId, id:testId});
        $.post("patient/getEvalTest", {data:jsonData}, function(data) { 
          var parsedData = $.parseJSON(data);
          $('#eval-test-name-'+testId).val(parsedData.object.name);
          $('#modal-confirm').modal('hide').on('hidden.bs.modal', function (e) {
            $('#modal-confirm').remove();
          });
        }); 
      });
    });
  }
  else {
    pot_ehr_evalTestNameChange(element);
  }
}



function pot_ehr_evalTestNameChange(element) {
  var value = element.val();
  var subtests = data_subtests[value];   
  var testId = element.attr('data-id');
  
  if (value != '' && subtests && subtests != '') { 
    $('#new-subtest-btn-'+testId).removeAttr('disabled'); 
  }
  else {
    $('#new-subtest-btn-'+testId).attr('disabled', 'disabled'); 
  }
  
  pot_ehr_updatePerformanceSelect(element); 
  form_updateListItem(element);
}



function pot_ehr_loadPerformanceSelect(elementId, testName, value) {
  if (!testName) { return;}
  var measures = data_performanceMeasures[testName];      
  if (!measures) { return;}
  var measuresArray = measures.split('|');
  RenderUtil.render('component/array_select_options', {options:measuresArray}, function(s) {
    $(elementId).html(s);
    $(elementId).val(value);
  });
}



function pot_ehr_loadSubtestSelect(id, testName, value) {
  if (!testName) { return;}
  var names = data_subtests[testName];      
  var namesArray = names.split('|');
  RenderUtil.render('component/array_select_options', {options:namesArray}, function(s) {
    $('#eval-subtest-name-'+id).html(s);
    $('#eval-subtest-name-'+id).val(value);
  });
}



function pot_ehr_renderEvalLongTermGoals(list, instanceName, evalType) {
  RenderUtil.render('component/long_term_goals', {list:list, instanceName:instanceName}, function(s) { 
    $('#eval-long-term-goals').html(s); 
    $('#new-long-term-goal-btn').click(function() { pot_ehr_addEvalLongTermGoal($(this), list, evalType); });
    $('.long-term-goal-delete-control').click(function() { pot_ehr_deleteEvalLongTermGoal($(this)); });
    $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
  });
}



function pot_ehr_renderEvalShortTermGoals(list, instanceName, evalType) {
  RenderUtil.render('component/short_term_goals', {list:list, instanceName:instanceName}, function(s) { 
    $('#eval-short-term-goals').html(s); 
    $('#new-short-term-goal-btn').click(function() { pot_ehr_addEvalShortTermGoal($(this), list, evalType); });
    $('.short-term-goal-delete-control').click(function() { pot_ehr_deleteEvalShortTermGoal($(this)); });
    $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
  });
}



function pot_ehr_renderEvalSubtests(testId, testName, list) {
  var test = null;
  for (i=0;i<list.length;i++) {
    if (list[i].id == testId) {
      test = list[i];
      break;
    }
  }
  RenderUtil.render('component/'+SPECIALTY+'/eval_subtests', {list: test.subtests, testName: testName, instanceName:'pot-entity-form-EvalSubtest'}, function(s) { 
    $('#eval-subtests-'+testId).html(s); 
    $('.eval-subtest-delete-control').off().on('click', function() { pot_ehr_deleteEvalSubtestConfirm($(this)); });
  });
}



function pot_ehr_renderEvalTests(list, instanceName, evalType) {
  $('#new-test-btn').off('click').on('click', function() { pot_ehr_addEvalTest($(this), evalType, instanceName); });
  RenderUtil.render('component/'+SPECIALTY+'/'+evalType+'_eval_tests', {list: list, instanceName:instanceName}, function(s) { 
    $('#eval-tests').html(s); 
    $('.eval-test-name').off('change').on('change', function() { pot_ehr_handleEvalTestNameChange($(this)); });
    $('.eval-test-delete-control').off('click').on('click', function() { pot_ehr_deleteEvalTestConfirm($(this)); });
    $('.list-item-field').off().on('blur', function(e) { form_updateListItem($(this)); });
    $('.list-item-select').off().on('change', function(e) { form_updateListItem($(this)); });
    $('.new-subtest-btn').off('click').on('click', function() { pot_ehr_addEvalSubtest($(this), evalType); });
  });
}



function pot_ehr_updatePerformanceSelect(element) {
  var $element = $(element);
  var value = $element.val();
  var id = $element.attr('data-id');
  var measures = data_performanceMeasures[value];      
  util_debug('test name performance measures: ' + measures);
  
  if ( measures && measures != '') { 
    var measuresArray = measures.split('|');
    RenderUtil.render('component/array_select_options', {options:measuresArray}, function(s) {
      $('#eval-performance-'+id).html(s);
      $('eval-performance-'+id).val('');
      form_updateListItem($('#eval-performance-'+id));
    });
  }
}



function pot_ehr_updateSubtestSelect(element) {
  var $element = $(element);
  var value = $element.val();
  var id = $element.attr('data-id');
  var names = data_subtests[value];      
  var namesArray = names.split('|');
  RenderUtil.render('component/array_select_options', {options:namesArray}, function(s) {
    $('#eval-performance-'+id).html(s);
  });
}

