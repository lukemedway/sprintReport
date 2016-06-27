        var $table = $('#sprintstories-bootstrap-table');
        
        
        // Open Sprint Menu as we're still in sprint areas
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
        
        // Open the Populate from JIRA option
        
        
        // JSON Data Formatting controls
        // Return the values from the JSON data objects
        function statusFormatter(value, row) {
            return row.fields.status.name;
        }

        function summaryFormatter(value, row) {
            return row.fields.summary;
        }

        function priorityFormatter(value, row) {
            return row.fields.priority.name;
        }
        // End JSON data formatting

        // Called from data-formatter attribute in th
        function operateFormatter(value, row, index) {
            return [
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
                    $table.bootstrapTable('remove', {
                        field: 'key',
                        values: [row.key]
                    });
                }
            };
            
            
            var path = window.location.pathname;
            var arrPath = path.split("/");
            var projectId = arrPath[1];
            var storyurl = '';
            

            $table.bootstrapTable({
                toolbar: ".toolbar",
                clickToSelect: false,
                showRefresh: true,
                search: true,
                showToggle: true,
                showColumns: true,
                pagination: true,
                searchAlign: 'right',
                pageSize: 10,
                pageList: [10,25,50,100],
                ordering: true,
                url: storyurl,
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

            $(window).resize(function() {
                $table.bootstrapTable('resetView');
            });
            

            // Handle the submission, to retrieve the stories based on the selected sprint.
            
            $('#sprint-commitment').on('submit', function(e){
                e.preventDefault();
                $(".main-panel").animate({
                    scrollTop: $("#sprintstories-bootstrap-table").offset().top
                }, 300);
                var bootstrapurl = '';
                bootstrapurl = '/jira/fetchjirastoriesbysprint/' + $('#jirasprint').val();
                $table.bootstrapTable('refresh', { url: bootstrapurl }).on('onPostBody', alert("hello"));
                // $table.bootstrapTable({
                //     onLoadSuccess: function(data) {
                //         alert(table.bootstrapTable('getOptions').totalRows);
                //         if($table.bootstrapTable('getOptions').totalRows > 0) { $('#deletestories').removeClass('hidden'); }
                //     }
                // });
            });
            
            
            $('#deletestories').on('click', function(e){
                var selections = $table.bootstrapTable('getSelections');
                var keys = $.map(selections, function(row) {
                    return row.key;
                });
                $table.bootstrapTable('remove', {
                    field: 'key',
                    values: keys
                });
                // Hide remove button if empty
                if($table.bootstrapTable('getOptions').totalRows == 0) { $('#deletestories').addClass('hidden'); }
            });

            // *********************************************************
            // TypeAhead Plug String Matcher - See below for implementation examples and docs:
            // https://twitter.github.io/typeahead.js/examples/
            // *********************************************************

            var substringMatcher = function(strs) {
                return function findMatches(q, cb) {
                    var matches, substringRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string that
                    // contains the substring `q`, add it to the `matches` array
                    $.each(strs, function(i, str) {
                        if (substrRegex.test(str)) {
                            matches.push(str);
                        }
                    });

                    cb(matches);
                };
            };
            
            // *********************************************************
            // Run Ajax call to run the getkeys controller which returns JSON directly from JIRA Rest API
            // And sets the rest of the field data based on the selected Story ID
            // http://{baseURL}/jira/getkeys : returns JSON.
            // *********************************************************
            
            $.ajax({
                type: "GET",
                url: '/' + projectId + '/jira/getkeys',
                success: function(response){
                    var objResponse = response;
                    var arrIssues = objResponse.issues;
                    var arrKeys = [];
                                    
                    for (i=0; i<arrIssues.length; i++)
                    {
                        arrKeys.push(arrIssues[i].key);
                    }
            
                    $('#storylist .typeahead').typeahead({
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        name: 'storyKeys',
                        source: substringMatcher(arrKeys)
                    });
                    
                    
                    $('#storyid').on('typeahead:selected', function() {
                        if ($('#storyid').val() !== '' && typeof $('#storyid').val() !== 'undefined') {
                            $('#storyid').addClass('loading');
                            getStory($('#storyid').val());
                        }
                    });
                    
                    $('#storyid').on('keyup', function() {
                        if ($('#storyid').val() == '') {
                            $('#commitment')[0].reset();
                        }
                    });
                },
                error: function(err) {
                    console.log(err);
                }
            });
            
            function getStory(storyid) {
                $.ajax({
                    url: '/jira/getstory/' + storyid,
                    method: "GET",
                    success: function(response) {
                        $('#storypriority').val(response.issues[0].fields.priority.name);
                        $('#storysummary').val(response.issues[0].fields.summary);
                        $('#storystatus').val(response.issues[0].fields.status.statusCategory.name);
                        $('#storyid').removeClass('loading');
                    }, 
                    error: function(err) {
                        // Handle Error
                        $('#storyid').removeClass('loading');
                    }
                });
            }




            // // Handle the data for POST and PUT requests to the server.
            // $('#sprint-commitment').on('submit', function(e) {
            //     e.preventDefault();
            //     var url, method, formData = $(this).serializeArray();
                
                

            //     // if($('#projectid').val() !== '' && $('#projectid').val() !== 'undefined') {
            //     //     url = '/sprints/create/';
            //     //     method = 'POST';
            //     // }
            
            //     // if ($('#sprintid').val() !== '' && $('#sprintid').val() !== 'undefined') {
            //     //     url = '/sprints/update/';
            //     //     method = "PUT";
            //     // }

                
                    
            //     $.ajax({
            //         url: url,
            //         method: method,
            //         data: formData,
            //         success: function(data) {
            //             $table.bootstrapTable('refresh');
            //             resetForm();    
            //         },
            //         error: function(err) {
            //             console.dir(err);
            //         }
            //     });
                                
            // });

        }); // End of DOM ready