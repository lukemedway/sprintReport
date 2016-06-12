


module.exports = {
    
    // *******************************************************************
    
    // HELPER METHODS
    
    // *******************************************************************     
    
    formatUKDate: function(isoDate, next) {
        var dateFormatted = ('0' + isoDate.getDate()).slice(-2) + '/'+ ('0' + (isoDate.getMonth()+1)).slice(-2) + '/' + isoDate.getFullYear();
        return next(dateFormatted);
    }
    
}