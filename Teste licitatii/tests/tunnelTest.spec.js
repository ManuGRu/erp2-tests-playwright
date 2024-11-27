const { Client: SSHClient } = require('ssh2');
const fs = require('fs');

const conn = new SSHClient();
conn.on('ready', () => {
  console.log('SSH Client :: ready');
  conn.forwardOut(
    '127.0.0.1', // Source address
    12345, // Source port (arbitrary local port)
    '127.0.0.1', // Destination address (DB server)
    5432, // Destination port (DB port)
    (err, stream) => {
      if (err) {
        console.error('SSH Tunnel Error:', err);
        conn.end();
        return;
      }
      console.log('SSH Tunnel established successfully');
      stream.end(); // Close the stream after testing
      conn.end(); // Close the SSH connection
    }
  );
}).connect({
  host: 'https://test2.erp-levtech.ro/', // Replace with your server's IPv4 address
  port: 22,
  username: 'econfaire',
  privateKey: fs.readFileSync('C:\\Users\\emanuel.rusu\\.ssh\\server\\id_rsa'),
});
