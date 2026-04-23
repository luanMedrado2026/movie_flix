CREATE VIEW vw_top_filmes AS
SELECT 
  m.title,
  m.genre,
  ROUND(AVG(f.rating), 2) AS media,
  COUNT(*) AS total_avaliacoes
FROM fact_ratings f
JOIN dim_movies m ON f.movie_id = m.movie_id
GROUP BY m.title, m.genre
HAVING COUNT(*) > 5
ORDER BY media DESC;

CREATE VIEW vw_media_filmes AS
SELECT 
  m.title,
  ROUND(AVG(f.rating), 2) AS media
FROM fact_ratings f
JOIN dim_movies m ON f.movie_id = m.movie_id
GROUP BY m.title;

CREATE VIEW vw_avaliacoes_por_dia AS
SELECT 
  d.full_date,
  COUNT(*) AS total_avaliacoes
FROM fact_ratings f
JOIN dim_date d ON f.date_id = d.date_id
GROUP BY d.full_date
ORDER BY d.full_date;

SELECT 
  m.title,
  COUNT(*) AS total_avaliacoes
FROM fact_ratings f
JOIN dim_movies m ON f.movie_id = m.movie_id
GROUP BY m.title
ORDER BY total_avaliacoes DESC
LIMIT 5;

SELECT 
  m.genre,
  ROUND(AVG(f.rating), 2) AS media
FROM fact_ratings f
JOIN dim_movies m ON f.movie_id = m.movie_id
GROUP BY m.genre
ORDER BY media DESC
LIMIT 1;

SELECT 
  u.user_id,
  COUNT(*) AS total_avaliacoes
FROM fact_ratings f
JOIN dim_users u ON f.user_id = u.user_id
GROUP BY u.user_id
ORDER BY total_avaliacoes DESC
LIMIT 5;

SELECT 
  m.title,
  ROUND(AVG(f.rating), 2) AS media,
  COUNT(*) AS total
FROM fact_ratings f
JOIN dim_movies m ON f.movie_id = m.movie_id
GROUP BY m.title
HAVING COUNT(*) > 10
ORDER BY media DESC
LIMIT 1;

