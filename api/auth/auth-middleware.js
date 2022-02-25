const db = require('../../data/dbConfig')

const checkBodyExists = (req, res, next) => {
	if (!req.body.username || !req.body.password) {
		next({ status: 422, message: 'username and password required' })
	} else {
		next()
	}
}

const checkUsernameRegister = async (req, res, next) => {
	try {
		const user = await db('users').where('username', req.body.username)
		if (user.length || user === req.body.username) {
				next({ status: 401, message: 'username taken' })
		} else {
			next()
		}
	} catch (err) {
		next(err)
	}
}

const checkUsernameLogin = async (req, res, next) => {
	try {
		const user = await db('users').where('username', req.body.username)
		if (user.length || user === req.body.username) {
				next()
			} else {
				next({ status: 401, message: 'Invalid credentials' })
		}
	} catch (err) {
		next(err)
	}
}

module.exports = {
	checkUsernameRegister,
	checkBodyExists,
	checkUsernameLogin,
}