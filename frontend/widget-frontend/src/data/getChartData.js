// src/data/getChartData.js
export const getChartData = async () => {
  const [opinionsRes, personsRes, articlesRes] = await Promise.all([
    fetch("https://cnnarticlesapi-production.up.railway.app/opinions"),
    fetch("https://cnnarticlesapi-production.up.railway.app/persons"),
    fetch("https://cnnarticlesapi-production.up.railway.app/articles")
  ]);
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
    article_date: article?.article_date || "Unknown",
    };
  });
  
  const grouped = {};
  const legendInfo = {};
  
  console.log(merged);
  

  merged.forEach(item => {
    const name = item.person_name;
    if (!grouped[name]) grouped[name] = [];
    grouped[name].push({
      x: new Date(item.article_date),
      y: item.sentiment_score,
      r: Math.min(Math.max(item.citation.length / 10, 5), 20),
      tooltip: `${item.person_name}: "${item.citation}" (Article: "${item.article_title}")`,
    });

    if (!legendInfo[name]) {
      const avatarPath = `/src/assets/avatars/${name.toLowerCase().replace(/ /g, "")}.jpg`;
      legendInfo[name] = {
        name,
        party: item.political_party,
        color: getRandomColor(),
        avatar: avatarPath
      };
    }
  });
  
  return { groupedData: grouped, legendData: Object.values(legendInfo) };
  };
  
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.8)`;
  };
  