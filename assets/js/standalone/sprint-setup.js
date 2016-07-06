
$().ready(function(){
       
    setTimeout(function() { 
        $('#componentLink').attr('aria-expanded', 'true');
        $('#componentLink').removeClass('collapsed');
        setTimeout(function() {
            $('#menu-sprints').attr('aria-expanded', 'true');
            $('#menu-sprints').removeClass('collapse');
            $('#menu-sprints').addClass('collapsing');
            $('#menu-sprints').removeClass('collapsing');
            $('#menu-sprints').addClass('collapse');
            $('#menu-sprints').addClass('in');
        }, 200 );
    }, 200);


    //activate the tooltips 
    $('[rel="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip();

                                    
    $('#sprint-form').validate({
        rules: {
            sprintdatefrom: {
                required: true
            }, 
            sprintdateto: {
                required: true
            }, 
            sprintvelocity: {
                required: true,
                number: true,
                min: 0
            }, 
            sprintvelocitytarget: {
                required: true,
                number: true,
                min: 0
            },
            sprintaveragevelocity: {
                number: true,
                min: 0
            },
            sprintcompletion: {
                required: true,
                number: true,
                min: 0
            }
        }
    });


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

    $("#sprintdatefrom").on("dp.change", function(e) {
        $('#sprintdateto').data("DateTimePicker").minDate(e.date);
    });

    $("#sprintdateto").on("dp.change", function(e) {
        $('#sprintdateto').data("DateTimePicker").maxDate(e.date);
    });


});
