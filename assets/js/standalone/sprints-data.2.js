        var $table = $('#sprintstories-bootstrap-table');
        
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
            var path = window.location.pathname;
            var arrPath = path.split("/");
            var projectId = arrPath[1];
            return [ "<a href='/" + projectId + "/sprints/report/" + row.id + "'>" + value + "</a>" ].join('');
        }
        
        function formatDate(value, row, index) {
            var date = new Date(value);
            var dateFormatted = ('0' + date.getDate()).slice(-2) + '/'+ ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
            return [ dateFormatted ].join('');
        }


        
        function resetForm() {
            $("#cancel").addClass('hidden');
            $("#submit").val('Add');
            $("#sprintid").val('');
            $('#sprintname').val('');
            $("#sprintpublicurl").val('http://' + window.location.host + '/');
        }

        $().ready(function(){

            $('#sprintform').validate();
            $("#sprintpublicurl").val('http://' + window.location.host + '/');
            
            $("#cancel").click(function() {
                resetForm();
            });
            
            window.operateEvents = {
                'click .edit': function (e, value, row, index) {
                    $(".main-panel").animate({
                        scrollTop: $(".container-fluid").offset().top
                    }, 300);
                    
                    $('#add-control').addClass('box');

                    $('#sprintname').val(row.sprintname);
                    $('#submit').val('Save');
                    $('#cancel').removeClass('hidden');
                    $('#sprintid').val(row.id);
                    $('#sprintpublicurl').val('');
                    
                    setTimeout(function() { $('#add-control').removeClass('box') }, 2000);
                },
                'click .remove': function (e, value, row, index) {
                    $.ajax({
                        url: '/sprints/delete/' + row.id,
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
            
            
            var path = window.location.pathname;
            var arrPath = path.split("/");
            var projectId = arrPath[1];
            

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
                url: '/' + projectId + '/sprints/getSprints/',
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

            $(window).resize(function () {
                $table.bootstrapTable('resetView');
            });
            
            // Handle the data for POST and PUT requests to the server.
            $('#sprintform').on('submit', function(e) {
                e.preventDefault();
                var url, method, formData = $(this).serializeArray();
                
                if($('#projectid').val() !== '' && $('#projectid').val() !== 'undefined') {
                    url = '/sprints/create/';
                    method = 'POST';
                }
            
                if ($('#sprintid').val() !== '' && $('#sprintid').val() !== 'undefined') {
                    url = '/sprints/update/';
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