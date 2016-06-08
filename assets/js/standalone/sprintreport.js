$().ready(function(){
    setTimeout(function() { 
        $('#componentLink').attr('aria-expanded', 'true');
        $('#componentLink').removeClass('collapsed');
        setTimeout(function() {
            $('#componentsExamples').attr('aria-expanded', 'true');
            $('#componentsExamples').removeClass('collapse');
            $('#componentsExamples').addClass('collapsing');
            $('#componentsExamples').removeClass('collapsing');
            $('#componentsExamples').addClass('collapse');
            $('#componentsExamples').addClass('in');
        }, 200 );
    }, 200);

    $('[data-toggle="tooltip"]').tooltip();


});
