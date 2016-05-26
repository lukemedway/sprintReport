
/* Type ahead function call */ 
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
        
        var xmlhttp = new XMLHttpRequest();
        var url = "/jira/getkeys";
        var arrKeys;
        
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
        
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                arrKeys = JSON.parse("[" + xmlhttp.responseText + "]");
                myFunction(arrKeys);
            }
        };
        
        function myFunction(arr) {
            var out = "";
            var i;
            for(i = 0; i < arr.length; i++) {
                out += '<a href="' + arr[i].key + '">' + 
                arr[i].display + '</a><br>';
            }
            document.getElementById("id01").innerHTML = out;
        }
        

        $('#the-basics .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'states',
            source: substringMatcher(arrKeys)
        });

});
