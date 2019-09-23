const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const app = res.body[0];
                expect(app).to.include.all.keys(
                    "App", "Category", "Rating", "Reviews", "Size", "Installs", "Type", "Price", "Content Rating", "Genres", "Last Updated", "Current Ver","Android Ver"
                );
            });
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Mistake' })
            .expect(400, 'Sort must be one of Rating or App');
    });

    it('should be 400 if genre is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: 'Mistake' });
    });

    it('should sort App in ascending order', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1.App < appAtI.App) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should sort Rating in descending order', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1) {
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if (appAtIPlus1.Rating > appAtI.Rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            });
    });

    it('should filter apps by Genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let filtered = true;
                let i = 0;
                while (i < res.body.length) {
                    let appAtI = res.body[i].Genres;
                    if (appAtI.includes('Action') === false) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(filtered).to.be.true;
            });
    });
});