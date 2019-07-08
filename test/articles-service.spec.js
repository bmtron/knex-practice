const ArticlesService = require('../src/articles-service')
const knex = require('knex')

describe('Articles Service object', function() {
    let db
    let testArticles = [
        {
            content: 'Lorem ipsum yadda yadda yadda',
            date_published: new Date('2029-01-22T16:28:32.615Z'),
            id: 1,
            title: 'First test post!',
            
        },
        {
            content: 'Lorem ipsum yadda yadda yadda',
            date_published: new Date('2100-05-22T16:28:32.615Z'),
            id: 2,
            title: 'Second test post!',
        },
        {
            content: 'Lorem ipsum yadda yadda yadda',
            date_published: new Date('1919-12-22T16:28:32.615Z'),
            id: 3,
            title: 'Third test post!',
        }
    ]
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    after(() => db.destroy())

    afterEach(() => db('blogful_articles').truncate())

    before(() => db('blogful_articles').truncate())
     
    context('Given blogful_articles has data', () => {
        beforeEach(() => {
            return db
                .into('blogful_articles')
                .insert(testArticles)
            })
        it('getAllArticles() resolves all articles from \'blogfil_articles\' table', () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                expect(actual).to.eql(testArticles)
            })
        })
        it('getById() resolves an article by id from blogful_articles table', () => {
            const thirdId = 3
            const thirdTestArticle = testArticles[thirdId - 1]
            return ArticlesService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        content: thirdTestArticle.content,
                        date_published: thirdTestArticle.date_published,
                        id: thirdId,
                        title: thirdTestArticle.title
                    })
                })
        })
        it('deleteArticle() removes an article by id from blogful_articles', () => {
            const articleId = 3
            return ArticlesService.deleteArticle(db, articleId)
            .then(() => ArticlesService.getAllArticles(db))
            .then(allArticles => {
                const expected = testArticles.filter(article => article.id !== articleId)
                expect(allArticles).to.eql(expected)
            })
        })
        it('updateArticle() updates an article from the blogful_articles table', () => {
            const idOfArticleToUpdate = 3
            const newArticleData = {
                title: 'updated title',
                content: 'updated content',
                date_published: new Date()
            }
            return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
            .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
            .then(article => {
                expect(article).to.eql({
                    id: idOfArticleToUpdate,
                    ...newArticleData
                })
            })
        })

    })
    context('Given blogful_articles has no data', () => {
        it('getAllArticles() resolves an empty array', () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                expect(actual).to.eql([])
            })
        })
    })
    it('insertArticle() inserts a new article and resolves with an id', () => {
        const newArticle = {
            title: 'test title',
            content: 'Test new content',
            date_published: new Date('2020-01-01T00:00:00.000Z')
        }
        return ArticlesService.insertArticle(db, newArticle)
            .then(actual => {
                expect(actual).to.eql({
                    id: 1,
                    title: newArticle.title,
                    content: newArticle.content,
                    date_published: newArticle.date_published
                })
            })
    })
    
})
