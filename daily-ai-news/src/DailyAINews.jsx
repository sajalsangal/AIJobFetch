import React, { useEffect, useState } from "react";

const AINewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "fae339e545184d04940612ef5c47c993"; // 
  const URL = `https://newsapi.org/v2/everything?q=artificial+intelligence&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(URL);
        const data = await res.json();
        setNews(data.articles || []);
      } catch (error) {
        console.error("Error fetching AI news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 animate-pulse">Loading AI news...</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Latest in Artificial Intelligence
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 flex flex-col justify-between h-60">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {article.description || "No description available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-800"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AINewsSection;


