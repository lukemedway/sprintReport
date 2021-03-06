
/* Type ahead function call upon dom ready */ 
$(function() {
    
    var path = window.location.pathname;
    var arrPath = path.split("/");
    var projectId = arrPath[1];


    
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
        url: "/" + projectId + "/jira/getkeys",
        success: function(response){
            
            var objResponse = response;
            var arrIssues = objResponse.issues;
            var arrKeys = [];

            if (typeof arrIssues != 'object') {
                console.log("WARNING: No issues were returned from JIRA - Typeahead disabled.");
                return false;
            } 

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
            
            $('#storyid').focus();
            
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
     
});
