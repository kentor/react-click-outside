const jsdom = require('jsdom');

global.navigator = { userAgent: 'node.js' };
global.window = new jsdom.JSDOM('<!doctype html>').window;

global.document = global.window.document;
