module.exports = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,

   
    tlsOptions: {
      rejectUnauthorized: false,
      servername: "imap.gmail.com",
    },

    authTimeout: 10000,   // ⬅️ 10 seconds
  connTimeout: 10000,   // ⬅️ 10 seconds
  socketTimeout: 10000 // ⬅️ 10 seconds
  },
};
