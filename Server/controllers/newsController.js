const axios = require("axios")

const getNews = async (req, res) => {
    try {
        const response = await axios.get(
            "https://newsapi.org/v2/top-headlines",
            {
                params:{
                    country:"us",
                    apiKey:process.env.NEWS_API_KEY
                }
            }

        );
        res.json(response.data);
    }
    catch(error){
        console.log(error.response?.data || error.message);
        res.status(500).json({
            message:"Failed to fetch news"
        });   
    }
};

module.exports={getNews};