
function module_applyCSS() {
  if (app_currentModule == EHR_MODULE) {
    ehr_applyCSS();
  }
  else if (app_currentModule == PM_MODULE) {
    pm_applyCSS();
  }
  else if (app_currentModule == PORTAL_MODULE) {
    portal_applyCSS();
  }
}



function module_loadModule() {
  
  if (app_currentModule == SITE_MODULE) {
    module_initSITE();
    return;
  }
  
  RenderUtil.render('module/'+app_currentModule+'_module', {}, function(s) {
    $('#app-container').html(s);
    $('.version-string').html(app_clientProperties['app.version_string']);
    
    app_hideElementListCache = $('#app-bottom-nav,#app-dropdown-logout,#app-dropdown-settings,#app-header,#app-sub-navbar,'+
    '#appointments-screen,#dashboard-screen,#family-records-screen,#intake-records-screen,#lead-mgmt-screen,#letters-screen,'+
    '#main-navigation,#messages-inbox,#patient-files-screen,#messages-screen,#messages-view,#patient-chart-item-screen,'+
    '#patient-chart-header,#patient-chart-screen,#reports-list,#reports-screen,#reports-view,#schedule-screen,'+
    '#send-message-screen, #settings-screen,#signin-screen,#user-admin-screen,#your-records-screen');

    app_appointmentsCache = $('#appointments-screen,#top-nav-panel');
    app_dashboardCache = $('#dashboard-screen,#app-dropdown-settings,#app-dropdown-logout,#top-nav-panel');
    app_familyRecordsCache = $('#family-records-screen,#top-nav-panel');
    app_headerFooterCache = $('#main-navigation,#app-header,#app-bottom-nav');
    app_intakeRecordsCache = $('#intake-records-screen');
    app_leadMgmtCache = $('#lead-mgmt-screen,#top-nav-panel,#app-dropdown-settings');
    app_lettersCache = $('#letters-screen,#app-dropdown-settings,#app-dropdown-logout');
    app_messagesCache = $('#messages-screen,#app-dropdown-settings,#app-dropdown-logout,#messages-inbox,#top-nav-panel');
    app_patientFilesCache = $('#patient-files-screen,#top-nav-panel,#patient-chart-header');
    app_patientChartCache = $('#patient-chart-screen,#app-dropdown-settings,#app-dropdown-logout,#app-sub-navbar,#patient-chart-header');
    app_patientChartItemCache = $('#patient-chart-item-screen,#app-dropdown-settings,#app-sub-navbar,#patient-chart-header');
    app_reportsCache = $('#reports-screen,#reports-list,#app-dropdown-settings,#app-dropdown-logout,#main-navigation');
    app_scheduleCache = $('#schedule-screen,#app-dropdown-settings,#app-dropdown-logout');
    app_sendMessageCache = $('#send-message-screen,#top-nav-panel');
    app_settingsCache = $('#settings-screen,#top-nav-panel');
    app_signinCache = $('#signin-screen');
    app_userAdminCache = $('#user-admin-screen,#app-dropdown-settings,#app-dropdown-logout');
    app_yourRecordsCache = $('#your-records-screen,#top-nav-panel');
    
    if (app_currentModule == EHR_MODULE) {
      app_clientType = CLINICIAN_CLIENT_TYPE;
      module_initEHR();
    }
    else if (app_currentModule == PM_MODULE) {
      app_clientType = USER_CLIENT_TYPE;
      module_initPM();
    }
    else if (app_currentModule == PORTAL_MODULE) {
      app_clientType = PATIENT_CLIENT_TYPE;
      module_initPORTAL();
    }
    else if (app_currentModule == SITE_MODULE) {
      module_initSITE();
    }
    else if (app_currentModule == STORE_MODULE) {
      module_initSTORE();
    }
    app_getStaticLists();
  });
}



function module_selectModuleFromUrl() {
  var url = util_parseUrl(document.location);
  var pathnameArray = url.pathname.split("/");
  if (pathnameArray.length > 1) {
    app_currentModule = pathnameArray[2];
    module_loadModule();
  }
}

