// src/data/getChartData.js
export const getLegendData = async () => {
  try {
    const [opinionsRes, personsRes, articlesRes] = await Promise.all([
      fetch("https://cnnarticlesapi-production.up.railway.app/opinions"),
      fetch("https://cnnarticlesapi-production.up.railway.app/persons"),
      fetch("https://cnnarticlesapi-production.up.railway.app/articles")
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

    // Групування даних по персоні
    const groupedByPerson = merged.reduce((acc, item) => {
      const personName = item.person_name;
      if (!acc[personName]) {
        acc[personName] = [];
      }
      acc[personName].push(item);
      return acc;
    }, {});


    
    return {events: Object.values(groupedByPerson).flat().slice(1, 50)}; // Повертаємо згруповані дані
  } catch (error) {
    console.error("Error in getLegendData:", error);
    return {}; // Повертаємо порожній об'єкт у разі помилки
  }
};