/*jslint node: true, white: false, continue: true, passfail: false, nomen: true, plusplus: true, maxerr: 50, indent: 4 */

var exports, util, async, collections, actorUniqueProps;
util = require('./util.js');
async = require('async');
collections = {};

actorUniqueProps = ['mbox', 'account', 'holdsAccount', 'openid', 'weblog', 'homepage', 'yahooChatID', 'aimChatID', 'skypeID', 'mbox_sha1sum'];

exports.collections = collections;

// merges source into target, returns true if target is updated.
// exception if source and target contain contradictary information
function mergeActivities(source, target) {
	"use strict";
	var modified, property;
	modified = false;

	for (property in source) {
		if (source.hasOwnProperty(property) && property !== '_id') {
			if (target[property] === undefined) {
				target[property] = source[property];
				modified = true;
			} else if (target[property] !== source[property] && JSON.stringify(target[property]) !== JSON.stringify(source[property])) {
				throw new Error('Activity : "' + source.id + '", conflicting values of: ' + property);
			}
		}
	}

	return modified;
}

// find matching actors in db
// returns error, array of matching actors
function findActorMatches(actors, callback) {
	"use strict";
	async.map(actorUniqueProps, function (property, callback) {
		var ii, ids, query;
		ids = [];
		for (ii = 0; ii < actors.length; ii++) {
			if (actors[ii][property] !== undefined && !util.inList(actors[ii][property], ids)) {
				ids.push(actors[ii][property]);
			}
		}

		if (ids.length > 0) {
			query = {};
			query[property] = { $in : ids };
			collections.actors.find(query).toArray(callback);
		} else {
			callback(null, []);
		}
	}, function (error, results) {
		var uniqueResults, ii, jj, kk, found, actor;
		uniqueResults = [];

		if (error !== null && error !== undefined) {
			callback(error);
		}

		// coalesce results
		for (ii = 0; ii < results.length; ii++) {
			for (jj = 0; jj < results[ii].length; jj++) {
				actor = results[ii][jj];
				if (actor !== undefined) {
					found = false;
					for (kk = 0; kk < uniqueResults.length; kk++) {
						if (String(actor._id) === String(uniqueResults[kk]._id)) {
							found = true;
							break;
						}
					}
					if (!found) {
						uniqueResults.push(actor);
					}
				}
			}
		}

		callback(null, uniqueResults);
	});
}

// store activity
function storeActivities(activities, callback) {
	"use strict";
	var ii, uniqueActivities, flatActivities, uniqueActivityIDs, activity, updates, children;

	uniqueActivities = {};
	uniqueActivityIDs = [];
	flatActivities = []; // flattened list of activities + children

	while (activities.length > 0) {
		activity = activities.pop();
		if (activity !== undefined) {
			flatActivities.push(activity);
			if (activity.definition !== undefined && activity.definition.children !== undefined) {
				children = activity.definition.children;
				for (ii = 0; ii < children.length; ii++) {
					activities.push(children[ii]); // store children as well as top level activities
				}
			}
			// it's possible to have multiple references to the same activity in a set of statements, get unique list
			if (uniqueActivities[activity.id] === undefined) {
				uniqueActivities[activity.id] = activity;
				uniqueActivityIDs.push(activity.id);
			} else {
				mergeActivities(activity, uniqueActivities[activity.id]);
			}
		}
	}

	collections.activities.find({ id : { $in : uniqueActivityIDs } }).toArray(function (error, dbActivities) {
		var dbActivityMap, id;

		updates = [];

		if (error !== null) {
			console.error(error);
			callback(error);
		} else {
			dbActivityMap = {};
			for (ii = 0; ii < dbActivities.length; ii++) {
				dbActivityMap[dbActivities[ii].id] = dbActivities[ii];
			}

			for (ii = 0; ii < uniqueActivityIDs.length; ii++) {
				id = uniqueActivityIDs[ii];
				if (dbActivityMap[id] === undefined) {
					updates.push(uniqueActivities[id]);
				} else if (mergeActivities(uniqueActivities[id], dbActivityMap[id])) {
					updates.push(dbActivityMap[id]);
				}
			}

			if (updates.length > 0) {
				async.map(updates, function (update, callback) {
					console.log('saving activity: ' + JSON.stringify(update, null, 4));
					collections.activities.save(update, { safe : true, upsert : true},  callback);
				}, callback);
			} else {
				callback();
			}
		}
	});
}

