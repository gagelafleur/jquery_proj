//api:  http://www.ist.rit.edu/api/
$(document).ready(function() {
  //get about and display it with the teletype plugin
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/about/"
    },
    dataType: 'json'
  }).done(function(json) {

    $('.type-text').teletype({
      text: ['INFORMATION SCIENCES & TECHNOLOGIES @ RIT\n\n', json.title + '\n\n', json.description + '\n\n', '"' + json.quote + '"\n', json.quoteAuthor + '\n\n'],
      typeDelay: 0,
      loop: 1,
      preserve: true
    });
  });

  //get research by area information and display in an accordion
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/research/"
    },
    dataType: 'json'
  }).done(function(json) {

    accordionHTML = '<h2>Faculty Research</h2><div id="accordion">';

    areas = json.byInterestArea;

    for (i = 0; i < areas.length; i++) {

      accordionHTML += '<h3>' + areas[i].areaName + '</h3><div><ul>';

      for (j = 0; j < areas[i].citations.length; j++) {

        accordionHTML += '<li>' + areas[i].citations[j] + '</li>';

      }
      accordionHTML += '</ul></div>';

    }

    $('.research').html(accordionHTML);

    $("#accordion").accordion({

      active: false,
      collapsible: true,
      heightStyle: 'content'

    });


  });

  //get faculty and display/set up scrollreveal animation
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/people/"
    },
    dataType: 'json'
  }).done(function(json) {
    var x = '';
    var y = '';
    $.each(json.faculty, function() {

      x += '<div class = "faculty-member" style ="background-image:url(' + this.imagePath + ');"><div class = "person-info">' + this.name + '<br />' + this.title + '<br />' + this.email + '<br />' + this.phone + '</div></div>';
      facHeading = '<h2>Faculty</h2>';
      $('.faculty').html(facHeading + x);

    });

    $.each(json.staff, function() {

      y += '<div class = "faculty-member" style ="background-image:url(' + this.imagePath + ');"><div class = "person-info">' + this.name + '<br />' + this.title + '<br />' + this.email + '<br />' + this.phone + '</div></div>';
      facHeading = '<h2>Staff</h2>';
      $('.staff').html(facHeading + y);

    });

    window.sr = ScrollReveal({
      duration: 3000
    });
    sr.reveal('.faculty-member', 100);
  });


  //get degrees and display in the lightSlider
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/degrees/"
    },
    dataType: 'json'
  }).done(function(json) {
    z = '<ul id="lightSlider">';
    degHeading = '<h2>Degrees</h2>';
    $.each(json.undergraduate, function() {
      conc = '';
      if (this.concentrations.length > 0) {
        conc += '<ul>';
        $.each(this.concentrations, function() {
          conc += '<li>' + this + '</li>'
        });
        conc += '</ul>';
      }
      z += '<li data-code = "' + this.degreeName + '"><div class = "slide-content"><h3>' + this.title + '</h3><h4>Degree Type: Undergraduate</h4><p>' + this.description + '</p>' + conc + '</div></li>';
    });

    $.each(json.graduate, function() {
      conc = '';
      if (this.concentrations !== undefined && this.concentrations.length > 0) {
        conc += '<ul>';
        $.each(this.concentrations, function() {
          conc += '<li>' + this + '</li>'
        });
        conc += '</ul>';
      }
      z += '<li data-code = "' + this.degreeName + '"><div class = "slide-content"><h3>' + this.title + '</h3><h4>Degree Type: Graduate</h4><p>' + this.description + '</p>' + conc + '</div></li>';
    });
    z += '</ul>';
    $('.degrees').html(degHeading + z);

    $("#lightSlider").lightSlider({
      controls: false
    });

  });

  //get minors and display them in a lightSlider, make course codes open modal with description
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/minors/"
    },
    dataType: 'json'
  }).done(function(json) {
    //console.log(json);
    m = '<ul id="lightSliderMinor">';
    minorHeading = '<h2>Minors (Undergraduate Only)</h2>';
    $.each(json.UgMinors, function() {
      conc = '';
      if (this.courses.length > 0) {
        conc += '<ul>';
        $.each(this.courses, function() {
          conc += '<li data-courcecode="' + this + '" class="course-code">' + this + '</li>'
        });
        conc += '</ul>';
      }
      m += '<li data-code = "' + this.name + '"><div class = "slide-content"><h3>' + this.title + '</h3><p>' + this.description + '</p>' + conc + '<p>' + this.note + '</p></div></li>';
    });


    m += '</ul>';
    $('.minors').html(minorHeading + m);

    $("#lightSliderMinor").lightSlider({
      controls: false
    });

    $('.course-code').click(function(event) {

      this.blur();

      $.ajax({
        type: 'get',
        url: 'proxy.php',
        data: {
          path: "/course/courseID=" + $(this).data('courcecode') + "/"
        },
        dataType: 'json'
      }).done(function(json) {

        course = '<div class="modal"><h2>' + json.title + ' ' + json.courseID + '</h2><p>' + json.description + '</p></div>';
        $(course).appendTo('body').modal();

      });

    });

  });

  //get emplyment content and displaying into information and 4 colored blocks for stats
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/employment/"
    },
    dataType: 'json'
  }).done(function(json) {

    eHTML = '<h2>Employment</h2>';

    eHTML += '<h3>' + json.introduction.title + '</h3>';

    $.each(json.introduction.content, function() {

      eHTML += '<div class = "stats-content"><p><strong>' + $(this)[0].title + '</strong></p><p>' + $(this)[0].description + '</p></div>';

    });

    eHTML += '<h3>' + json.degreeStatistics.title + '</h3>';

    colors = ["#a33994", "#e13569", "#f44d4d", "#e16936"];
    count = 0;
    $.each(json.degreeStatistics.statistics, function() {

      eHTML += '<div class = "stats-block" style="background-color:' + colors[count] + ';"><h2><strong>' + $(this)[0].value + '</strong></h2><p>' + $(this)[0].description + '</p></div>';
      count++;

    });

    $('.statistics').html(eHTML);

  });

  //display all news stories in scrollable div
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/news/"
    },
    dataType: 'json'
  }).done(function(json) {
    news = '<h2 class="title-item">IST News</h2>';

    news += '<div class = "news-story"><h4>' + json.year[0].title + '</h4><p><em>' + json.year[0].date + '</em></p><p>' + json.year[0].description + '</p></div>';

    $.each(json.older, function() {

      news += '<div class = "news-story"><h4>' + this.title + '</h4><p><em>' + this.date + '</em></p><p>' + this.description + '</p></div>';
      $('.news').html(news);

    });


  });

  //get contact form and display it
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/contactForm/"
    },
    dataType: 'html'
  }).done(function(html) {
    $('.contact').html(html);
  });

  //get footer and display it in three corresponding footer blocks
  $.ajax({
    type: 'get',
    url: 'proxy.php',
    data: {
      path: "/footer/"
    },
    dataType: 'json'
  }).done(function(json) {


    quicklinks = '<h2>Quick Links</h2>';

    for (i = 0; i < json.quickLinks.length; i++) {


      quicklinks += '<a href = "quicklinks[i].href">' + json.quickLinks[i].title + '</a>';
      if (i + 1 !== json.quickLinks.length) {

        quicklinks += ' | ';

      }

    }

    quicklinks = '<div class = "quicklinks"><div class = "footer-center">' + quicklinks + '</div></div>';

    copyright = '<div class = "copyright"><h2>Copyright Info</h2>' + json.copyright.html + '</div>';

    social = '<div class = "social"><h2>Social</h2><ul><li class="social-icon icon--facebook"><a href="' + json.social.facebook + '" title="" target="_blank"><span>Facebook</span></a></li><li class="social-icon icon--twitter"><a href="' + json.social.twitter + '" title="" target="_blank"><span>Twitter</span></a></li></ul></div>'

    $('footer').html(quicklinks + copyright + social);

  });



  //listener for click event to reveal fac/staff contact info
  $(document).on("click", ".faculty-member", function() {
    if (!$(this).find(".person-info").is(":visible")) {

      $(this).find(".person-info").fadeIn();

    } else {

      $(this).find(".person-info").fadeOut();

    }
  });

});
