const fs = require('fs');
const pg = require('pg');
const url = require('url');

const config = {
    user: "avnadmin",
    password: "<redacted>",
    host: "examen02-dvd-yorkersaxon-013c.c.aivencloud.com",
    port: 23799,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIERDCCAqygAwIBAgIUBvLmaYLpliMflTB5eDBRWL8zZpUwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZWRiZDA3MDEtMjRhMi00ZTEyLThhYTgtNGJlOWIwYzYw
ZjM3IFByb2plY3QgQ0EwHhcNMjYwNTA0MDIzNzM3WhcNMzYwNTAxMDIzNzM3WjA6
MTgwNgYDVQQDDC9lZGJkMDcwMS0yNGEyLTRlMTItOGFhOC00YmU5YjBjNjBmMzcg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAKhTZp43
5ITyWWRg/QMxZ5LHNHXsELbs/mRUrL3/8ofhqm9Uw+e9QhMrJ5ikpdgWmAQeCs3j
jOAaHYpnhukQEX5qKvzhbumnlczQlQTYBVs7NMVjRAhmpYZQLFDoXSGEbTvXjDxw
T0Ww/I68f49Wy2pDMWy57ApsShVcGkq/0djhlD93K5CtmS4EeFQ6zjGyT7TXQPtA
novW6f3jKpNEtJSx8tX2PQAu1G6ONAZ1snQjBeAlG3+6KmQNwbbQaGLAYIl3mjki
JlPHSFR4zairLZ4UFgEqMAp19t6+HGeNlx8zYdDYGEq0LV9Q5Qipi9EmpkVi28nq
EoQGP05T5dOa1fidzrQ0jFPQPFrluYnYEHzaB2ytzwV4jkKYqkyYhcpjafg6jTwn
SeMwqdnvFsnq7O7Bg36srOfpeXAziEoiT+FKW4A6ZhF3s91LN/avqh+tsd5DknGQ
YmmRs2mUGOSCTkq1wZfGD87cA2GxDnYUmbB350INei54KIsVhvspRvfFhQIDAQAB
o0IwQDAdBgNVHQ4EFgQUrTn/amWe7bkllEkjP9EJOnZlUocwEgYDVR0TAQH/BAgw
BgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAGEp0XmhDZZF
/7/2IK5u5iiahC9BTl/s3jfAQDvWJySZf3iJMOLBNfaeeP2BJ+vo5j8DlNvhdYHn
Kqt9VdJ5D1fMG/ULmVarssBqgqzKk5n1YJ/T9ZzUugMIq4D7fs/GWT5ewNsMljJF
LdKl6oLyn7jIaPkTSRRReO3//2ZBf9rHFu5FQUgg1bI1yR701MiUh/H/v7FFKIJT
dHVokZeKeDdQrdfyBpdfmTQAc6XxB0uom7onMiSPWWoI9cxXuz0IcmulBeCQXJKN
27DILqp6bd9l+RZ/5AXtboEx+dw0/GWVNW6nbE87OYybx0Eh2jgXk1Ef7f6KPF/Y
qQ4skWJAqvKEHoCjwNjNSyRjX7cgih+aKnnlrgbLAwkREJuo8eWPG+Sm6zv1bF3k
8AKGh8/91xkn1QSVoZdUP2MQtOE5KQtWcxzjbwOpFtgDVlB3PRC0JVGc376eG0qz
6a3Aw7Bgyw7zrGN9lABydzYFBe0nnW+X6S8xAb6Ar6/11B3SgaiRfg==
-----END CERTIFICATE-----`,
    },
};

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});