
/* Type ahead function call upon dom ready */ 
$(function() {
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
            url: "/jira/getkeys",
            success: function(response){
                
                var objResponse = response;
                var objKeys = objResponse['issues'];
                var arrKeys = [];
                
                
                               
                for (i=0; i<objKeys.length; i++)
                {
                    arrKeys.push(objKeys[i].key);
                    var fields = objKeys[i].fields;
                    console.dir("summary: " + typeof objKeys[i]);
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
                    $('#storypriority').val('SET');
                });
                
                $('#storyid').on('keyup', function() {
                    if ($('#storyid').val() == '') {
                        $('#storypriority').val('');
                    }    
                });
                
                
            }
        });
});