function mergeActors(source, target) {
	"use strict";
	var prop;

	// if equivilant, copy new information about this actor to the existing instance
	if (util.areActorsEqual(source, target)) {
		for (prop in source) {
			if (source.hasOwnProperty(prop) && prop !== '_id') {
				if (target[prop] === undefined) {
					target[prop] = source[prop];
				} else if (target[prop] !== source[prop] && JSON.stringify(target[prop]) !== JSON.stringify(source[prop])) {
					console.error('Actor redifines "' + prop + '" : ' + JSON.stringify(source, null, 4));
				}
			}
		}
		return true;
	} else {
		return false;
	}
}

function storeUniqueActors(actors, callback) {
	"use strict";

	if (actors.length === 0) {
		// nothting to do, report success
		callback();
	}

	// identify any matching actors in DB, merge & update, for each inverse functional property
	findActorMatches(actors, function (err, results) {
		// results is a list of all matching actors, iterate through and merge matches 
		var ii, jj, duplicates, updates;

		duplicates = [];
		updates = [];

		if (err !== undefined && err !== null) {
			callback(err);
		} else {
			for (ii = 0; ii < actors.length; ii++) {
				for (jj = 0; jj < results.length; jj++) {
					if (mergeActors(actors[ii], results[jj])) {
						updates.push(results[jj]);
						duplicates.push(ii);
					}
				}
			}

			// in addition to merged actors, save all actors with no match
			for (ii = 0; ii < actors.length; ii++) {
				if (!util.inList(ii, duplicates)) {
					updates.push(actors[ii]);
					console.log('storing new actor: ' + JSON.stringify(actors[ii]));
				}
			}
			async.map(updates, function (update, callback) {
				collections.actors.save(update, { safe : true, upsert : true }, callback);
			}, callback);
		}
	});
}

// store actors (authority, "object")
function storeActors(actors, callback) {
	"use strict";
	var ii, jj, hasUniqueProp, uniqueActors, isUnique;

	uniqueActors = [];
	for (ii = 0; ii < actors.length; ii++) {
		if (actors[ii] !== undefined) {
			hasUniqueProp = false;
			isUnique = true;

			for (jj = 0; jj < actorUniqueProps.length; jj++) {
				if (actors[ii][actorUniqueProps[jj]] !== undefined) {
					hasUniqueProp = true;
					break;
				}
			}
			if (!hasUniqueProp) {
				callback(new Error('Actor has no members which have the inverse functional property (actor is not uniquely identified): ' + JSON.stringify(actors[ii])));
				return;
			}

			for (jj = 0; jj < uniqueActors.length; jj++) {
				if (mergeActors(actors[ii], uniqueActors[jj])) {
					isUnique = false;
					break;
				}
			}

			if (isUnique) {
				uniqueActors.push(actors[ii]);
			}
		}
	}

	storeUniqueActors(uniqueActors, callback);
}

function areActivitiesEqual(activity1, activity2) {
	"use strict";
	return activity1.id === activity2.id;
}

// are the objects (objects of a statement) equal
function areStatementObjectsEqual(obj1, obj2) {
	"use strict";
	if (obj1.id !== undefined) {
		return areActivitiesEqual(obj1, obj2);
	} else {
		return util.areActorsEqual(obj1, obj2);
	}
}

function areStatementsEqual(statement1, statement2) {
	"use strict";
	var prop;

	if (statement1._id !== statement2._id) {return false; }

	for (prop in statement1) {
		if (statement1.hasOwnProperty(prop)) {
			if (statement1[prop] !== statement2[prop]) {
				if (prop === 'actor' && util.areActorsEqual(statement1.actor, statement2.actor)) {continue; }
				if (prop === 'object' && areStatementObjectsEqual(statement1.object, statement2.object)) {continue; }
				if (prop === 'stored') {continue; }

				if (statement2[prop] === undefined || JSON.stringify(statement1[prop]) !== JSON.stringify(statement2[prop])) {
					console.error('Statement mismatch on "' + prop + '", statement : ' + JSON.stringify(statement1));
					return false;
				}
			}
		}
	}

	return true;
}

