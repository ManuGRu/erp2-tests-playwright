// dbHelper.js
const { Client } = require('pg');
const SSHClient = require('ssh2').Client;
const net = require('net');
const fs = require('fs');

async function testDbQuery(tableName) {
  console.log('Connecting to database via SSH tunnel...');

  const sshConfig = {
    host: 'test2.erp-levtech.ro',
    port: 22,
    username: 'econfaire',
    privateKey: fs.readFileSync('C:\\Users\\emanuel.rusu\\.ssh\\server\\id_rsa'),
    // passphrase: 'your_private_key_passphrase', // Uncomment if your key is encrypted
  };

  const forwardConfig = {
    srcHost: '127.0.0.1', // Local interface
    srcPort: 5433,        // Local port for the tunnel
    dstHost: 'localhost', // Database host as seen from the SSH server
    dstPort: 5432,        // Database port
  };

  const pgConfig = {
    host: forwardConfig.srcHost,
    port: forwardConfig.srcPort,
    user: 'postgres',
    database: 'ecf_auction_document',
    password: 'MovonUcec5',
    // ssl: { rejectUnauthorized: false }, // Adjust SSL settings if necessary
  };

  return new Promise((resolve, reject) => {
    const sshClient = new SSHClient();

    sshClient.on('ready', () => {
      console.log('SSH Client :: ready');

      // Create a local TCP server
      const server = net.createServer((localSocket) => {
        console.log('Client connected to local TCP server');

        sshClient.forwardOut(
          localSocket.remoteAddress,
          localSocket.remotePort,
          forwardConfig.dstHost,
          forwardConfig.dstPort,
          (err, stream) => {
            if (err) {
              console.error('SSH forwardOut error:', err);
              localSocket.end();
              return;
            }

            // Pipe data between the local socket and the SSH stream
            localSocket.pipe(stream).pipe(localSocket);

            // Ensure streams are closed properly
            stream.on('close', () => {
              localSocket.end();
            });

            localSocket.on('close', () => {
              stream.end();
            });
          }
        );
      });

      server.listen(forwardConfig.srcPort, forwardConfig.srcHost, async () => {
        console.log(`TCP server listening on ${forwardConfig.srcHost}:${forwardConfig.srcPort}`);

        // Allow Node.js to exit if this is the only active server
        server.unref();

        const client = new Client(pgConfig);

        client.connect()
          .then(() => {
            console.log('Database client connected via SSH tunnel');

            return client.query(`SELECT * FROM public."${tableName}"`);
          })
          .then((dataRes) => {
            const dataRows = dataRes.rows;

            return client.end()
              .then(() => {
                server.close(() => {
                  console.log('TCP server closed');
                });
                sshClient.end();
                resolve({ data: dataRows });
              });
          })
          .catch((err) => {
            console.error('Database operation failed:', err);
            client.end().catch(() => {});
            server.close(() => {
              console.log('TCP server closed after error');
            });
            sshClient.end();
            reject(err);
          });
      });

      server.on('error', (err) => {
        console.error('Server error:', err);
        server.close(() => {
          console.log('TCP server closed due to error');
        });
        sshClient.end();
        reject(err);
      });
    });

    sshClient.on('error', (err) => {
      console.error('SSH connection error:', err);
      sshClient.end();
      reject(err);
    });

    sshClient.connect(sshConfig);
  });
}

module.exports = { testDbQuery };
