
function app_showScreen(screenName, screen, hideHeaderFooter) {
  $('#app-screen-name').html(screenName);
  app_hideElementListCache.css({display: "none"});
  screen.css({display: "block"});
  if (!hideHeaderFooter) {
    app_headerFooterCache.css({display: "block"});
  }
}



function app_viewStack(screen, doScroll) {
  app_previousScreen = app_currentScreen;
   if (app_currentModule == EHR_MODULE) { $('body').removeClass('signin-ehr'); }
   else if (app_currentModule == PM_MODULE) { $('body').removeClass('signin-pm'); }
   else if (app_currentModule == PORTAL_MODULE) { $('body').removeClass('signin-portal'); }
  $('#top-nav-panel').css({display: "none"});
  $('#app-logout-submit').css({display: "inline-block"});
  switch (screen) {
    case 'appointments-screen':
      app_showScreen('', app_appointmentsCache);
    break;
    case 'dashboard-screen':
      app_showScreen('Dashboard', app_dashboardCache);
      if (app_currentModule == PM_MODULE) { pm_getUserDashboard(); }
    break;
    case 'front-sheet-screen':
      ehr_renderFrontSheet();
    break;
    case 'intake-docs-screen':
      app_renderPatientIntakeScreen();
    break;
    case 'intake-records-screen':
      app_showScreen('', app_intakeRecordsCache);
    break;
    case 'invoicing-screen':
      pm_renderInvoicingScreen();
      break;
    case 'lead-mgmt-screen':
      app_showScreen('Lead Mgmt', app_leadMgmtCache);
    break;
    case 'letters-screen':
      app_showScreen('Letters', app_lettersCache);
    break;
    case 'medical-consent-screen':
      ehr_renderMedicalConsent();
    break;
    case 'patient-files-screen':
      console.log('cache!!!1', app_patientFilesCache)
      app_showScreen('Patient Files', app_patientFilesCache);
    break;
    case 'medical-history-screen':
      ehr_renderMedicalHistory();
    break;
    case 'messages-screen':
      app_showScreen('Messages', app_messagesCache);
    break;
    case 'patient-chart-screen':
      app_showScreen('Patient Chart', app_patientChartCache);
    break;
    case 'physical-examination-screen':
      ehr_renderPhysicalExamination();
    break;
    case 'progress-note-screen':
      ehr_renderProgressNote();
    break;
    case 'reports-screen':
      app_showScreen('Reports', app_reportsCache);
    break;
    case 'schedule-screen':
      app_showScreen('Schedule', app_scheduleCache);
    break; 
    case 'send-message-screen':
      app_showScreen('', app_sendMessageCache);
    break;
    case 'settings-screen':
      app_showScreen('', app_settingsCache);
    break;
    case 'signin-screen':
      if (app_currentModule == EHR_MODULE) { $('body').addClass('signin-ehr'); }
      else if (app_currentModule == PM_MODULE) { $('body').addClass('signin-pm'); }
      else if (app_currentModule == PORTAL_MODULE) { $('body').addClass('signin-portal'); }
      app_showScreen('', app_signinCache, true);
      $('#app-logout-submit').css({display: "none"});
    break;
    case 'user-admin-screen':
      app_showScreen('', app_userAdminCache);
    break;
    case 'your-records-screen':
      app_showScreen('', app_yourRecordsCache);
    break; 
  }
  app_currentScreen = screen;
  if (doScroll) {scroll(0,0);}
}



function app_patientChartItemStack(screen, doScroll) {
  app_previousScreen = app_currentScreen;
  screen.css({display: "block"});
  app_currentScreen = screen;
  if (doScroll) {scroll(0,0);}
}



function app_intakeRecordsViewStack(screen, doScroll) {
  app_previousScreen = app_currentScreen;
  $('.forms-subscreen').css({display: "none"});
  screen.css({display: "block"});
  app_currentScreen = screen;
  if (doScroll) {scroll(0,0);}
}
