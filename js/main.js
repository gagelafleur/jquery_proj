
//api:  http://www.ist.rit.edu/api/
$(document).ready(function(){
	//get about....
	$.ajax({
		type:'get',
		url:'proxy.php',
		data:{path:"/about/"},
		dataType:'json'
	}).done(function(json){
		//console.log(json);
    $( '.type-text' ).teletype( {
			text: [ 'INFORMATION SCIENCES & TECHNOLOGIES @ RIT\n\n', json.title+'\n\n', json.description+'\n\n' , '"'+json.quote+'"\n', json.quoteAuthor+'\n\n' ],
			typeDelay: 0,
			loop: 1,
      preserve: true
		} );
	});

  $.ajax({
		type:'get',
		url:'proxy.php',
		data:{path:"/contactForm/"},
		dataType:'html'
	}).done(function(html){
		//console.log(json);
    $( '.contact' ).html(html);
	});

  $.ajax({
		type:'get',
		url:'proxy.php',
		data:{path:"/news/"},
		dataType:'json'
	}).done(function(json){
    console.log(json);
    news = '<h2 class="title-item">IST News</h2>';

    news+='<div class = "news-story"><h4>'+json.year[0].title+'</h4><p><em>'+json.year[0].date+'</em></p><p>'+json.year[0].description+'</p></div>';


    $.each(json.older, function(){

			//console.log($(this));
			news+='<div class = "news-story"><h4>'+this.title+'</h4><p><em>'+this.date+'</em></p><p>'+this.description+'</p></div>';
      $('.news').html(news);

		});


	});

  $.ajax({
		type:'get',
		url:'proxy.php',
		data:{path:"/degrees/"},
		dataType:'json'
	}).done(function(json){
    console.log(json);
    z = '<ul id="lightSlider">';
    degHeading = '<h2>Degrees</h2>';
    $.each(json.undergraduate, function(){
      conc = '';
      if(this.concentrations.length > 0){
        conc += '<ul>';
        $.each(this.concentrations, function(){
          conc += '<li>'+this+'</li>'
        });
        conc += '</ul>';
      }
			z+='<li data-code = "'+this.degreeName+'"><div class = "slide-content"><h3>'+this.title+'</h3><h4>Degree Type: Undergraduate</h4><p>'+this.description+'</p>'+conc+'</div></li>';
		});

    $.each(json.graduate, function(){
      conc = '';
      if(this.concentrations !== undefined && this.concentrations.length > 0){
        conc += '<ul>';
        $.each(this.concentrations, function(){
          conc += '<li>'+this+'</li>'
        });
        conc += '</ul>';
      }
			z+='<li data-code = "'+this.degreeName+'"><div class = "slide-content"><h3>'+this.title+'</h3><h4>Degree Type: Graduate</h4><p>'+this.description+'</p>'+conc+'</div></li>';
		});
    z += '</ul>';
    $('.degrees').html(degHeading+z);

    $("#lightSlider").lightSlider({controls:false});

	});

  $.ajax({
		type:'get',
		url:'proxy.php',
		data:{path:"/minors/"},
		dataType:'json'
	}).done(function(json){
    console.log(json);
    m = '<ul id="lightSliderMinor">';
    minorHeading = '<h2>Minors (Undergraduate Only)</h2>';
    $.each(json.UgMinors, function(){
      conc = '';
      if(this.courses.length > 0){
        conc += '<ul>';
        $.each(this.courses, function(){
          conc += '<li data-courcecode="'+this+'" class="course-code">'+this+'</li>'
        });
        conc += '</ul>';
      }
			m+='<li data-code = "'+this.name+'"><div class = "slide-content"><h3>'+this.title+'</h3><p>'+this.description+'</p>'+conc+'<p>'+this.note+'</p></div></li>';
		});


    m += '</ul>';
    $('.minors').html(minorHeading+m);

    $("#lightSliderMinor").lightSlider({controls:false});

    $('.course-code').click(function(event) {

      this.blur(); // Manually remove focus from clicked link.
      //console.log($(this).data('courcecode'));

      $.ajax({
    		type:'get',
    		url:'proxy.php',
    		data:{path:"/course/courseID="+$(this).data('courcecode')+"/"},
    		dataType:'json'
    	}).done(function(json){
    		//console.log(json);

        course = '<div class="modal"><h2>'+json.title+' '+json.courseID+'</h2><p>'+json.description+'</p></div>';

        $(course).appendTo('body').modal();

    	});

    });

	});

  $.ajax({
		type:'get',
		url:'proxy.php',
		data:{path:"/footer/"},
		dataType:'json'
	}).done(function(json){


    quicklinks = '<h2>Quick Links</h2>';

    for(i = 0; i < json.quickLinks.length; i++){


        quicklinks += '<a href = "quicklinks[i].href">'+json.quickLinks[i].title+'</a>';
        if(i+1 !== json.quickLinks.length){

            quicklinks += ' | ';

        }

    }

    quicklinks = '<div class = "quicklinks"><div class = "footer-center">'+quicklinks+'</div></div>';

    copyright = '<div class = "copyright"><h2>Copyright Info</h2>'+json.copyright.html+'</div>';

    social = '<div class = "social"><h2>Social</h2><ul><li class="social-icon icon--facebook"><a href="'+json.social.facebook+'" title="" target="_blank"><span>Facebook</span></a></li><li class="social-icon icon--twitter"><a href="'+json.social.twitter+'" title="" target="_blank"><span>Twitter</span></a></li></ul></div>'


    $('footer').html(quicklinks+copyright+social);

	});


  $('.faculty-member:in-viewport(100, .faculty)' ).find('body').hide();


	//get undergraduate
	/*$.ajax({
		type:'get',
		async:true,
		cache:false,
		url:'proxy.php',
		data:{path:'/degrees/undergraduate/'},
		dataType:'json'
	}).done(function(json){
		console.log(json.undergraduate[0].title);
		$.each(json.undergraduate, function(i, item){
			$('#content').append('<h2>'+ this.title+'</h2>');
			$('#content').append('<h4>'+ item.description+'</h4>');

		});
	});

	//get minors
	xhr('get', {path:'/minors'}, '#minors').done(function(json){



	});*/

	//get faculty
	xhr('get', {path:'/people/'}, '#people').done(function(json){

		var x = '';
    var y = '';
		$.each(json.faculty, function(){

			//console.log($(this));
			x+='<div class = "faculty-member" style ="background-image:url('+this.imagePath+');"><div class = "person-info">'+this.name+'<br />'+this.title+'<br />'+this.email+'<br />'+this.phone+'</div></div>';
      facHeading = '<h2>Faculty</h2>';
      $('.faculty').html(facHeading+x);





		});

    $.each(json.staff, function(){

			//console.log($(this));
			y+='<div class = "faculty-member" style ="background-image:url('+this.imagePath+');"><div class = "person-info">'+this.name+'<br />'+this.title+'<br />'+this.email+'<br />'+this.phone+'</div></div>';
      facHeading = '<h2>Staff</h2>';
      $('.staff').html(facHeading+y);





		});

    window.sr = ScrollReveal({ duration: 3000 });
    sr.reveal('.faculty-member', 100);


	});

  //$(".tagline").letterfx({"fx":"swirl"});
  $( document ).on( "click", ".faculty-member", function() {
    if(!$(this).find(".person-info").is(":visible")){

      $(this).find(".person-info").fadeIn();

    }else{

      $(this).find(".person-info").fadeOut();

    }
  });



});


////////////////////////////////////////////////////////////////////
///ajax util
///		arguments:
///		getPost - get or post
///		d - {path:'/about/'}
///		idForSpinner - #parent (optional)
///			the id of the container I want the spinner to go into
///
///			use: xhr('get',{path:'/about/'}, '#id').done(function(){//code});

function xhr(getPost,d,idForSpinner){
	return $.ajax({
		type:getPost,
		dataType:'json',
		data:d,
		cache:false,
		async:true,
		url:'proxy.php',
		beforeSend:function(){
			$(idForSpinner).append('<img src="gears.gif" class="spin"/>');
		}
	}).always(function(){
		//remove spinner?
		$(idForSpinner).find('.spin').fadeOut(500,function(){
			$(this).remove();
		});
	}).fail(function(err){
		console.log(err);
	});
}
