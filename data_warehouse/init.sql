-- =========================================
-- DROP TABLES (caso já existam)
-- =========================================

DROP TABLE IF EXISTS fact_ratings CASCADE;
DROP TABLE IF EXISTS dim_date CASCADE;
DROP TABLE IF EXISTS dim_movies CASCADE;
DROP TABLE IF EXISTS dim_users CASCADE;

-- =========================================
-- DIMENSÃO: USERS
-- =========================================

CREATE TABLE dim_users (
    user_id INT PRIMARY KEY,
    name TEXT,
    email TEXT
);

-- =========================================
-- DIMENSÃO: MOVIES
-- =========================================

CREATE TABLE dim_movies (
    movie_id TEXT PRIMARY KEY,
    title TEXT,
    year INT,
    genre TEXT,
    director TEXT
);

-- =========================================
-- DIMENSÃO: DATE
-- =========================================

CREATE TABLE dim_date (
    date_id SERIAL PRIMARY KEY,
    full_date DATE UNIQUE,
    year INT,
    month INT,
    day INT,
    day_of_week INT,
    month_name VARCHAR(20)
);

-- =========================================
-- FATO: RATINGS
-- =========================================

CREATE TABLE fact_ratings (
    id SERIAL PRIMARY KEY,
    user_id INT,
    movie_id TEXT,
    rating INT,
    date_id INT
);

-- =========================================
-- ÍNDICES (melhor performance)
-- =========================================

CREATE INDEX idx_fact_user ON fact_ratings(user_id);
CREATE INDEX idx_fact_movie ON fact_ratings(movie_id);
CREATE INDEX idx_fact_date ON fact_ratings(date_id);

-- =========================================
-- FUNÇÃO PARA INSERIR DATA (evita duplicação)
-- =========================================

CREATE OR REPLACE FUNCTION get_or_create_date(p_date DATE)
RETURNS INT AS $$
DECLARE
    v_date_id INT;
BEGIN
    -- tenta buscar
    SELECT date_id INTO v_date_id
    FROM dim_date
    WHERE full_date = p_date;

    -- se não existir, insere
    IF v_date_id IS NULL THEN
        INSERT INTO dim_date (
            full_date,
            year,
            month,
            day,
            day_of_week,
            month_name
        )
        VALUES (
            p_date,
            EXTRACT(YEAR FROM p_date),
            EXTRACT(MONTH FROM p_date),
            EXTRACT(DAY FROM p_date),
            EXTRACT(DOW FROM p_date),
            TO_CHAR(p_date, 'Month')
        )
        RETURNING date_id INTO v_date_id;
    END IF;

    RETURN v_date_id;
END;
$$ LANGUAGE plpgsql;

-- =========================================
-- VIEWS (opcional - pra análise)
-- =========================================

CREATE OR REPLACE VIEW vw_ratings_detailed AS
SELECT
    f.id,
    u.user_id,
    u.age,
    u.gender,
    m.movie_id,
    m.title,
    m.genres,
    d.full_date,
    d.year,
    d.month,
    f.rating
FROM fact_ratings f
JOIN dim_users u ON f.user_id = u.user_id
JOIN dim_movies m ON f.movie_id = m.movie_id
JOIN dim_date d ON f.date_id = d.date_id;

-- =========================================
-- EXEMPLOS DE CONSULTAS (pra apresentação)
-- =========================================

-- Média de avaliação por filme
-- SELECT m.title, AVG(f.rating) as avg_rating
-- FROM fact_ratings f
-- JOIN dim_movies m ON f.movie_id = m.movie_id
-- GROUP BY m.title
-- ORDER BY avg_rating DESC;

-- Avaliações por mês
-- SELECT d.year, d.month, COUNT(*) as total
-- FROM fact_ratings f
-- JOIN dim_date d ON f.date_id = d.date_id
-- GROUP BY d.year, d.month
-- ORDER BY d.year, d.month;

-- Usuários que mais avaliam
-- SELECT u.user_id, COUNT(*) as total
-- FROM fact_ratings f
-- JOIN dim_users u ON f.user_id = u.user_id
-- GROUP BY u.user_id
-- ORDER BY total DESC;