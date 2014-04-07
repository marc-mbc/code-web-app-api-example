define([
], function(){
  
  if(typeof DEBUG === 'undefined') DEBUG = true;

  // http://stackoverflow.com/questions/5456709/create-shortcut-to-console-log-in-chrome
  window.log = function(){};
  if(DEBUG) window.log = console.log.bind(console);

  return window.log;
});