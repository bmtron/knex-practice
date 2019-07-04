const knex = require('knex')
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

function searchByText(text) {
    knexInstance.from('shopping_list')
    .select('*')
    .where('name'.toLowerCase(), 'ILIKE', `%${text}%`.toLowerCase())
    .then(result => {
        console.log(result)
    })
}

function paginateToSix(num) {
    const productsPerPage = 6
    const offset = productsPerPage * (num - 1)

    knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
        console.log(result)
    })
}

function getItemsByDate(daysAgo) {
    knexInstance
    .select('*')
    .from('shopping_list')
    .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
    .then(result => {
        console.log(result)
    })
}

function totalPriceByCategory() {
    knexInstance('shopping_list')
    .select('category')
    .sum('price')
    .groupBy('category')
    .then(result => {
        console.log(result)
    })
}

totalPriceByCategory()