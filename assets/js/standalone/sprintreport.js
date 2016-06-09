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

                                    



$('#sprintdatefrom').datetimepicker({
    icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
    }, 
    format: 'DD/MM/YYYY'
});
$('#sprintdateto').datetimepicker({
    icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
    },
    useCurrent: false, //Important! See issue #1075
    format: 'DD/MM/YYYY'
});

$("#sprintdatefrom").on("dp.change", function (e) {
    $('#sprintdateto').data("DateTimePicker").minDate(e.date);
});

$("#sprintdateto").on("dp.change", function (e) {
    $('#sprintdatefrom').data("DateTimePicker").maxDate(e.date);
});

    

});
