const API_URL = import.meta.env.VITE_APP_API_URL;

export const getEvents = async () => {
  try {
    // Крок 1: Отримуємо список статей
    const articlesResponse = await fetch(`${API_URL}articles/`);
    if (!articlesResponse.ok) {
      throw new Error(`Failed to fetch articles: ${articlesResponse.statusText}`);
    }

    const articles = await articlesResponse.json();

    // Крок 2: Отримуємо список подій
    const eventsResponse = await fetch(`${API_URL}events/`);
    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
    }

    const events = await eventsResponse.json();

    // Крок 3: Зв'язуємо події зі статтями за `article_id` та `fk_article_id`
    const eventsWithArticles = events.map(event => {
      const relatedArticle = articles.find(article => article.article_id === event.fk_origin_article_id);
      
      return {
        id: event.event_id,
        title: event.event_title,
        description: event.description,
        relevanceScore: event.relevance_score,
        date: relatedArticle.article_date, // Дата події
        url: relatedArticle.url, // URL статті
        article: relatedArticle ? relatedArticle.title : 'Unknown Article', // Додаємо назву статті
      };
    });

    // Фільтруємо статті за датою та обмежуємо до 10
    const filteredEvents = eventsWithArticles
      .filter(event => new Date(event.date) < new Date('2024-05-16'))
      .slice(0, 10);

    return filteredEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};