const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
export { asyncHandler }

// this has been made for the simplicity of the code, it is not necessary to use this function
// you can also use the try-catch block in each route handler