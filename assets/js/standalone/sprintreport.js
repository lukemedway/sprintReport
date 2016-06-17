
$().ready(function(){
    
    var $table = $('#dependencies-shortlist-bootstrap-table');
    
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


    var path = window.location.pathname;
    var arrPath = path.split("/");
    var sprintId = arrPath[arrPath.length - 1];

    $table.bootstrapTable({
        toolbar: ".toolbar",
        clickToSelect: false,
        showRefresh: false,
        search: false,
        showToggle: false,
        showColumns: false,
        pagination: false,
        searchAlign: 'left',
        pageSize: 10,
        pageList: [10,25,50,100],
        ordering: true,
        url: '/dependencies/getDependenciesBySprintJson/' + sprintId,
        dataType: 'json',
        sidePagination: 'client',
        queryParams: false,
        ShowingRows: function(pageFrom, pageTo, totalRows){
            //do nothing here, we don't want to show the text "showing x of y from..."
        },
        formatRecordsPerPage: function(pageNumber){
            return pageNumber + " rows visible";
        },
        icons: {
            refresh: 'fa fa-refresh',
            toggle: 'fa fa-th-list',
            columns: 'fa fa-columns',
            detailOpen: 'fa fa-plus-circle',
            detailClose: 'fa fa-minus-circle'
        },
    });

    //activate the tooltips after the data table is initialized
    $('[rel="tooltip"]').tooltip();
    $('[data-toggle="tooltip"]').tooltip();

    $(window).resize(function () {
        $table.bootstrapTable('resetView');
    });

                                    
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

    $("#sprintdatefrom").on("dp.change", function (e) {
        $('#sprintdateto').data("DateTimePicker").minDate(e.date);
    });

    $("#sprintdateto").on("dp.change", function (e) {
        $('#sprintdateto').data("DateTimePicker").maxDate(e.date);
    });


});
