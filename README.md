# sprintReport

## Description
An application (built with [Sails](http://www.sailsjs.org)) to faciliate the production of sprint reports, leveraging the JIRA API to avoid data duplication and provide ease of set up / time savings.

## Technical Dependencies

- Node
- Sailsjs
- MongoDB
- JIRA Installation

## General Setup Notes

Application requires JIRA connectivity and along with that a jira.js file should be created in the /config/ root directory with the following properties defined according to the user:

- apiUser: "foo",
- apiPass: "bar",
- apiHost: "hostname",
- apiPort: 443

