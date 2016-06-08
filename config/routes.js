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
  
  
  // Hard coded routes, used primarily for the prototype
  '/sprints/project/:id': { controller: "SprintsController", action: "index" },
  '/sprints/edit/:id' : { controller: "SprintsController", action: "edit" },
  '/sprints/setup/:id' : { controller: "SprintsController", action: "setup" },
  '/reports/client/:id': { controller: "ReportsController", action: "client" }, 
  '/reports/report/:id': { controller: "ReportsController", action: "report" },
  '/jira/getstory/:id' : { controller: "JiraController", action: "getstory" },
  '/stories/:id' : { controller: "StoriesController", action: "index" },
  
  // CRUD ACTIONS VIA AJAX
  '/projects/delete/:id': { controller: "ProjectsController", action: "delete" },
  '/sprints/delete/:id': { controller: "SprintsController", action: "delete" }
  
  
  
  // DEBUG LINE
  // '/clients/client/:id': function(req, res) { res.send('Nice!'); }

};
