const searchEngine = require('../searchEngine');
export const searchQuery = async (req, res, next) => {
    const { query } = req.body;

    const result = await searchEngine.search(query);
    if (error) return next(ApiError.ServerError);
    if (response.statusCode == 401) return next(ApiError.NotAuthoraize);
    res.status(200).json(body);
}