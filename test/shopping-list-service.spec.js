const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping List service object', function() {
    let db
    let testItems = [
        {
            id: 1,
            name: 'Test 1',
            price: "15.00",
            date_added: new Date('2029-01-22T05:00:00.000Z'),
            checked: false,
            category: 'Main'
        },
        {
            id: 2,
            name: 'Test 2',
            price: "16.75",
            date_added: new Date('2029-01-22T05:00:00.000Z'),
            checked: true,
            category: 'Snack'
        },
        {
            id: 3,
            name: 'Test 3',
            price: "5.00",
            date_added: new Date('2029-01-22T05:00:00.000Z'),
            checked: false,
            category: 'Breakfast'
        }
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })
    
    after(() => db.destroy())
    afterEach(() => db('shopping_list').truncate())
    before(() => db('shopping_list').truncate())
    
    context('given shopping_list has data', () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testItems)
        })
        it('getAllItems() resolves all items from shopping_list table', () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql(testItems)
            })
        })
        it('getById() resolves a specific item by its id from shopping list table', () => {
            const newId = 3
            const thirdTestItem = testItems[newId - 1]

            return ShoppingListService.getById(db, newId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: newId,
                        name: thirdTestItem.name,
                        price: thirdTestItem.price,
                        date_added: thirdTestItem.date_added,
                        checked: thirdTestItem.checked,
                        category: thirdTestItem.category
                    })
                })
        })
        it('deleteItem() removes an item from the shopping list table by id', () => {
            const itemId = 3
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllItems(db))
                .then(all => {
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(all).to.eql(expected)
                })
        })
        it('updateItem() updates an item in the shopping list table', () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: "Updated Item",
                price: "0.00",
                date_added: new Date('1991-12-31T05:00:00.000Z'),
                checked: true,
                category: 'Main'
            }

            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
            .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
            .then(item => {
                expect(item).to.eql({
                    id: idOfItemToUpdate,
                    ...newItemData
                })
            })
        })
    })
    context('given shopping_list has no data', () => {
        it('getAllArticles() resolves an empty array', () => {
            return ShoppingListService.getAllItems(db)
            .then(actual => {
                expect(actual).to.eql([])
            })
        })
        it('insertItem() inserts a new item into the shopping list table', () => {
            const newItem = {
                name: 'New Item',
                price: "9.99",
                date_added: new Date('2019-12-30T05:00:00.000Z'),
                checked: false,
                category: 'Main'
            }
            return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    date_added: new Date(newItem.date_added),
                    checked: newItem.checked,
                    category: newItem.category
                })
            })
        })
    })

})
