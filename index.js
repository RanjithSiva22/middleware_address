const fastify = require('fastify')()
fastify.register(require('fastify-cors'), {})
fastify.register(require('fastify-formbody'))
// fastify.register(require('point-of-view'), {
//     engine: {
//         ejs: require('ejs')
//     }
// })
const excel = require('exceljs');
const Addr = require('./models/address');

const mongoose = require('mongoose');
try {
    mongoose.connect('mongodb+srv://ranjith:sspr2211@@cluster0.1uvio.mongodb.net/codingmart?retryWrites=true&w=majority', { useNewUrlParser: true.valueOf, useUnifiedTopology: true });
    console.log("db connected");
} catch (e) {
    console.error(e);
}


fastify.get('/', (req, reply) => {
    console.log("hi")
    reply.send({ name: 'hello' })
    // reply.view('./screens/book.ejs', { text: 'text' })
})

fastify.post('/check', (req, reply) => {
    console.log("hi")
    console.log(req.body);
    reply.send('saved');
})

fastify.get('/view', async (req, reply) => {
    const data = await Addr.find({});
    reply.send(data);
})




fastify.get('/download', async (req, reply) => {
    const data = await Addr.find({});
    console.log(data);
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Address");

    worksheet.columns = [
        { header: "_id", key: "_id", width: 10 },
        { header: "fullName", key: "fullName", width: 10 },
        { header: "email", key: "email", width: 10 },
        { header: "phoneNumber", key: "phoneNumber", width: 10 },
        { header: "addressLine", key: "addressLine", width: 15 },
        { header: "city", key: "city", width: 25 },
        { header: "state", key: "state", width: 10 },
        { header: "postcode", key: "postcode", width: 10 },
        { header: "country", key: "country", width: 10 },

    ];

    // Add Array Rows
    worksheet.addRows(data);
    var today = new Date();
    var year = today.getFullYear();
    var mes = today.getMonth() + 1;
    var dia = today.getDate();
    var fecha = dia + "-" + mes + "-" + year;
    const fileName = "address_" + fecha + ".xlsx";
    // res is a Stream object
    reply.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    reply.header(
        "Content-Disposition",
        "attachment; filename=" + fileName
    );
    const buffer = await workbook.xlsx.writeBuffer()
    reply.send(buffer)

    // reply.send(data);
})


fastify.post('/address', async (req, reply) => {
    // console.log(req.body);
    const { fullName, email, phoneNumber, addressLine, city, state, postcode, country } = req.body;
    const obj = {
        fullName, email, phoneNumber, addressLine, city, state, postcode, country
    }
    console.log(obj);

    try {

        const newAddr = await Addr.create(obj);
        reply.code(201).send('saved');
        // reply.view('./screens/address.ejs', { text: 'text' })

    } catch (e) {
        reply.code(500).send(e);
    }




})




fastify.listen(process.env.PORT, '0.0.0.0', err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
})
