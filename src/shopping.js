require('dotenv').config()

const knex = require('knex')
const ShoppingListService = require('./shopping-list-service')
const ArticlesService = require('./articles-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

ArticlesService.insertArticle(knexInstance, ({
    title: 'crap',
    content: 'afdsfasdfasdfasdf'
}))
.then(article => {
    console.log(article)
})
ShoppingListService.insertItem(knexInstance, ({
    name: 'crap',
    price: '0.00',
    checked: false,
    category: 'Main'
})).then(item => console.log(item))
