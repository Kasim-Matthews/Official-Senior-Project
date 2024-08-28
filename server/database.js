module.exports = {
    user: process.env.Database_user,
    password: process.env.Password,
    host: process.env.Host,
    port: 5432,
    database: process.env.Database_name,
    ssl: true,
    connectionString: process.env.ConnectionString
}


