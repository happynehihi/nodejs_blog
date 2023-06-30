const validateRequest = (req, res, next) => {
    const errorResponses = []

    if (!req.body.fullname || !/^[a-zA-ZÀ-ỹ ]+$/.test(req.body.fullname)) {
        errorResponses.push({ message: 'Fullname is invalid' })
    }

    if (!req.body.age || req.body.age <= 0) {
        errorResponses.push({ message: 'Age is invalid' })
    }

    if (errorResponses.length > 0) {
        return res.status(400).json(errorResponses)
    }

    next()
}

export { validateRequest }
