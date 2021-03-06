/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { controller: "LoginController", action: "index" }, 

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  
  
  // ****************************************************
  // Hard coded routes, used primarily for the prototype
  // ****************************************************

  // DependenciesController Routes
  '/:id/dependencies' :                                                         { controller: "DependenciesController", action: "index" },
  '/:id/dependencies/create':                                                   { controller: "DependenciesController", action: "create" },
  '/:id/dependencies/update':                                                   { controller: "DependenciesController", action: "update" },
  '/:id/dependencies/getDependencies':                                          { controller: "DependenciesController", action: "getDependenciesByProjectRefJson" },
  '/:id/dependencies/getStoriesByProject':                                      { controller: "DependenciesController", action: "getStoriesByProject" },
  '/:id/sprints/report/:sprintid/getDependenciesBySprintJson/p/:p/s/:s':        { controller: "DependenciesController", action: "getDependenciesBySprintJson" },
  '/:id/sprints/report/:sprintid/getDependenciesBySprintJson/p/:p/s/:s/n/:n':   { controller: "DependenciesController", action: "getDependenciesBySprintJson" },
  '/:id/sprints/report/:sprintid/getDependenciesBySprintJson/p/:p':             { controller: "DependenciesController", action: "getDependenciesBySprintJson" },
  '/:id/sprints/report/:sprintid/getDependenciesBySprintJson/p/:p/n/:n':        { controller: "DependenciesController", action: "getDependenciesBySprintJson" },
  '/:id/sprints/report/:sprintid/getDependenciesBySprintJson':                  { controller: "DependenciesController", action: "getDependenciesBySprintJson" },


  // SprintsController Routes
  '/sprints/project/:id':                                                 { controller: "SprintsController", action: "index" },
  '/sprints/setupreport/:id' :                                            { controller: 'SprintsController', action: 'setupreport' },
  '/:id/sprints/edit/:sprintid' :                                         { controller: "SprintsController", action: "setupreport", edit: true },
  '/sprints/getSprintsByProjectJson/:id' :                                { controller: 'SprintsController', action: 'getSprintsByProjectJson' },
  '/:id/sprints/':                                                        { controller: "SprintsController", action: "index" },
  '/:id/sprints/getSprints/':                                             { controller: "SprintsController", action: "getSprints" },
  '/:id/sprints/report/:sprintid':                                        { controller: "SprintsController", action: "report" },
  '/:id/sprints/setupcomplete':                                           { controller: "SprintsController", action: "setupcomplete" },
  '/:id/sprints/getSprintsBySprintJson/:sprintid' :                       { controller: 'SprintsController', action: 'getSprintsBySprintJson' },
  '/:id/sprints/report/:sprintid/stories':                                { controller: "SprintsController", action: "setupsprintstories" },
  '/:id/fetchsprintsbyname':                                              { controller: "SprintsController", action: "getJiraSprintsByName" },
  '/:id/sprints/report/:sprintid/storycomplete':                          { controller: "SprintsController", action: "storycomplete" }, 
  '/:id/sprints/report/:sprintid/sprintstories':                          { controller: "SprintsController", action: "sprintstories"},
  '/:id/sprints/report/:sprintid/getstoriesbysprintid':                   { controller: "SprintsController", action: "getstoriesbysprintid" },
  '/:id/sprints/report/:sprintid/getdonestoriesbysprintid':               { controller: "SprintsController", action: "getdonestoriesbysprintid" },
  '/:id/sprints/report/:sprintid/completestories':                        { controller: "SprintsController", action: "completestories" },
  '/:id/sprints/report/:sprintid/storiesdonecomplete':                    { controller: "SprintsController", action: "storiesdonecomplete" },
  '/:id/sprints/report/:sprintid/getNextSprintStoriesJson':               { controller: "SprintsController", action: "getNextSprintStoriesJson" },
        
        
        
  // StoriesController Routes     
  '/:id/stories/getStoriesByProject':                                     { controller: "StoriesController", action: "getStoriesByProjectRefJson" },
              
  // JIRA Routes            
  '/jira/fetchjiraboards/':                                               { controller: "JiraController", action: "fetchjiraboards" },
  '/jira/fetchjirastoriesbysprint/:sprintid':                             { controller: "JiraController", action: "fetchjirastoriesbysprint" },
  '/jira/fetchdonejirastoriesbysprint/:sprintid':                         { controller: "JiraController", action: "fetchdonejirastoriesbysprint" },
  '/:id/jira/getstory/:id' :                                              { controller: "JiraController", action: "getstory" },
  '/:id/jira/getkeys':                                                    { controller: "JiraController", action: "getkeys" },
  '/:id/jira/test3':                                                      { controller: "JiraController", action: "test3" },
              
            
  // CRUD ACTIONS VIA AJAX            
  '/projects/delete/:id':                                                 { controller: "ProjectsController", action: "delete" },
  '/sprints/delete/:sprintid':                                            { controller: "SprintsController",  action: "delete" }
  
  
  // DEBUG LINE
  // '/clients/client/:id': function(req, res) { res.send('Nice!'); }

};
