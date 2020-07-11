// function search2dict() {
//   const searchString = location.search;
//   if (searchString.length == 0) return {};
//
//   const search = searchString.substr(1);
//
//   const keyvalues = search.split('&');
//   const entries = keyvalues.map(keyvalue => keyvalue.split('=', 2)).map(entry => entry.length == 1 ? [ entry[0], null] : entry).filter(entry => entry[0].length != 0);
//
//   return Object.fromEntries(entries);
// }
// function hash2value() {
//   const hashString = location.hash;
//   if (hashString.length == 0) return null;
//
//   return hashString.substr(1);
// }
function validateGistId(gistId) {
  return gistId.toLowerCase().match(/^[a-z0-9]{32}$/);
}
function path2gistId() {
  const path = location.pathname.substr(1);
  const userPath = path.split('/');
  if (userPath.length > 2) return null;

  return userPath[userPath.length-1];
}
function isRoot() {
  return location.pathname == '/';
}
function redirectToRoot() {
  if (isRoot()) { location.reload(); return; }
  location.href = '/';
}
function redirectToRootIfNotRoot() {
  if (isRoot()) return;
  location.href = '/';
}

function createGistUrl(gistId) {
  if (! gistId) return null;
  return `https://api.github.com/gists/${gistId}`;
}
function getGist(gistId) {
  return new Promise(function(resolve, reject) {
    const url = createGistUrl(gistId);

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', url);

    xhr.onload = function() {
      if (xhr.readyState != 4) return;
      if (xhr.status != 200) {
        reject([xhr, xhr.error]);
        return;
      }

      const info = {
        'ratelimit': {
          'limit': xhr.getResponseHeader('X-Ratelimit-Limit'),
          'remaining': xhr.getResponseHeader('X-Ratelimit-Remaining'),
          'reset': xhr.getResponseHeader('X-Ratelimit-Reset'),
        },
      };

      const json = xhr.response;
      resolve([json, info]);
    };
    xhr.onerror = function(error) {
        reject([xhr, error]);
    };

    xhr.send(null);
  });
}
