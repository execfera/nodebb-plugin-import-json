const fs = require('fs');

function array(type) {
  const data = JSON.parse(fs.readFileSync(`./input/${type}Data.json`, 'utf8'));
  data.length = Object.keys(data).length + 1;
  fs.writeFileSync(`./input/${type}Data-arr.json`, JSON.stringify(Array.from(data).slice(1), null, 2));
}

array('category');
array('member');
array('post');
array('thread');