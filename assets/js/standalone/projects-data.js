        var $table = $('#bootstrap-table');
        
        
        function fetchJiraBoards(selected) {    
            if($('#name').val().length > 0) {
                $('#name').addClass('loading');
                $.ajax({ 
                    url: '/jira/fetchjiraboards/',
                    method: 'GET',
                    data: 'name=' + $('#name').val(),
                    success: function(data) {
                        if(data.values.length > 0) {
                            $('#projectjiraboard').html('');
                            $('#projectjiraboard').append('<option value="">Please Select</option>');
                            $.each(data.values, function(key, value) {
                                if(selected == value.id) {
                                    $('#projectjiraboard').append('<option value=' + value.id + ' selected="selected">' + value.name + '</option>').selectpicker('refresh');
                                } else {
                                    $('#projectjiraboard').append('<option value=' + value.id + '>' + value.name + '</option>').selectpicker('refresh');
                                }
                            });
                        } else {
                            $('#projectjiraboard').html('');
                            $('#projectjiraboard').append('<option value="">' + 'No JIRA Board Found' + '</option>').selectpicker('refresh');
                        }
                        $('#name').removeClass('loading');
                    },
                    error: function(err) {
                        console.log('Could not fetch the request data');
                        $('#name').removeClass('loading');
                    }
                });
            }
        }
        
        // Called from data-formatter attribute in th
        function operateFormatter(value, row, index) {
            return [
                '<a rel="tooltip" title="Edit" class="btn btn-simple btn-warning btn-icon table-action edit" href="javascript:void(0)">',
                    '<i class="fa fa-edit"></i>',
                '</a>',
                '<a rel="tooltip" title="Remove" class="btn btn-simple btn-danger btn-icon table-action remove" href="javascript:void(0)">',
                    '<i class="fa fa-remove"></i>',
                '</a>'
            ].join('');
        }



        
        function formatLink(value, row, index) {
            return [ "<a href='/" + row.jiraprojectref + "/sprints/'>" + value + "</a>" ].join('');
        }
        
        function resetForm() {
            $('#cancel').addClass('hidden');
            $('#submit').val('Add');
            $('#name').val('');
            $('#jiraprojectref').val('');
            $('#id').val('');
            $('#projectjiraboard').html('<option value="">Please Select</option>').selectpicker('refresh');
        }

        $().ready(function(){
            
            $('#projects').validate();
            $("#cancel").click(function() {
                resetForm();
            });
            
            window.operateEvents = {
                'click .edit': function(e, value, row, index) {
                    $(".main-panel").animate({
                        scrollTop: $(".container-fluid").offset().top
                    }, 300);
                    
                    $('#add-control').addClass('box');

                    $('#name').val(row.name);
                    fetchJiraBoards(row.projectjiraboard);
                    $('#jiraprojectref').val(row.jiraprojectref);
                    $('#submit').val('Save');
                    $('#cancel').removeClass('hidden');
                    $('#id').val(row.jiraprojectref);

                    $('#projectjiraboarddesc').val(row.projectjiraboarddesc);
                    
                    setTimeout(function() { $('#add-control').removeClass('box') }, 2000);
                },
                'click .remove': function(e, value, row, index) {             
                    $.ajax({
                        url: '/projects/delete/' + row.jiraprojectref,
                        method: 'PUT',
                        success: function(data) {
                            $table.bootstrapTable('refresh');
                        },
                        error: function(err) {
                            console.dir(err);
                        }
                    });
                }
            };

            $table.bootstrapTable({
                toolbar: ".toolbar",
                clickToSelect: false,
                showRefresh: true,
                search: true,
                showToggle: true,
                showColumns: true,
                pagination: true,
                searchAlign: 'left',
                pageSize: 10,
                pageList: [10,25,50,100],
                ordering: true,
                url: '/projects/getProjects/',
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
                }

            });

            //activate the tooltips after the data table is initialized
            $('[rel="tooltip"]').tooltip();

            $(window).resize(function () {
                $table.bootstrapTable('resetView');
            });
            
            $('#name').on('focusout', function(e) {
                e.preventDefault();
                fetchJiraBoards();
            });

            $('#projectjiraboard').on('change', function(e) {
                e.preventDefault();
                $('#projectjiraboarddesc').val($('#projectjiraboard option:selected').text());
            });
            
            // Handle the data for POST and PUT requests to the server.
            $('#projects').on('submit', function(e) {
                e.preventDefault();
                var url, method, formData = $(this).serializeArray();
                
                if($('#id').val() === '' || $('#id').val() == 'undefined') {
                    url = '/projects/create/';
                    method = 'POST';
                } else {
                    url = '/projects/update/';
                    method = "PUT";
                }
                
                $.ajax({
                    url: url,
                    method: method,
                    data: formData,
                    success: function(data) {
                        $table.bootstrapTable('refresh');
                        resetForm();
                    },
                    error: function(err) {
                        console.dir(err);
                    }
                });
                                
            });

        });