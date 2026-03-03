const https = require('https');
const fs = require('fs');

https.get('https://van.peterstransit.com/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('peterstransit_node.html', data);
    console.log("Done");
  });
});
