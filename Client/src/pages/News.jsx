import React, { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(`${API}/api/news`);
                setArticles(response.data.articles);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch news");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h3>Loading News...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Latest News</h2>

            <div className="row">
                {articles.map((article) => (
                    <div className="col-md-4 mb-4" key={article.title}>
                        <div className="card h-100 shadow">
                            {article.urlToImage && (
                                <img
                                    src={article.urlToImage}
                                    className="card-img-top"
                                    alt={article.title}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            )}

                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">
                                    {article.description || "No description available."}
                                </p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Read More
                                </a>
                            </div>

                            <div className="card-footer">
                                <small className="text-muted">
                                    {article.source?.name || "Unknown Source"}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {articles.length === 0 && (
                <div className="alert alert-info text-center">
                    No news articles available.
                </div>
            )}
        </div>
    );
};

export default News;