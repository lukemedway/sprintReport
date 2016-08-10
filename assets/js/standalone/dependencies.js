        var $table = $('#dependencies-bootstrap-table');
        var $storyTable = $('#dependencies-storyref-bootstrap-table');


        // Reurn a list of stories in JSON format [{ value: "string"}]
        // insert the data into the bloodhound engine
        $.ajax({
            url: './getStoriesByProject',
            method: 'GET',
            success: function(data) {
                // console.dir(data);
                var engine = new Bloodhound({
                    local: data,
                    datumTokenizer: function(d) {
                        return Bloodhound.tokenizers.whitespace(d.value);
                    },
                    queryTokenizer: Bloodhound.tokenizers.whitespace
                });

                engine.initialize();

                $('#tokenfield-typeahead').tokenfield({
                    typeahead: [null, { display: 'value', source: engine.ttAdapter() }]
                });

            },
            error: function(err) {
                console.dir(err);
            }
        })


        
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
            return [ "<a href='/sprints/report/" + row.id + "'>" + value + "</a>" ].join('');
        }
        
        function formatDate(value, row, index) {
            var date = new Date(value);
            var dateFormatted = ('0' + date.getDate()).slice(-2) + '/'+ ('0' + (date.getMonth()+1)).slice(-2) + '/' + date.getFullYear();
            return [ dateFormatted ].join('');
        }
        
        function formatStories(value, row) {
            var arrStories = value;   
            var strStories = '';
            
            if(typeof arrStories == 'object') {
                arrStories.forEach(function(story, i) {
                    strStories += '<a href="#" class="btn btn-danger btn-fill btn-xs" style="margin-top: 3px" data-toggle="tooltip" title="' + story.storydesc + '">' + story.storyjiraref + '</a>&nbsp;';
                });
            }
            return [ strStories ].join('');
        }


        function storyFormat(value, row, index) {
            var link = value;
            link = '<button class="btn btn-primary btn-fill btn-xs addstory" rel="tooltip" title="Add Story">' + value + '<i class="fa fa-plus"></i></button>';
            return [ link ].join('');
        }

        
        function resetForm() {
            $("#cancel").addClass('hidden');
            $("#submit").val('Add');
            $('#dependencypriority.selectpicker').selectpicker('val', '');
            $('#dependencystatus.selectpicker').selectpicker('val', '');
            $('#dependency-form').trigger("reset");
            $('#tokenfield-typeahead').tokenfield();
            $('#tokenfield-typeahead').tokenfield('setTokens', '');
            $('#dependencydesc').text('');
            $('#dependencyid').val('');
        }

        $().ready(function(){


            $('#dependency-form').validate({ 
                ignore: ":hidden:not(.selectpicker)",
                
                rules: {
                    dependencypriority: {
                        required: true
                    },
                    dependencystatus: {
                        required: true
                    }
                },
                messages: {
                    dependencypriority: {
                        required: 'This field is required.' 
                    },
                    dependencystatus: {
                        required: 'This field is required.'
                    }
                },
                
                errorPlacement: function(error, element) {
                    // Custom Error Styles added to selectpicker - this is disgusting.
                    if(element.attr('name') == 'dependencypriority') {
                        console.log($("[data-id='dependencypriority']"));
                        $("[data-id='dependencypriority']").attr('style', 'border: 1px solid red');
                    }
                    if(element.attr('name') == 'dependencystatus') {
                        console.log($("[data-id='dependencystatus']"));
                        $("[data-id='dependencystatus']").attr('style', 'border: 1px solid red');
                    }
                    error.insertAfter(element); // JQuery Default
                }
               
            });
            
            // If is valid on change then revert error style attribute
            $('#dependencypriority').on('change', function(e) {
                if($('#dependencypriority').valid() == true) {
                    $("[data-id='dependencypriority']").attr('style', '');
                }
            });
            
            $('#dependencystatus').on('change', function(e) {
                if($('#dependencystatus').valid() == true) {
                    $("[data-id='dependencystatus']").attr('style', '');
                }
            });
       
            
            $("#cancel").click(function() {
                resetForm();
            });
            
            window.operateEvents = {
                'click .edit': function (e, value, row, index) {
                    $(".main-panel").animate({
                        scrollTop: $(".container-fluid").offset().top
                    }, 300);
                    
                    $('#add-control').addClass('box');
                    
                    $('#dependencypriority.selectpicker').selectpicker('val', row.dependencypriority);
                    $('#dependencystatus.selectpicker').selectpicker('val', row.dependencystatus);
                    $('#dependencyassignee').val(row.dependencyassignee);
                    $('#dependencydesc').text(row.dependencydesc);
                    
                    
                    var arrStories = row.stories;
                    var arrStoryRef = [];
                    
                    // Must init tokenfield before calling any of it's methods
                    $('#tokenfield-typeahead').tokenfield();
                    $('#tokenfield-typeahead').tokenfield('setTokens', '');
                    
                    arrStories.forEach(function(story, i) { 
                       arrStoryRef.push(story.storyjiraref);
                       if(arrStories.length == i+1) {
                           $('#tokenfield-typeahead').tokenfield('setTokens', arrStoryRef);
                        }
                    });
                    
                    $('#dependencyid').val(row.id);
                    
                    
                    $('#submit').val('Save');
                    $('#cancel').removeClass('hidden');
                    
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
                url: '/' + projectId + '/dependencies/getDependencies',
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
                onLoadSuccess: function() {
                    //activate the tooltips after the data table is initialized
                    $('[rel="tooltip"]').tooltip();
                    $('[data-toggle="tooltip"]').tooltip();
                }

            });

            $storyTable.bootstrapTable({
                toolbar: ".toolbar",
                clickToSelect: false,
                showRefresh: false,
                search: true,
                showToggle: false,
                showColumns: false,
                pagination: false,
                searchAlign: 'left',
                pageSize: 5,
                pageList: [10,25,50,100],
                ordering: true,
                url: '/' + projectId + '/stories/getStoriesByProject',
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
                onLoadSuccess: function() {

                    //activate the tooltips after the data table is initialized
                    $('[rel="tooltip"]').tooltip();
                    $('[data-toggle="tooltip"]').tooltip();

                    $(".addstory").click(function(){
                        
                        // Holds the product ID of the clicked element
                        var text = $(this).html();
                        var cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
                        
                        $('#tokenfield-typeahead').tokenfield();
                        $('#tokenfield-typeahead').tokenfield('createToken', cleanText);
                    });
                }
            })



            //activate the tooltips after the data table is initialized
            $('[rel="tooltip"]').tooltip();
            $('[data-toggle="tooltip"]').tooltip();

            $(window).resize(function () {
                $table.bootstrapTable('resetView');
            });
            

            
            
            
            // Handle the data for POST and PUT requests to the server.
            $('#dependency-form').on('submit', function(e) {
                e.preventDefault();
                var url, method, formData = $(this).serializeArray();
                
            
                url = '/' + projectId + '/dependencies/create';
                method = 'POST';

                if($('#dependencypriority').valid() == true) {
                    $("[data-id='dependencypriority']").attr('style', '');
                }
                
                if($('#dependencystatus').valid() == true) {
                    $("[data-id='dependencystatus']").attr('style', '');
                }
            
                if ($('#dependencyid').val() !== '' && $('#dependencyid').val() !== 'undefined') {
                    url = '/' + projectId + '/dependencies/update';
                    method = "PUT";
                }


                if($('#dependency-form').valid() == true) {
                    

                    $.ajax({
                        url: url,
                        method: method,
                        data: formData,
                        success: function(data) {
                            $table.bootstrapTable('refresh', { url: '/' + projectId + '/dependencies/getDependencies' });
                            resetForm();    
                        },
                        error: function(err) {
                            console.dir(err);
                        }
                    });

                }
                                
            });

        });