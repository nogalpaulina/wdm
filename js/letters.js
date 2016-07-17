

function ehr_getLetters() {
  RenderUtil.render('screen/letters_screen', {}, function(s) {
    $("#letters-screen").html(s);
  });  
}



function pm_getLetters() {
  RenderUtil.render('screen/letters_screen', {}, function(s) {
    $("#letters-screen").html(s);
  });  
}



function ehr_viewLetters() {
  app_viewStack('letters-screen', DO_SCROLL);
  ehr_getLetters();
}



function pm_viewLetters() {
  app_viewStack('letters-screen', DO_SCROLL);
  pm_getLetters();
}