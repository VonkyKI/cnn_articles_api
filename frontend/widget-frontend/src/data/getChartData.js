export const getChartData = async () => {
  
  const API_URL = import.meta.env.VITE_APP_API_URL;
  

  try {
    const [opinionsRes, personsRes, articlesRes] = await Promise.all([
      fetch(`${API_URL}opinions/?is_selected=1`),
      fetch(`${API_URL}persons`),
      fetch(`${API_URL}articles`)
    ]);

    if (!opinionsRes.ok || !personsRes.ok || !articlesRes.ok) {
      throw new Error("Failed to fetch data from one or more endpoints");
    }

    const [opinions, persons, articles] = await Promise.all([
      opinionsRes.json(),
      personsRes.json(),
      articlesRes.json()
    ]);

    const merged = opinions.map(opinion => {
      const person = persons.find(p => p.person_id === opinion.fk_person_id);
      const article = articles.find(a => a.article_id === opinion.fk_origin_article_id);
      return {
        ...opinion,
        person_name: person?.person_name || "Unknown",
        political_party: person?.political_party || "Unknown",
        article_title: article?.title || "Unknown",
        article_url: article?.url || "#",
        article_date: article?.article_date && !isNaN(new Date(article.article_date).getTime())
          ? new Date(article.article_date).toISOString().split("T")[0]
          : "Unknown",
      };
    });
    

    return {
      eventsData: Object.values(merged).flat(), //.slice(1, 50)
    };
  } catch (error) {
    console.error("Error in getChartData:", error);
    return { eventsData: [] }; // Повертаємо порожні дані у разі помилки
  }
};