/*
stores unique statements that have already been processed (activities, actors, sub-statements to store have been identified)
*/
function storeProcessedStatements(statements, callback) {
	"use strict";
	var IDs, dbStatementMap, ii, newStatements, statement;

	IDs = [];

	// find statements that already exist in the DB
	for (ii = 0; ii < statements.length; ii++) {
		if (!IDs.hasOwnProperty(statements[ii]._id)) {
			IDs.push(statements[ii]._id);
		}
	}

	collections.statements.find({ _id : { $in : IDs } }).toArray(function (error, dbStatements) {
		if (error !== null && error !== undefined) {
			callback(error);
		} else {
			dbStatementMap = {};
			newStatements = [];

			while (dbStatements.length > 0) {
				statement = dbStatements.pop();
				dbStatementMap[statement._id] = statement;
			}
			// only store new statements (that have not already been stored)
			while (statements.length > 0) {
				statement = statements.pop();
				if (dbStatementMap[statement._id] === undefined) {
					newStatements.push(statement);
				} else if (!areStatementsEqual(statement, dbStatementMap[statement._id])) {
					error = new Error('Attempt to redefine statement: ' + statement._id);
					error.HTTPStatus = 400;
					callback(error);
					return;
				}
			}

			if (newStatements.length > 0) {
				collections.statements.insert(newStatements, { safe : true}, callback);
			} else {
				callback();
			}
		}
	});
}

// when returning statements, the specified level of detail should be used, if sparse activities & actors should only be included by ID,
// if not sparse complete first level of activity & actor should be included
function normalizeStatements(statements, sparse, callback) {
	"use strict";
	var ii, id, activityIds, activities, actors, prop;

	activityIds = [];
	activities = [];
	actors = [];

	// db uses _id for primary key, spec expects id
	for (ii = 0; ii < statements.length; ii++) {
		statements[ii].id = statements[ii]._id;
		delete statements[ii]._id;

		util.addStatementActivities(statements[ii], activities);
		util.addStatementActors(statements[ii], actors);
	}

	// remove data other than IDs from actors & activities if sparse
	if (sparse) {
		for (ii = 0; ii < actors.length; ii++) {
			for (prop in actors[ii]) {
				if (actors[ii].hasOwnProperty(prop)) {
					if (!util.inList(prop, actorUniqueProps)) {
						delete actors[ii][prop];
					}
				}
			}
		}
		for (ii = 0; ii < activities.length; ii++) {
			for (prop in activities[ii]) {
				if (activities[ii].hasOwnProperty(prop) && prop !== 'id') {
					delete activities[ii][prop];
				}
			}
		}
		callback(null);
	} else {
		// not sparse, add statement & activity detail
		for (ii = 0; ii < activities.length; ii++) {
			id = activities[ii].id;
			if (!util.inList(id, activityIds)) {
				activityIds.push(id);
			}
		}

		// activity detail
		exports.collections.activities.find({ id : { $in : activityIds } }).toArray(function (error, dbActivities) {
			var ii, jj;

			if (error !== null && error !== undefined) {
				callback(error);
				return;
			}

			for (ii = 0; ii < dbActivities.length; ii++) {
				for (jj = 0; jj < activities.length; jj++) {
					if (dbActivities[ii].id === activities[jj].id) {
						mergeActivities(dbActivities[ii], activities[jj]);
					}
				}
			}

			// actor detail
			findActorMatches(actors, function (error, results) {
				if (error !== null && error !== undefined) {
					callback(error);
				} else {
					for (ii = 0; ii < actors.length; ii++) {
						for (jj = 0; jj < results.length; jj++) {
							if (mergeActors(results[jj], actors[ii])) {
								break;
							}
						}
					}
					callback(null);
				}
			});
		});
	}
}

function buildStatementQuery(parameters) {
	"use strict";
	var query = {};

	if (parameters.verb !== undefined) {
		query.verb = parameters.verb.toLowerCase();
	}
	/*if (parameters.object !== undefined) {
		if (util.isActivity(parameters.object)) {
			query['object
		}
	}*/

	return query;
}

exports.storeActivities = storeActivities;
exports.storeActors = storeActors;
exports.storeProcessedStatements = storeProcessedStatements;
exports.normalizeStatements = normalizeStatements;
exports.buildStatementQuery = buildStatementQuery;