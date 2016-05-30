        var $table = $('#bootstrap-table');
        
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
            return [ "<a href='/reports/client/" + row.id + "'>" + value + "</a>" ].join('');
        }

        $().ready(function(){
            

            $("#cancel").click(function() {
                $("#cancel").addClass('hidden');
                $("#submit").val('Add');
                $("#id").val('');
            });
            
            window.operateEvents = {
                'click .edit': function (e, value, row, index) {
                    $(".main-panel").animate({
                        scrollTop: $(".container-fluid").offset().top
                    }, 300);
                    
                    $('#add-control').addClass('box');

                    $('#name').val(row.name);
                    $('#jiraprojectref').val(row.jiraprojectref);
                    $('#submit').val('Save');
                    $('#cancel').removeClass('hidden');
                    $('#id').val(row.id);

                    
                    setTimeout(function() { $('#add-control').removeClass('box') }, 2000);
                },
                'click .remove': function (e, value, row, index) {
                    $table.bootstrapTable('remove', {
                        field: 'id',
                        values: [row.id]
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
                url: '/clients/getclients',
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
            
            $('#clients').on('submit', function(e) {
                e.preventDefault();
                var url, method, formData = $(this).serializeArray();
                
                if($('#id').val() === '' || $('#id').val() == 'undefined') {
                    url = '/clients/create/';
                    method = 'POST';
                } else {
                    url = '/clients/update/';
                    method = "PUT";
                }
                
                $.ajax({
                    url: url,
                    method: method,
                    data: formData,
                    success: function(data) {
                        $table.bootstrapTable('refresh');                 
                    },
                    error: function(err) {
                        console.dir(err);
                    }
                });
                
                $(this)[0].reset();
                
            });


            //    $table2 = $('#client-table');
               
            //    $table2.bootstrapTable({
            //         toolbar: ".toolbar",
            //         clickToSelect: false,
            //         showRefresh: true,
            //         search: true,
            //         showToggle: true,
            //         showColumns: true,
            //         pagination: true,
            //         searchAlign: 'left',
            //         pageSize: 10,
            //         pageList: [10,25,50,100],
            //         ordering: true,
            //         url: '../../clients/',
            //         dataType: 'json',
            //         sidePagination: 'client',
            //         queryParams: false,
            //         ShowingRows: function(pageFrom, pageTo, totalRows){
            //             //do nothing here, we don't want to show the text "showing x of y from..."
            //         },
            //         formatRecordsPerPage: function(pageNumber){
            //             return pageNumber + " rows visible";
            //         },
            //         icons: {
            //             refresh: 'fa fa-refresh',
            //             toggle: 'fa fa-th-list',
            //             columns: 'fa fa-columns',
            //             detailOpen: 'fa fa-plus-circle',
            //             detailClose: 'fa fa-minus-circle'
            //         },
            //         columns: [
            //             {
            //                 field: 'id',
            //                 title: 'id',
            //                 sortable: true,
            //                 class: 'col-md-2'
            //             },
            //             {
            //                 field: 'name',
            //                 title: 'name',
            //                 sortable: false
            //             }
            //         ]     

            // });




        });